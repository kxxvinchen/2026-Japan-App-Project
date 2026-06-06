const assert = require('node:assert');
const { describe, it, beforeEach, afterEach } = require('node:test');

// 1. Setup mock framework using Node's require.cache override mechanism.
// This intercepts the require calls in 'index.js' before they hit real node_modules.

let notifyOnMessageTrigger = null;
let sendRemindersTrigger = null;

const mockFirestoreV2 = {
  onDocumentCreated: (pattern, handler) => {
    notifyOnMessageTrigger = handler;
    return handler;
  }
};

const mockSchedulerV2 = {
  onSchedule: (config, handler) => {
    sendRemindersTrigger = handler;
    return handler;
  }
};

const mockV2 = {
  setGlobalOptions: () => {}
};

const mockAdminApp = {
  initializeApp: () => {}
};

const messagingSpies = {
  sendCalls: [],
  sendEachForMulticastCalls: []
};

const mockAdminMessaging = {
  getMessaging: () => ({
    send: async (payload) => {
      messagingSpies.sendCalls.push(payload);
      return 'mock-msg-id';
    },
    sendEachForMulticast: async (payload) => {
      messagingSpies.sendEachForMulticastCalls.push(payload);
      const responses = payload.tokens.map(token => {
        if (token.startsWith('stale-') || token.startsWith('invalid-')) {
          return {
            success: false,
            error: { code: 'messaging/registration-token-not-registered' }
          };
        }
        return { success: true };
      });
      return { responses };
    }
  })
};

let firestoreStore = {
  webTokens: [],
  sentReminders: {},
  reminders: []
};

const firestoreSpies = {
  deletes: [],
  sets: []
};

const mockAdminFirestore = {
  FieldValue: {
    serverTimestamp: () => 'mock-server-timestamp'
  },
  getFirestore: () => ({
    collection: (collName) => ({
      doc: (docId) => ({
        id: docId,
        ref: { id: docId, collection: collName },
        get: async () => {
          if (collName === 'sentReminders') {
            return {
              exists: firestoreStore.sentReminders[docId] !== undefined,
              data: () => firestoreStore.sentReminders[docId] || null
            };
          }
          return { exists: false, data: () => null };
        },
        set: async (data) => {
          firestoreSpies.sets.push({ collection: collName, docId, data });
          if (collName === 'sentReminders') {
            firestoreStore.sentReminders[docId] = data;
          }
        },
        delete: async () => {
          firestoreSpies.deletes.push({ collection: collName, docId });
          if (collName === 'webTokens') {
            firestoreStore.webTokens = firestoreStore.webTokens.filter(t => t.id !== docId);
          }
        }
      }),
      where: (field, op, val) => ({
        get: async () => {
          let docs = [];
          if (collName === 'webTokens') {
            docs = firestoreStore.webTokens.filter(t => {
              if (field === 'channels' && op === 'array-contains') {
                return t.channels.includes(val);
              }
              return false;
            });
          } else if (collName === 'reminders') {
            docs = firestoreStore.reminders.filter(r => {
              if (field === 'fireAtMs' && op === '<=') {
                return r.fireAtMs <= val;
              }
              return false;
            });
          }
          return {
            docs: docs.map(d => ({
              id: d.id,
              ref: {
                id: d.id,
                collection: collName,
                delete: async () => {
                  firestoreSpies.deletes.push({ collection: collName, docId: d.id });
                }
              },
              data: () => d
            }))
          };
        }
      })
    }),
    batch: () => {
      const deletedDocs = [];
      return {
        delete: (docRef) => {
          deletedDocs.push(docRef.id);
        },
        commit: async () => {
          deletedDocs.forEach(id => {
            firestoreSpies.deletes.push({ collection: 'reminders', docId: id });
            firestoreStore.reminders = firestoreStore.reminders.filter(r => r.id !== id);
          });
        }
      };
    }
  })
};

// Pre-populate require cache so that our mock objects are loaded by index.js
const populateCache = (moduleName, mockExport) => {
  const resolvedPath = require.resolve(moduleName);
  require.cache[resolvedPath] = {
    id: resolvedPath,
    filename: resolvedPath,
    loaded: true,
    exports: mockExport
  };
};

