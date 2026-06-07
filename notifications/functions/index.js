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
const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const crypto = require("crypto");
const {initializeApp} = require("firebase-admin/app");
const {getMessaging} = require("firebase-admin/messaging");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");

initializeApp();
setGlobalOptions({region: "us-central1"});

const CHANNELS = ["performers", "chaperones", "directors", "shadow", "flights"];
const LABELS = {performers: "Performers", chaperones: "Chaperones", directors: "Directors", shadow: "Shadow", flights: "Flights"};

/* ---- @-mention parsing ---- */
function parseMentions(text) {
  const t = String(text || "");
  const everyone = /(^|[^\w@])@everyone\b/i.test(t);
  const groups = ["swe", "sso", "choir"].filter((g) => new RegExp("(^|[^\\w@])@" + g + "\\b", "i").test(t));
  const flights = [];
  const re = /@flight\s*([a-i])\b/gi; let mm;
  while ((mm = re.exec(t))) { const f = mm[1].toUpperCase(); if (flights.indexOf(f) < 0) flights.push(f); }
  return {everyone, groups, flights};
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
      apns: {payload: {aps: {sound: "default"}}},
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
// whole-channel send: native topic + every web token registered for the channel (used by concert reminders)
async function sendToChannel(db, msg, channel, title, body) {
  await msg.send({
    topic: channel,
    notification: {title, body},
    apns: {payload: {aps: {sound: "default"}}},
    android: {priority: "high", notification: {channelId: "announcements"}},
  }).catch((e) => console.error("topic send:", e));
  const snap = await db.collection("webTokens").where("channels", "array-contains", channel).get();
  await multicast(db, msg, snap.docs.map((d) => ({id: d.id, token: (d.data() || {}).token})), title, body);
}

/* ---- 1) announcements ----
 * Notifications are driven by @-mentions in the message text:
 *   • @everyone           → everyone in the channel (native topic + all web tokens)
 *   • @swe / @sso / @choir → only those people in the channel
 *   • @Flight A … @Flight I → only people on that flight (Flights channel)
 *   • no @mention          → no push at all
 */
exports.notifyOnMessage = onDocumentCreated("channels/{channel}/messages/{id}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const channel = event.params.channel;
  if (!CHANNELS.includes(channel)) return;
  const m = snap.data() || {};
  const text = String(m.text || "");
  const men = parseMentions(text);
  if (!men.everyone && !men.groups.length && !men.flights.length) return;   // no @ → ping no one

  const db = getFirestore();
  const msg = getMessaging();
  const label = LABELS[channel] || "Japan Tour 2026";
  const author = (m.author && String(m.author).trim()) ? String(m.author).trim() : "";
  const title = author ? (author + " to " + label)
    : ((m.title && String(m.title).trim()) ? String(m.title) : label);
  const body = text.slice(0, 180);

  const tokSnap = await db.collection("webTokens").where("channels", "array-contains", channel).get();
  const all = tokSnap.docs.map((d) => ({id: d.id, ...(d.data() || {})}));

  if (men.everyone) {
    // whole channel: native topic + every web token registered for it
    await msg.send({
      topic: channel,
      notification: {title, body},
      apns: {payload: {aps: {sound: "default"}}},
      android: {priority: "high", notification: {channelId: "announcements"}},
    }).catch((e) => console.error("topic send:", e));
    await multicast(db, msg, all, title, body);
    return;
  }

  // targeted: only the mentioned groups/flights (web tokens — topics can't target subgroups)
  const targets = all.filter((w) => {
    const tags = Array.isArray(w.tags) ? w.tags : [];
    if (men.groups.some((g) => tags.includes(g))) return true;
    if (men.flights.length && men.flights.includes(w.flight)) return true;
    return false;
  });
  await multicast(db, msg, targets, title, body);
});

/* ---- one-time maintenance: merge old channel messages into the new channels ----
 * performers ← swesso + choir · shadow ← swesso-shadow + choir-shadow · chaperones ← swesso-chap + choir-chap.
 * (directors keeps its id, so its history carries over with no migration.) Copies each message with a
 * stable id (src_origId) so it's idempotent — safe to run more than once. Messages sort by their ts field.
 * RUN ONCE:  https://us-central1-japan-tour-2026.cloudfunctions.net/migrateChannels?confirm=yes
 * Then DELETE it:  firebase functions:delete migrateChannels
 */
