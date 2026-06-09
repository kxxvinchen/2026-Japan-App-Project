/**
 * Two functions:
 *  1) notifyOnMessage  — when a director posts to channels/{channel}/messages,
 *     push it to that channel (native topic + web tokens).
 *  2) sendReminders    — runs every 5 minutes and sends:
 *       • concert reminders 1 hour before each ensemble's concert
 *       • personal activity reminders that have come due
 *
 * Deploy:  firebase deploy --only functions   (run from the project root)
 * Requires the Blaze plan. The schedule uses Cloud Scheduler (enabled on first
 * deploy). Usage stays in the free tier.
 */
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {setGlobalOptions} = require("firebase-functions/v2");
const {initializeApp} = require("firebase-admin/app");
const {getMessaging} = require("firebase-admin/messaging");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

initializeApp();
setGlobalOptions({region: "us-central1"});

const CHANNELS = ["performers", "percussion", "chaperones", "directors", "shadow", "flights", "test"];
const LABELS = {performers: "Performers", percussion: "Percussion", chaperones: "Chaperones", directors: "Directors", shadow: "Shadow", flights: "Flights", test: "Test"};

/* ---- @-mention parsing ---- */
function parseMentions(text) {
  const t = String(text || "");
  const groups = ["swe", "sso", "choir", "perc"].filter((g) => new RegExp("(^|[^\\w@])@" + g + "\\b", "i").test(t));
  const flights = [];
  const re = /@flight\s*([a-i])\b/gi; let mm;
  while ((mm = re.exec(t))) { const f = mm[1].toUpperCase(); if (flights.indexOf(f) < 0) flights.push(f); }
  const buses = [];
  // Shadow Tour coaches: @ShadowBus1 → token bus "s1". Parse these BEFORE @Bus so the
  // "Bus" inside "ShadowBus" can't be mistaken for a performer bus.
  const sBusRe = /@ShadowBus([1-9])\b/gi; let sbm;
  while ((sbm = sBusRe.exec(t))) { const b = "s" + sbm[1]; if (buses.indexOf(b) < 0) buses.push(b); }
  const busRe = /@Bus([1-9])\b/gi; let bm;
  while ((bm = busRe.exec(t))) { const b = bm[1]; if (buses.indexOf(b) < 0) buses.push(b); }
  return {groups, flights, buses};
}

/* ---- send helpers ---- */
// multicast to a list of {id, token} docs, deleting tokens that have gone stale
async function multicast(db, msg, docs, title, body) {
  const seen = {};
  const valid = docs.filter((x) => x.token && !seen[x.token] && (seen[x.token] = 1));
  for (let i = 0; i < valid.length; i += 500) {
    const chunk = valid.slice(i, i + 500);
    await msg.sendEachForMulticast({
      tokens: chunk.map((x) => x.token),
      notification: {title, body},
      webpush: {notification: {title, body, icon: "/icon-192.png"}},
      apns: {payload: {aps: {sound: "default", badge: 1}}},
      android: {priority: "high", notification: {channelId: "announcements"}},
    }).then((resp) => {
      resp.responses.forEach((r, idx) => {
        if (!r.success) {
          const code = r.error && r.error.code;
          if (code === "messaging/registration-token-not-registered" ||
              code === "messaging/invalid-registration-token") {
            db.collection("webTokens").doc(chunk[idx].id).delete().catch(() => {});
          }
        }
      });
    }).catch((e) => console.error("web send:", e));
  }
}
async function sendToToken(db, msg, token, title, body) {
  try {
    await msg.send({
      token,
      notification: {title, body},
      webpush: {notification: {title, body, icon: "/icon-192.png"}},
      apns: {payload: {aps: {sound: "default", badge: 1}}},
      android: {priority: "high", notification: {channelId: "announcements"}},
    });
  } catch (e) { /* stale token — ignore */ }
}
// whole-channel send: native topic + every web token registered for the channel (used by concert reminders)
async function sendToChannel(db, msg, channel, title, body) {
  await msg.send({
    topic: channel,
    notification: {title, body},
    apns: {payload: {aps: {sound: "default", badge: 1}}},
    android: {priority: "high", notification: {channelId: "announcements"}},
  }).catch((e) => console.error("topic send:", e));
  const snap = await db.collection("webTokens").where("channels", "array-contains", channel).get();
  await multicast(db, msg, snap.docs.map((d) => ({id: d.id, token: (d.data() || {}).token})), title, body);
}

/* ---- 1) announcements ----
 * Notifications are driven by @-mentions in the message text:
 *   • no @mention (default)      → everyone in the channel (native topic + all web tokens)
 *   • @swe / @sso / @choir / @perc → only those people in the channel
 *   • @Flight A … @Flight I       → only people on that flight (Flights channel)
 */
