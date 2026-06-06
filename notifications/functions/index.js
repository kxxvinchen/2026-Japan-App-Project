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

const CHANNELS = ["swesso", "choir", "swesso-shadow", "choir-shadow", "swesso-chap", "choir-chap", "directors"];
const LABELS = {
  swesso: "SWE/SSO", choir: "Choir", "swesso-shadow": "SWE/SSO Shadow", "choir-shadow": "Choir Shadow",
  "swesso-chap": "SWE/SSO Chaperones", "choir-chap": "Choir Chaperones", "directors": "Directors",
};

/* ---- send helpers ---- */
async function sendToChannel(db, msg, channel, title, body) {
  await msg.send({
    topic: channel,
    notification: {title, body},
    apns: {payload: {aps: {sound: "default"}}},
    android: {priority: "high", notification: {channelId: "announcements"}},
  }).catch((e) => console.error("topic send:", e));

  const snap = await db.collection("webTokens").where("channels", "array-contains", channel).get();
  const docs = snap.docs.map((d) => ({id: d.id, token: (d.data() || {}).token})).filter((x) => x.token);
  for (let i = 0; i < docs.length; i += 500) {
    const chunk = docs.slice(i, i + 500);
    await msg.sendEachForMulticast({
      tokens: chunk.map((x) => x.token),
      notification: {title, body},
      webpush: {notification: {title, body, icon: "/icon-192.png"}},
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
async function sendToToken(msg, token, title, body) {
  try {
    await msg.send({
      token,
      notification: {title, body},
      webpush: {notification: {title, body, icon: "/icon-192.png"}},
      apns: {payload: {aps: {sound: "default"}}},
      android: {priority: "high", notification: {channelId: "announcements"}},
    });
  } catch (e) { /* stale token — ignore */ }
}

/* ---- 1) announcements ---- */
exports.notifyOnMessage = onDocumentCreated("channels/{channel}/messages/{id}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const channel = event.params.channel;
  if (!CHANNELS.includes(channel)) return;
  const m = snap.data() || {};
  const label = LABELS[channel] || "Japan Tour 2026";
  const author = (m.author && String(m.author).trim()) ? String(m.author).trim() : "";
  // multi-sender channels (chaperone + directors): show WHO sent it so the broadcast is useful
  const multiSender = (channel === "directors") || channel.endsWith("-chap");
  let title;
  if (multiSender) {
    title = author ? (author + " · " + label) : label;
  } else {
    title = (m.title && String(m.title).trim()) ? String(m.title) : label;
  }
  const body = String(m.text || "").slice(0, 180);
  await sendToChannel(getFirestore(), getMessaging(), channel, title, body);
});

/* ---- 2) reminders (every 5 min) ---- */
const JST = 9 * 3600 * 1000;          // JST = UTC+9
const at = (day, h, m) => Date.UTC(2026, 5 /* June */, day, h, m) - JST;
const CONCERTS = [
  {id: "c-jun12-choir", channels: ["choir"],    title: "Choir Friendship Concert — Toko Hall",        whenMs: at(12, 16, 0)},
  {id: "c-jun13-bo",    channels: ["swesso"],   title: "SWE/SSO Concert — Beethoven Hall",            whenMs: at(13, 14, 0)},
  {id: "c-jun13-choir", channels: ["choir"],    title: "Choir Concert — Ikebukuro Global Ring",       whenMs: at(13, 18, 0)},
  {id: "c-jun14-orch",  channels: ["swesso"],   title: "Orchestra — Mt. Fuji Music Festival",         whenMs: at(14, 13, 30)},
  {id: "c-jun14-band",  channels: ["swesso"],   title: "Band — Mt. Fuji Music Festival",              whenMs: at(14, 15, 40)},
  {id: "c-jun14-choir", channels: ["choir"],    title: "Choir — Kawaguchiko Music Forest Museum",     whenMs: at(14, 16, 10)},
  {id: "c-jun17-bo",    channels: ["swesso"],   title: "SWE/SSO Concert — Akashi Civic Hall",         whenMs: at(17, 18, 0)},
  {id: "c-jun18-choir", channels: ["choir"],    title: "Choir Concert — Kobe High School",            whenMs: at(18, 16, 30)},
  {id: "c-jun20-bo",    channels: ["swesso"],   title: "SWE/SSO — Hiroshima Phoenix Hall",            whenMs: at(20, 13, 30)},
  {id: "c-jun20-choir", channels: ["choir"],    title: "Choir Concert — Hiroshima Jogakuin",          whenMs: at(20, 15, 0)},
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
    // Claim-then-send: capture each chunk's data, DELETE it first, then send.
    // Because a reminder is removed before it's broadcast, a network hang, rate
    // limit, or the 300s timeout during sending can never leave it in the queue
    // to be re-fetched and re-sent on the next run — so no duplicate notifications.
    const due = await db.collection("reminders").where("fireAtMs", "<=", now).get();
    const docs = due.docs;
    for (let i = 0; i < docs.length; i += 100) {
      const payloads = docs.slice(i, i + 100).map((d) => ({ref: d.ref, ...(d.data() || {})}));
      // 1) claim — remove this chunk before sending
      const batch = db.batch();
      payloads.forEach((p) => batch.delete(p.ref));
      let claimed = true;
      await batch.commit().catch((e) => {
        claimed = false;
        console.error("reminder cleanup failed; skipping send to avoid duplicates:", e);
      });
      if (!claimed) continue;   // couldn't remove them — don't send, so they're never sent twice
      // 2) send (already removed, so a partial/timed-out run can't duplicate them)
      await Promise.all(payloads.map((p) =>
        p.token ? sendToToken(msg, p.token, p.title || "Reminder", p.body || "") : Promise.resolve()));
    }
  });