const MERGE = {performers: ["swesso", "choir"], shadow: ["swesso-shadow", "choir-shadow"], chaperones: ["swesso-chap", "choir-chap"]};
exports.migrateChannels = onRequest(async (req, res) => {
  if (req.query.confirm !== "yes") { res.status(400).send("Add ?confirm=yes to merge old channel messages into the new channels."); return; }
  const db = getFirestore();
  const summary = {};
  let copied = 0;
  for (const dest of Object.keys(MERGE)) {
    let n = 0;
    for (const src of MERGE[dest]) {
      const msgs = await db.collection("channels").doc(src).collection("messages").get();
      for (let i = 0; i < msgs.docs.length; i += 450) {
        const batch = db.batch();
        msgs.docs.slice(i, i + 450).forEach((d) => {
          batch.set(db.collection("channels").doc(dest).collection("messages").doc(src + "_" + d.id), d.data());
        });
        await batch.commit();
        n += Math.min(450, msgs.docs.length - i);
      }
    }
    summary[dest] = n;
    copied += n;
  }
  console.log("migrateChannels:", summary);
  res.json({copied, summary});
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
          sendToToken(msg, r.token, r.title || "Reminder", r.body || "") :
          Promise.resolve();
      }));
    }
    for (let i = 0; i < docs.length; i += 450) {
      const batch = db.batch();
      docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
      await batch.commit().catch(() => {});
    }
  });

/* ---- one-time maintenance: collapse duplicate webTokens docs ----
 * Older clients keyed their webTokens doc by localStorage, so logout / cache-clear /
 * incognito created multiple docs for the SAME token. This rewrites each token to a
 * single canonical doc at sha256(token) (matching the client) with the newest channel
 * list, and deletes the leftovers. Idempotent — safe to run more than once.
 *
 * RUN ONCE:  open  https://us-central1-japan-tour-2026.cloudfunctions.net/cleanupWebTokens?confirm=yes
 * Then DELETE it:  firebase functions:delete cleanupWebTokens
 */
const tsMs = (ts) => { try { return ts && ts.toMillis ? ts.toMillis() : 0; } catch (e) { return 0; } };
exports.cleanupWebTokens = onRequest(async (req, res) => {
  if (req.query.confirm !== "yes") {
    res.status(400).send("Add ?confirm=yes to run. This collapses duplicate webTokens docs (one per token).");
    return;
  }
  const db = getFirestore();
  const snap = await db.collection("webTokens").get();
  const docsBefore = snap.size;

  // group all docs by their FCM token
  const byToken = new Map();
  snap.docs.forEach((d) => {
    const data = d.data() || {};
    if (!data.token) return;
    const arr = byToken.get(data.token) || [];
    arr.push({id: d.id, ref: d.ref, data});
    byToken.set(data.token, arr);
  });

  const ops = [];
  let uniqueTokens = 0;
  for (const [token, group] of byToken) {
    uniqueTokens++;
    const canonicalId = crypto.createHash("sha256").update(token).digest("hex");
    const newest = group.slice().sort((a, b) => tsMs(b.data.ts) - tsMs(a.data.ts))[0];
    const data = {
      ...newest.data,
      channels: Array.isArray(newest.data.channels) ? newest.data.channels : [],
      ts: FieldValue.serverTimestamp()
    };
    ops.push({type: "set", ref: db.collection("webTokens").doc(canonicalId), data});
    group.forEach((x) => { if (x.id !== canonicalId) ops.push({type: "delete", ref: x.ref}); });
  }

  let duplicatesDeleted = 0;
  for (let i = 0; i < ops.length; i += 450) {
    const batch = db.batch();
    ops.slice(i, i + 450).forEach((op) => (op.type === "set" ? batch.set(op.ref, op.data) : batch.delete(op.ref)));
    await batch.commit();
    duplicatesDeleted += ops.slice(i, i + 450).filter((op) => op.type === "delete").length;
  }

  const summary = {docsBefore, uniqueTokens, canonicalDocsAfter: uniqueTokens, duplicatesDeleted};
  console.log("cleanupWebTokens:", summary);
  res.json(summary);
});