exports.notifyOnMessage = onDocumentCreated("channels/{channel}/messages/{id}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const channel = event.params.channel;
  if (!CHANNELS.includes(channel)) return;
  const m = snap.data() || {};
  const text = String(m.text || "");
  const men = parseMentions(text);
  // No specific group/flight/bus mention => notify the whole channel by default.
  const everyone = !men.groups.length && !men.flights.length && !men.buses.length;

  const db = getFirestore();
  const msg = getMessaging();
  const label = LABELS[channel] || "Japan Tour 2026";
  const author = (m.author && String(m.author).trim()) ? String(m.author).trim() : "";
  const title = author ? (author + " to " + label)
    : ((m.title && String(m.title).trim()) ? String(m.title) : label);
  const body = text.slice(0, 180);

  const tokSnap = await db.collection("webTokens").where("channels", "array-contains", channel).get();
  const all = tokSnap.docs.map((d) => ({id: d.id, ...(d.data() || {})}));

  if (everyone) {
    // whole channel: native topic + every web token registered for it
    await msg.send({
      topic: channel,
      notification: {title, body},
      apns: {payload: {aps: {sound: "default", badge: 1}}},
      android: {priority: "high", notification: {channelId: "announcements"}},
    }).catch((e) => console.error("topic send:", e));
    await multicast(db, msg, all, title, body);
    return;
  }

  // targeted: only the mentioned groups/flights/buses (web tokens — topics can't target subgroups)
  const targets = all.filter((w) => {
    const tags = Array.isArray(w.tags) ? w.tags : [];
    if (men.groups.some((g) => tags.includes(g))) return true;
    if (men.flights.length && men.flights.includes(w.flight)) return true;
    if (men.buses.length && men.buses.includes(w.bus)) return true;
    return false;
  });
  await multicast(db, msg, targets, title, body);
});


/* ---- 2) reminders (every 5 min) ---- */
const JST = 9 * 3600 * 1000;          // JST = UTC+9
const at = (day, h, m) => Date.UTC(2026, 5 /* June */, day, h, m) - JST;
const CONCERTS = [
  {id: "c-jun12-choir", channels: ["performers"], title: "Choir Friendship Concert — Toko Hall",    whenMs: at(12, 16, 0)},
  {id: "c-jun13-bo",    channels: ["performers"], title: "SWE/SSO Concert — Beethoven Hall",         whenMs: at(13, 14, 0)},
  {id: "c-jun13-choir", channels: ["performers"], title: "Choir Concert — Ikebukuro Global Ring",    whenMs: at(13, 18, 0)},
  {id: "c-jun14-orch",  channels: ["performers"], title: "Orchestra — Mt. Fuji Music Festival",      whenMs: at(14, 13, 30)},
  {id: "c-jun14-band",  channels: ["performers"], title: "Band — Mt. Fuji Music Festival",           whenMs: at(14, 15, 40)},
  {id: "c-jun14-choir", channels: ["performers"], title: "Choir — Kawaguchiko Music Forest Museum",  whenMs: at(14, 16, 10)},
  {id: "c-jun17-bo",    channels: ["performers"], title: "SWE/SSO Concert — Akashi Civic Hall",      whenMs: at(17, 18, 0)},
  {id: "c-jun18-choir", channels: ["performers"], title: "Choir Concert — Kobe High School",         whenMs: at(18, 16, 30)},
  {id: "c-jun20-bo",    channels: ["performers"], title: "SWE/SSO — Hiroshima Phoenix Hall",         whenMs: at(20, 13, 30)},
  {id: "c-jun20-choir", channels: ["performers"], title: "Choir Concert — Hiroshima Jogakuin",       whenMs: at(20, 15, 0)},
];

exports.sendReminders = onSchedule(
  {schedule: "every 5 minutes", timeoutSeconds: 300, memory: "256MiB"},
  async () => {
    const db = getFirestore();
    const msg = getMessaging();
    const now = Date.now();

    // Concert reminders — 1 hour before, once each
    for (const c of CONCERTS) {
      const notifyAt = c.whenMs - 60 * 60000;
      if (now >= notifyAt && now < c.whenMs) {
        const ref = db.collection("sentReminders").doc(c.id);
        const existing = await ref.get();
        if (!existing.exists) {
          await ref.set({sentAt: FieldValue.serverTimestamp()});
          await Promise.all(c.channels.map((ch) =>
            sendToChannel(db, msg, ch, "🎵 " + c.title, "Starts in about 1 hour")));
        }
      }
    }

    // Personal reminders (activity + flight/departure) that are now due.
    // Send in parallel batches and delete in batched writes so a few hundred
    // due at the same minute go out in seconds, not one-by-one.
    const due = await db.collection("reminders").where("fireAtMs", "<=", now).get();
    const docs = due.docs;
    for (let i = 0; i < docs.length; i += 100) {
      await Promise.all(docs.slice(i, i + 100).map((d) => {
        const r = d.data() || {};
        return r.token ?
          sendToToken(db, msg, r.token, r.title || "Reminder", r.body || "") :
          Promise.resolve();
      }));
    }
    for (let i = 0; i < docs.length; i += 450) {
      const batch = db.batch();
      docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
      await batch.commit().catch(() => {});
    }
  });