populateCache('firebase-functions/v2/firestore', mockFirestoreV2);
populateCache('firebase-functions/v2/scheduler', mockSchedulerV2);
populateCache('firebase-functions/v2', mockV2);
populateCache('firebase-admin/app', mockAdminApp);
populateCache('firebase-admin/messaging', mockAdminMessaging);
populateCache('firebase-admin/firestore', mockAdminFirestore);

// Load functions logic after setting up cache
require('../notifications/functions/index.js');

// 2. Define the Test Suite
describe('Notification System Unit Tests', () => {
  beforeEach(() => {
    // Reset spies
    messagingSpies.sendCalls = [];
    messagingSpies.sendEachForMulticastCalls = [];
    firestoreSpies.deletes = [];
    firestoreSpies.sets = [];

    // Reset default database state
    firestoreStore.webTokens = [
      { id: 'w1', token: 'token-swesso-1', channels: ['swesso'] },
      { id: 'w2', token: 'token-choir-1', channels: ['choir'] },
      { id: 'w3', token: 'stale-token-swesso', channels: ['swesso'] }
    ];
    firestoreStore.sentReminders = {};
    firestoreStore.reminders = [];
  });

  describe('notifyOnMessage', () => {
    it('should register the function trigger', () => {
      assert.strictEqual(typeof notifyOnMessageTrigger, 'function');
    });

    it('should ignore events with invalid or non-whitelisted channels', async () => {
      const event = {
        params: { channel: 'invalid-channel', id: 'm1' },
        data: {
          data: () => ({ author: 'Director', title: 'Hello', text: 'World' })
        }
      };
      await notifyOnMessageTrigger(event);
      assert.strictEqual(messagingSpies.sendCalls.length, 0);
    });

    it('should ignore events when data snapshot is empty', async () => {
      const event = {
        params: { channel: 'swesso', id: 'm1' },
        data: null
      };
      await notifyOnMessageTrigger(event);
      assert.strictEqual(messagingSpies.sendCalls.length, 0);
    });

    it('should send announcement and multicast to channel subscribers', async () => {
      const event = {
        params: { channel: 'swesso', id: 'm1' },
        data: {
          data: () => ({ author: 'Director', title: 'Schedule Update', text: 'Please check your schedules.' })
        }
      };
      await notifyOnMessageTrigger(event);

      // Verify topic send
      assert.strictEqual(messagingSpies.sendCalls.length, 1);
      assert.strictEqual(messagingSpies.sendCalls[0].topic, 'swesso');
      assert.strictEqual(messagingSpies.sendCalls[0].notification.title, 'Schedule Update');
      assert.strictEqual(messagingSpies.sendCalls[0].notification.body, 'Please check your schedules.');

      // Verify multicast send to web tokens
      assert.strictEqual(messagingSpies.sendEachForMulticastCalls.length, 1);
      const multicastCall = messagingSpies.sendEachForMulticastCalls[0];
      assert.deepStrictEqual(multicastCall.tokens, ['token-swesso-1', 'stale-token-swesso']);
      assert.strictEqual(multicastCall.notification.title, 'Schedule Update');
    });

    it('should format title with author for multi-sender channels (e.g. directors)', async () => {
      const event = {
        params: { channel: 'directors', id: 'm1' },
        data: {
          data: () => ({ author: 'John Doe', text: 'Director meeting in 5' })
        }
      };
      await notifyOnMessageTrigger(event);

      // Title should be "John Doe · Directors" (since Directors is the label for directors channel)
      assert.strictEqual(messagingSpies.sendCalls[0].notification.title, 'John Doe · Directors');
    });

    it('should format title with author for chaperone channels (e.g. swesso-chap)', async () => {
      const event = {
        params: { channel: 'swesso-chap', id: 'm1' },
        data: {
          data: () => ({ author: 'Jane Smith', text: 'Luggage loading check' })
        }
      };
      await notifyOnMessageTrigger(event);

      // Title should be "Jane Smith · SWE/SSO Chaperones"
      assert.strictEqual(messagingSpies.sendCalls[0].notification.title, 'Jane Smith · SWE/SSO Chaperones');
    });

    it('should truncate message text body to 180 characters', async () => {
      const longText = 'A'.repeat(250);
      const event = {
        params: { channel: 'swesso', id: 'm1' },
        data: {
          data: () => ({ author: 'Director', title: 'Long Message', text: longText })
        }
      };
      await notifyOnMessageTrigger(event);
      assert.strictEqual(messagingSpies.sendCalls[0].notification.body.length, 180);
      assert.strictEqual(messagingSpies.sendCalls[0].notification.body, 'A'.repeat(180));
    });

    it('should batch multicast send in chunks of 500 tokens', async () => {
      // Generate 1200 web tokens
      const largeTokensList = [];
      for (let i = 0; i < 1200; i++) {
        largeTokensList.push({ id: `w_${i}`, token: `token-${i}`, channels: ['swesso'] });
      }
      firestoreStore.webTokens = largeTokensList;

      const event = {
        params: { channel: 'swesso', id: 'm1' },
        data: {
          data: () => ({ author: 'Director', title: 'Announcement', text: 'Hello' })
        }
      };
      await notifyOnMessageTrigger(event);

      // 1200 tokens should be chunked into 3 multicast requests: 500, 500, and 200
      assert.strictEqual(messagingSpies.sendEachForMulticastCalls.length, 3);
      assert.strictEqual(messagingSpies.sendEachForMulticastCalls[0].tokens.length, 500);
      assert.strictEqual(messagingSpies.sendEachForMulticastCalls[1].tokens.length, 500);
      assert.strictEqual(messagingSpies.sendEachForMulticastCalls[2].tokens.length, 200);
    });

    it('should clean up stale and invalid registration tokens from firestore', async () => {
      firestoreStore.webTokens = [
        { id: 'w1', token: 'token-swesso-1', channels: ['swesso'] },
        { id: 'w2', token: 'stale-token-swesso', channels: ['swesso'] }
      ];

      const event = {
        params: { channel: 'swesso', id: 'm1' },
        data: {
          data: () => ({ author: 'Director', title: 'Hello', text: 'World' })
        }
      };
      await notifyOnMessageTrigger(event);

      // The stale-token-swesso should cause a deletion request because it starts with 'stale-'
      const deleteCalls = firestoreSpies.deletes.filter(d => d.collection === 'webTokens');
      assert.strictEqual(deleteCalls.length, 1);
      assert.strictEqual(deleteCalls[0].docId, 'w2');

      // The token should be removed from the local store
      assert.strictEqual(firestoreStore.webTokens.length, 1);
      assert.strictEqual(firestoreStore.webTokens[0].id, 'w1');
    });
  });

  describe('sendReminders', () => {
    let originalDateNow;

    beforeEach(() => {
      originalDateNow = Date.now;
    });

    afterEach(() => {
      Date.now = originalDateNow;
    });

    it('should register the function trigger', () => {
      assert.strictEqual(typeof sendRemindersTrigger, 'function');
    });

    it('should trigger concert reminder if within 1 hour window and not already sent', async () => {
      // JST = UTC + 9
      // at(12, 16, 0) is Choir Friendship Concert
      const concertTime = Date.UTC(2026, 5, 12, 16, 0) - 9 * 3600 * 1000;
      
      // Mock Date.now to 30 mins before concert (should trigger)
      const mockTime = concertTime - 30 * 60 * 1000;
      Date.now = () => mockTime;

      await sendRemindersTrigger();

      // Check that it set the reminder document in Firestore
      const setCall = firestoreSpies.sets.find(s => s.collection === 'sentReminders' && s.docId === 'c-jun12-choir');
      assert.ok(setCall);

      // Check that notifications were sent (the choir concert has "choir" channel)
      assert.ok(messagingSpies.sendCalls.length > 0);
      const reminderSend = messagingSpies.sendCalls.find(s => s.topic === 'choir');
      assert.ok(reminderSend);
      assert.ok(reminderSend.notification.title.includes('Friendship Concert'));
    });

    it('should NOT trigger concert reminder if already sent', async () => {
      const concertTime = Date.UTC(2026, 5, 12, 16, 0) - 9 * 3600 * 1000;
      
      // Pre-set in Firestore store to indicate it has already been sent
      firestoreStore.sentReminders['c-jun12-choir'] = { sentAt: 'mock-timestamp' };

      // Mock Date.now to 30 mins before concert
      const mockTime = concertTime - 30 * 60 * 1000;
      Date.now = () => mockTime;

      await sendRemindersTrigger();

      // Check that no new notifications were sent
      assert.strictEqual(messagingSpies.sendCalls.length, 0);
    });

    it('should NOT trigger concert reminder if outside the 1-hour window (too early)', async () => {
      const concertTime = Date.UTC(2026, 5, 12, 16, 0) - 9 * 3600 * 1000;
      
      // Mock Date.now to 70 mins before concert (too early)
      const mockTime = concertTime - 70 * 60 * 1000;
      Date.now = () => mockTime;

      await sendRemindersTrigger();

      assert.strictEqual(messagingSpies.sendCalls.length, 0);
    });

    it('should NOT trigger concert reminder if concert has already started/passed', async () => {
      const concertTime = Date.UTC(2026, 5, 12, 16, 0) - 9 * 3600 * 1000;
      
      // Mock Date.now to 5 mins after concert start (passed)
      const mockTime = concertTime + 5 * 60 * 1000;
      Date.now = () => mockTime;

      await sendRemindersTrigger();

      assert.strictEqual(messagingSpies.sendCalls.length, 0);
    });

    it('should process and send due personal reminders and clean them up', async () => {
      const nowTime = 1000000;
      Date.now = () => nowTime;

      firestoreStore.reminders = [
        { id: 'rem-1', fireAtMs: 800000, token: 'user-token-1', title: 'Due Alert', body: 'Wake up!' },
        { id: 'rem-2', fireAtMs: 1000000, token: 'user-token-2', title: 'Due Now', body: 'Meeting!' },
        { id: 'rem-3', fireAtMs: 1200000, token: 'user-token-3', title: 'Future Alert', body: 'Later!' }
      ];

      await sendRemindersTrigger();

      // Should send to token 1 and token 2
      assert.strictEqual(messagingSpies.sendCalls.length, 2);
      const tokensSent = messagingSpies.sendCalls.map(c => c.token);
      assert.ok(tokensSent.includes('user-token-1'));
      assert.ok(tokensSent.includes('user-token-2'));
      assert.ok(!tokensSent.includes('user-token-3'));

      // Should delete reminder 1 and 2 from db
      const deletedReminders = firestoreSpies.deletes
        .filter(d => d.collection === 'reminders')
        .map(d => d.docId);
      assert.strictEqual(deletedReminders.length, 2);
      assert.ok(deletedReminders.includes('rem-1'));
      assert.ok(deletedReminders.includes('rem-2'));
      assert.ok(!deletedReminders.includes('rem-3'));
    });

    it('should process due personal reminders in batches of 100 and delete in batches of 450', async () => {
      const nowTime = 1000000;
      Date.now = () => nowTime;

      // Create 500 due reminders
      const dueReminders = [];
      for (let i = 0; i < 500; i++) {
        dueReminders.push({
          id: `rem_${i}`,
          fireAtMs: 900000,
          token: `token-${i}`,
          title: `Reminder ${i}`,
          body: 'Text'
        });
      }
      firestoreStore.reminders = dueReminders;

      await sendRemindersTrigger();

      // All 500 notifications should be sent
      assert.strictEqual(messagingSpies.sendCalls.length, 500);

      // All 500 should be marked deleted
      const deletedReminders = firestoreSpies.deletes
        .filter(d => d.collection === 'reminders');
      assert.strictEqual(deletedReminders.length, 500);
      assert.strictEqual(firestoreStore.reminders.length, 0);
    });
  });
});
