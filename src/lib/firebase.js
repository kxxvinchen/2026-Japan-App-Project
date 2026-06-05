/* Firebase / messaging layer for the React app.
   Mirrors the original imperative logic, but instead of calling render() it calls notify(),
   which React subscribes to via useSyncExternalStore. Messaging UI state (active channel,
   unread baselines, compose draft, edit target, menus) lives here, tightly coupled to FB. */
import { CHANNELS, CH_LABEL } from "./channels.js";
import { FLIGHTS } from "../data.js";
import { daySet } from "./groups.js";
import { fmt12 } from "./activity.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA2uy_QSc0eV9dmED4blU5SwdiYLAcE75U",
  authDomain: "japan-tour-2026.firebaseapp.com",
  projectId: "japan-tour-2026",
  appId: "1:629182869469:web:5a4931bb45e32d3fc31034",
  messagingSenderId: "629182869469",
  storageBucket: "japan-tour-2026.firebasestorage.app",
  measurementId: "G-FCKQCZTZM0",
};
const WEB_PUSH_VAPID_KEY = "BJwDtvtBN8zSE2UwBEtd-WTMsC4MHeSf5m_KGvpPRYlwO2wxSoWMYRggfq2VONAdv61sOqamVwZh8kN-GVMXJ0E";
const NOTIF_TOPICS = CHANNELS.map((c) => c.id);
const LOGIN_DOMAIN = "@japantour.local";

const loadMsgCache = () => { try { return JSON.parse(localStorage.getItem("jt_msgs")) || {}; } catch (e) { return {}; } };
const loadRead = () => { try { return JSON.parse(localStorage.getItem("jt_read")) || {}; } catch (e) { return {}; } };

export const FB = {
  configured: !!FIREBASE_CONFIG.projectId, ready: false, error: "", user: null,
  isDirector: false, isAdmin: false, chapChannels: [], authorName: "",
  db: null, auth: null, messaging: null, swReg: null, webToken: "", listeners: {},
  msgsByChannel: loadMsgCache(),
  pending: [],
  // UI state
  activeChannel: "", lastRead: loadRead(), draft: "", editing: null,
  msgMenu: "", msgDel: "", nameEdit: false, chanMenu: false, expanded: {},
  showSignIn: false, signinBusy: false, pendingSignIn: false, notifPerm: "",
  toastMsg: "", toastNav: "", toastChannel: "", currentScreen: "",
};

let userGroups = [];
let userFlight = "";
export function setGroups(groups) { userGroups = groups || []; subscribeChannels(); syncNotifTopics(); scheduleDepartureReminders(); notify(); }
export function setFlight(f) { userFlight = f || ""; scheduleDepartureReminders(); }

/* ---- subscription for React (useSyncExternalStore) ---- */
let ver = 0;
const subs = new Set();
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
export function getSnapshot() { return ver; }
function notify() { ver++; subs.forEach((f) => f()); }

let _toastT = null;
export function toast(msg, toPage, toChannel) {
  FB.toastMsg = msg;
  FB.toastNav = toPage || "";
  FB.toastChannel = toChannel || "";
  notify();
  clearTimeout(_toastT);
  _toastT = setTimeout(() => {
    FB.toastMsg = "";
    FB.toastNav = "";
    FB.toastChannel = "";
    notify();
  }, 4000);
}

export function clearToast() {
  clearTimeout(_toastT);
  FB.toastMsg = "";
  FB.toastNav = "";
  FB.toastChannel = "";
  notify();
}

/* ---- channels ---- */
export { CHANNELS, CH_LABEL };
function ensembleChannels() {
  const set = {};
  userGroups.forEach((g) => {
    if (g === "band" || g === "orch") set.swesso = 1;
    else if (g === "choir") set.choir = 1;
    else if (g === "sband") set["swesso-shadow"] = 1;
    else if (g === "schoir") set["choir-shadow"] = 1;
  });
  return Object.keys(set);
}
export function accessibleChannels() {
  if (FB.isDirector) return CHANNELS.map((c) => c.id);
  if (FB.isAdmin) return CHANNELS.map((c) => c.id).filter((id) => id !== "directors");
  const set = {};
  ensembleChannels().forEach((c) => { set[c] = 1; });
  (FB.chapChannels || []).forEach((ch) => {
    set[ch] = 1;
    const base = ch.replace("-chap", "");
    if (["swesso", "choir", "swesso-shadow", "choir-shadow"].indexOf(base) > -1) set[base] = 1;
  });
  return Object.keys(set);
}
const channelsForUser = () => accessibleChannels();

function normalizeChapChannels(arr) {
  const map = { "band-chap": "swesso-chap", "orch-chap": "swesso-chap", "choir-chap": "choir-chap", "swesso-chap": "swesso-chap", "swe/sso-chap": "swesso-chap" };
  const valid = CHANNELS.filter((c) => c.chap).map((c) => c.id);
  let raw = Array.isArray(arr) ? arr : (typeof arr === "string" && arr ? [arr] : []);
  let ch = raw.map((x) => map[String(x).trim().toLowerCase()] || String(x).trim()).filter((x) => valid.indexOf(x) > -1);
  return ch.filter((x, i) => ch.indexOf(x) === i);
}

/* ---- time helpers ---- */
function msgTime(ms) { try { return new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }
export function relTime(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return m + " min" + (m === 1 ? "" : "s") + " ago";
  const h = Math.floor(m / 60); if (h < 24) return h + " hour" + (h === 1 ? "" : "s") + " ago";
  const d = Math.floor(h / 24); if (d < 7) return d + " day" + (d === 1 ? "" : "s") + " ago";
  return msgTime(ms);
}

/* ---- unread ---- */
function saveMsgCache() { try { const out = {}; Object.keys(FB.msgsByChannel).forEach((ch) => { out[ch] = (FB.msgsByChannel[ch] || []).slice(0, 2000); }); localStorage.setItem("jt_msgs", JSON.stringify(out)); } catch (e) { } }
function saveRead() { try { localStorage.setItem("jt_read", JSON.stringify(FB.lastRead)); } catch (e) { } }
function latestTs(ch) { const l = FB.msgsByChannel[ch] || []; return l.length ? l[0].ts : 0; }
export function unreadCount(ch) {
  const lr = FB.lastRead[ch]; if (lr == null) return 0;
  let n = 0; for (const m of (FB.msgsByChannel[ch] || [])) if (m.ts > lr) n++; return n;
}
export function totalUnread() { let n = 0; accessibleChannels().forEach((ch) => { n += unreadCount(ch); }); return n; }
export function markChannelRead(ch) { if (!ch) return; const t = latestTs(ch); FB.lastRead[ch] = t > 0 ? t : Date.now(); saveRead(); }

export function channelMessages(ch) {
  let base = (FB.msgsByChannel[ch] || []).slice();
  const pend = (FB.pending || []).filter((p) => p.ch === ch && !base.some((m) => m.text === p.text && (m.author || "") === (p.author || "")));
  if (pend.length) {
    base = pend.map((p) => ({ id: "local_" + p.ts, channel: ch, title: "", text: p.text, author: p.author, role: p.role, ts: p.ts, _local: true })).concat(base);
    base.sort((a, b) => b.ts - a.ts);
  }
  return base;
}

/* ---- realtime listeners ---- */
function subscribeChannels() {
  if (!FB.db) return;
  const want = accessibleChannels();
  Object.keys(FB.listeners).forEach((ch) => { if (want.indexOf(ch) < 0) { try { FB.listeners[ch](); } catch (e) { } delete FB.listeners[ch]; } });
  want.forEach((ch) => {
    if (FB.listeners[ch]) return;
    let isInitial = true;
    FB.listeners[ch] = FB.db.collection("channels").doc(ch).collection("messages").orderBy("ts", "desc").limit(2000)
      .onSnapshot((snap) => {
        const arr = snap.docs.map((d) => { const x = d.data(); return { id: d.id, channel: ch, title: x.title || "", text: x.text || "", author: x.author || "Director", role: x.role || "", ts: (x.ts && x.ts.toMillis) ? x.ts.toMillis() : Date.now() }; });
        arr.sort((a, b) => b.ts - a.ts);
        if (!isInitial) {
          const myName = (FB.isDirector || FB.isAdmin)
            ? (FB.authorName || (FB.user && (FB.user.displayName || FB.user.email)) || (FB.isAdmin ? "Admin" : "Director"))
            : (localName() || FB.authorName || "Chaperone");
          snap.docChanges().forEach((change) => {
            if (change.type === "added") {
              const msg = change.doc.data() || {};
              const author = msg.author || "Director";
              const viewingThisChannel = FB.currentScreen === "messages" && ch === FB.activeChannel;
              if (author !== myName && !viewingThisChannel) {
                toast(`New Announcement in ${CH_LABEL[ch] || ch} by ${author}`, "messages", ch);
              }
            }
          });
        }
        isInitial = false;
        FB.msgsByChannel[ch] = arr;
        if (FB.pending && FB.pending.length) FB.pending = FB.pending.filter((p) => !(p.ch === ch && arr.some((m) => m.text === p.text && (m.author || "") === (p.author || ""))));
        if (FB.lastRead[ch] == null) { FB.lastRead[ch] = arr.length ? arr[0].ts : 0; saveRead(); }
        else if (ch === FB.activeChannel) markChannelRead(ch);
        saveMsgCache(); FB.ready = true; notify();
      }, () => { });
  });
}

/* ---- auth ---- */
function fbScript(src) { return new Promise((res, rej) => { const el = document.createElement("script"); el.src = src; el.onload = res; el.onerror = rej; document.head.appendChild(el); }); }
let started = false;
export async function startMessaging() {
  if (!FB.configured || started) return; started = true;
  try {
    if (typeof firebase === "undefined") {
      const v = "10.12.2", b = "https://www.gstatic.com/firebasejs/" + v + "/";
      await fbScript(b + "firebase-app-compat.js");
      await fbScript(b + "firebase-firestore-compat.js");
      await fbScript(b + "firebase-auth-compat.js");
      await fbScript(b + "firebase-messaging-compat.js");
    }
    firebase.initializeApp(FIREBASE_CONFIG);
    FB.db = firebase.firestore();
    try { FB.db.settings({ experimentalForceLongPolling: true, ignoreUndefinedProperties: true }); } catch (e) { }
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      FB.db.useEmulator("127.0.0.1", 8080);
      console.log("Connected to Firestore Emulator");
    }
    try { await FB.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { }
    FB.auth = firebase.auth();
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      FB.auth.useEmulator("http://127.0.0.1:9099");
      console.log("Connected to Auth Emulator");
    }
    FB.auth.onAuthStateChanged(async (u) => {
      FB.user = u || null; FB.isDirector = false; FB.isAdmin = false; FB.chapChannels = []; FB.authorName = "";
      let dirOk = false, chapOk = false, adminOk = false;
      if (u && u.email) {
        try { const d = await FB.db.collection("directors").doc(u.email).get(); if (d.exists) { dirOk = true; FB.isDirector = true; const dd = d.data() || {}; if (dd.name) FB.authorName = dd.name; } } catch (e) { }
        try { const a = await FB.db.collection("admins").doc(u.email).get(); if (a.exists) { adminOk = true; FB.isAdmin = true; const ad = a.data() || {}; if (!FB.authorName && ad.name) FB.authorName = ad.name; } } catch (e) { }
        try { const c = await FB.db.collection("chaperones").doc(u.email).get(); if (c.exists) { chapOk = true; const cd = c.data() || {}; FB.chapChannels = normalizeChapChannels(cd.channels); if (!FB.authorName && cd.name) FB.authorName = cd.name; } } catch (e) { }
      }
      if (FB.pendingSignIn) {
        FB.pendingSignIn = false;
        if (u && !dirOk && !chapOk && !adminOk) { FB.error = "That account isn't authorized. Check the username/password."; try { await FB.auth.signOut(); } catch (e) { } return; }
        if (u) {
          FB.error = ""; FB.showSignIn = false;
          const acc = accessibleChannels();
          FB.activeChannel = (FB.chapChannels && FB.chapChannels.length) ? FB.chapChannels[0] : (acc[0] || "");
          markChannelRead(FB.activeChannel);
          if (window.__jtNav) window.__jtNav("messages");
        }
      }
      subscribeChannels(); syncNotifTopics(); notify();
    });
    FB.ready = true; FB.error = ""; subscribeChannels(); ensureWebToken(); notify();
  } catch (e) { FB.error = "Couldn't connect to the message service."; notify(); }
}

export async function signIn(emailRaw, pwd) {
  let email = (emailRaw || "").trim();
  if (!email || !pwd) { FB.error = "Enter your username and password."; notify(); return; }
  if (email.indexOf("@") < 0) email = email.toLowerCase() + LOGIN_DOMAIN;
  FB.error = "";
  if (!FB.auth) await new Promise((res) => { const t0 = Date.now(); (function chk() { if (FB.auth || Date.now() - t0 > 8000) return res(); setTimeout(chk, 150); })(); });
  if (!FB.auth) { FB.error = "Still connecting — wait a moment and try again."; notify(); return; }
  FB.pendingSignIn = true; FB.signinBusy = true; notify();
  try { await FB.auth.signInWithEmailAndPassword(email, pwd); FB.signinBusy = false; }
  catch (e) { FB.pendingSignIn = false; FB.signinBusy = false; FB.error = "Sign-in failed. Check your username and password."; notify(); }
}
export function signOut() { try { if (FB.auth) FB.auth.signOut(); } catch (e) { } FB.isDirector = false; FB.isAdmin = false; FB.chapChannels = []; FB.user = null; subscribeChannels(); notify(); }

/* ---- compose / messages ---- */
export const localName = () => { try { return (localStorage.getItem("jt_chapname") || "").trim(); } catch (e) { return ""; } };
export function saveName(v) { v = (v || "").trim(); if (!v) { toast("Enter a name"); return false; } try { localStorage.setItem("jt_chapname", v); } catch (e) { } FB.authorName = v; FB.nameEdit = false; toast("Saved — your messages will show as " + v); notify(); return true; }
export function setShowSignIn(v) { FB.showSignIn = v; if (!v) FB.error = ""; notify(); }
export function setNameEdit(v) { FB.nameEdit = v; notify(); }
export function canPostHere() {
  const ch = FB.activeChannel || "";
  if (FB.isDirector) return !!ch;
  if (FB.isAdmin) return !!ch && ch !== "directors";
  return ch.slice(-5) === "-chap" && (FB.chapChannels || []).indexOf(ch) > -1;
}
export function setActiveChannel(ch) { FB.activeChannel = ch; FB.msgMenu = ""; FB.msgDel = ""; FB.editing = null; FB.chanMenu = false; markChannelRead(ch); notify(); }
export function setMsgMenu(id) { FB.msgMenu = (FB.msgMenu === id ? "" : id); FB.msgDel = ""; notify(); }
export function askDelete(id) { FB.msgDel = id; notify(); }
export function closeMenu() { FB.msgMenu = ""; FB.msgDel = ""; notify(); }
export function toggleChanMenu() { FB.chanMenu = !FB.chanMenu; notify(); }
export function toggleExpanded(id) { FB.expanded[id] = !FB.expanded[id]; notify(); }
export function startEdit(ch, id) { const m = (FB.msgsByChannel[ch] || []).filter((x) => x.id === id)[0]; if (!m) return; FB.editing = { channel: ch, id, text: m.text || "" }; FB.msgMenu = ""; FB.msgDel = ""; notify(); }
export function cancelEdit() { FB.editing = null; notify(); }

export async function sendMessage(text) {
  const chan = FB.activeChannel;
  text = (text || "").trim();
  if (!chan) { toast("Pick a channel first"); return; }
  if (!text) { toast("Type a message first"); return; }
  if (!FB.isDirector && !FB.isAdmin && !localName()) { toast("Add your name in the Group tab first"); return; }
  if (FB.editing && FB.editing.id) {
    const ed = FB.editing; FB.editing = null;
    (FB.msgsByChannel[ed.channel] || []).forEach((m) => { if (m.id === ed.id) { m.text = text; m.edited = true; } });
    notify();
    try { await FB.db.collection("channels").doc(ed.channel).collection("messages").doc(ed.id).update({ text, edited: true }); toast("Message updated"); }
    catch (e) { toast((e && e.code) === "permission-denied" ? "Edit blocked — publish the updated Firestore rules" : "Couldn't update the message."); }
    return;
  }
  const author = (FB.isDirector || FB.isAdmin)
    ? (FB.authorName || (FB.user && (FB.user.displayName || FB.user.email)) || (FB.isAdmin ? "Admin" : "Director"))
    : (localName() || FB.authorName || "Chaperone");
  const role = FB.isDirector ? "director" : "";
  const pend = { ch: chan, text, author, role, ts: Date.now() };
  FB.pending.push(pend); markChannelRead(chan); notify();
  try {
    await FB.db.collection("channels").doc(chan).collection("messages").add({ text, author, role, ts: firebase.firestore.FieldValue.serverTimestamp() });
    toast("Sent to " + (CH_LABEL[chan] || chan));
  } catch (e) {
    FB.pending = FB.pending.filter((p) => p !== pend); notify();
    toast("Couldn't send — account may not be authorized.");
  }
}
export function deleteMessage(ch, id) {
  FB.msgMenu = ""; FB.msgDel = "";
  if (FB.editing && FB.editing.id === id) FB.editing = null;
  FB.msgsByChannel[ch] = (FB.msgsByChannel[ch] || []).filter((m) => m.id !== id); notify();
  if (FB.db) FB.db.collection("channels").doc(ch).collection("messages").doc(id).delete()
    .then(() => toast("Message deleted"))
    .catch((e) => toast((e && e.code) === "permission-denied" ? "Delete blocked — publish the updated Firestore rules" : "Couldn't delete the message."));
}

/* ---- web push ---- */
export async function ensureWebToken() {
  try {
    if (FB.webToken) return FB.webToken;
    if (!("Notification" in window) || Notification.permission !== "granted") return "";
    if (typeof firebase === "undefined" || !firebase.messaging) return "";
    if (!FB.messaging) FB.messaging = firebase.messaging();
    const reg = FB.swReg || (navigator.serviceWorker ? await navigator.serviceWorker.ready : null);
    const token = await FB.messaging.getToken({ vapidKey: WEB_PUSH_VAPID_KEY, serviceWorkerRegistration: reg || undefined });
    if (token) { FB.webToken = token; await saveWebToken(token); }
    return FB.webToken;
  } catch (e) { return ""; }
}
async function saveWebToken(token) {
  const channels = channelsForUser();
  try {
    const id = localStorage.getItem("jt_webdoc");
    if (id) await FB.db.collection("webTokens").doc(id).set({ token, channels, ts: firebase.firestore.FieldValue.serverTimestamp() });
    else { const ref = await FB.db.collection("webTokens").add({ token, channels, ts: firebase.firestore.FieldValue.serverTimestamp() }); localStorage.setItem("jt_webdoc", ref.id); }
  } catch (e) { }
}
async function syncWebChannels() {
  const token = await ensureWebToken(); if (!token) return;
  const id = localStorage.getItem("jt_webdoc"); if (!id) return;
  try { await FB.db.collection("webTokens").doc(id).set({ token, channels: channelsForUser(), ts: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }); } catch (e) { }
}
function notifBridge() {
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.jtNotify) return { post: (m) => { try { window.webkit.messageHandlers.jtNotify.postMessage(m); } catch (e) { } } };
  if (window.JTNotify && window.JTNotify.handle) return { post: (m) => { try { window.JTNotify.handle(JSON.stringify(m)); } catch (e) { } } };
  return null;
}
function syncNotifTopics() { const br = notifBridge(); if (br) { br.post({ action: "setTopics", subscribe: channelsForUser(), all: NOTIF_TOPICS }); return; } syncWebChannels(); }
function webPushSupported() { return !!(FB.configured && WEB_PUSH_VAPID_KEY && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window); }
export async function enableNotifs() {
  const br = notifBridge();
  if (br) { br.post({ action: "requestPermission" }); syncNotifTopics(); toast("Check the permission prompt"); return; }
  if (!webPushSupported()) { toast("Add this app to your Home Screen first, then enable notifications"); return; }
  if (typeof firebase === "undefined" || !firebase.messaging) { toast("Still connecting — try again in a moment"); return; }
  let perm; try { perm = await Notification.requestPermission(); } catch (e) { toast("Couldn't request permission"); return; }
  if (perm !== "granted") { FB.notifPerm = "denied"; notify(); toast("Notifications not allowed"); return; }
  FB.notifPerm = "granted"; notify(); toast("Notifications enabled");
  try {
    if (!FB.messaging) FB.messaging = firebase.messaging();
    const reg = FB.swReg || (navigator.serviceWorker ? await navigator.serviceWorker.ready : null);
    const token = await FB.messaging.getToken({ vapidKey: WEB_PUSH_VAPID_KEY, serviceWorkerRegistration: reg || undefined });
    if (token) { FB.webToken = token; await saveWebToken(token); scheduleDepartureReminders(); }
  } catch (e) { }
}
export function notifGranted() { return (typeof Notification !== "undefined" && Notification.permission === "granted") || FB.notifPerm === "granted"; }

/* native iOS/Android shells call window.jtNotifStatus("granted"|"denied") */
if (typeof window !== "undefined") window.jtNotifStatus = (stat) => { FB.notifPerm = stat; notify(); };

/* ---- reminders (delivered by the sendReminders Cloud Function) ---- */
const MONIDX = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
function jstToUtcMs(dm, dd, hhmm) {
  const mi = MONIDX[dm] || 0, day = +dd, p = String(hhmm || "0:0").split(":");
  return Date.UTC(2026, mi, day, (+p[0] || 0), (+p[1] || 0)) - 9 * 3600 * 1000; // JST = UTC+9
}
function jtDeviceId() {
  let id = localStorage.getItem("jt_devid");
  if (!id) { id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem("jt_devid", id); }
  return id;
}
/* personal reminder for a custom activity (5/10/15/30/60 min before) */
export async function saveReminder(d, time, remind, title) {
  if (!remind || !FB.db) return;
  const fireAtMs = jstToUtcMs(d.dm, d.dd, time) - remind * 60000;
  if (fireAtMs <= Date.now()) { toast("Activity added (reminder time already passed)"); return; }
  const token = await ensureWebToken();
  if (!token) { toast("Turn on notifications (Group tab) to get reminders"); return; }
  try {
    await FB.db.collection("reminders").add({ token, title: "Reminder: " + title, body: title + " at " + fmt12(time), fireAtMs, ts: firebase.firestore.FieldValue.serverTimestamp() });
  } catch (e) { }
}
/* 1-hour + 15-min reminders before flight departures and daily hotel departures */
export async function scheduleDepartureReminders() {
  if (!FB.db) return;
  const token = await ensureWebToken();
  if (!token) return;
  const dev = jtDeviceId();
  const OFF = [{ m: 60, t: "in 1 hour" }, { m: 15, t: "in 15 minutes" }];
  const want = {};
  if (userFlight) {
    const fl = FLIGHTS.find((f) => f.id === userFlight);
    if (fl) {
      const P = (s) => { const m = String(s).match(/(\d{1,2}):(\d{2}).*?(\d{1,2})/); return m ? { h: +m[1], mi: +m[2], day: +m[3] } : null; };
      const o1 = P(fl.out.legs[0].dep), r1 = P(fl.ret.legs[0].dep);
      if (o1) { const ms = Date.UTC(2026, 5, o1.day, o1.h, o1.mi) + 7 * 3600000; OFF.forEach((o) => { want[dev + "_fltout_" + o.m] = { fireAtMs: ms - o.m * 60000, title: "✈️ Flight " + userFlight + " departs " + o.t, body: fl.out.legs[0].no + " · " + fl.out.legs[0].from }; }); }
      if (r1) { const ms = Date.UTC(2026, 5, r1.day, r1.h, r1.mi) - 9 * 3600000; OFF.forEach((o) => { want[dev + "_fltret_" + o.m] = { fireAtMs: ms - o.m * 60000, title: "✈️ Return flight departs " + o.t, body: fl.ret.legs[0].no + " · " + fl.ret.legs[0].from }; }); }
    }
  }
  const AIR = /haneda|narita|airport|san francisco|\bSFO\b|\bLAX\b|\bSEA\b|departure for|truck loading/i;
  const depT = (lines) => {
    if (lines.some((l) => AIR.test(l))) return null;
    for (const ln of lines) {
      if (/venue|school|return/i.test(ln)) continue;
      const m = ln.match(/(\d{1,2}):(\d{2})\s*[—\-]\s*Depart hotel/i) || ln.match(/(\d{1,2}):(\d{2})\s*[—\-]\s*Departure\b/i) || ln.match(/(\d{1,2}):(\d{2})\s*depart\b/i);
      if (m) return (m[1].length < 2 ? "0" : "") + m[1] + ":" + m[2];
    }
    return null;
  };
  daySet(userGroups).forEach((d, di) => {
    (d.logistics || []).forEach((b, bi) => {
      if (!b.groups || !b.groups.some((g) => userGroups.indexOf(g) > -1)) return;
      const t = depT(b.lines || []); if (!t) return;
      const ms = jstToUtcMs(d.dm, d.dd, t);
      OFF.forEach((o) => { want[dev + "_dep_" + di + "_" + bi + "_" + o.m] = { fireAtMs: ms - o.m * 60000, title: "🚌 Depart hotel " + o.t, body: (d.date.split(",")[0]) + " — leave at " + fmt12(t) }; });
    });
  });
  let prev = []; try { prev = JSON.parse(localStorage.getItem("jt_depremids") || "[]"); } catch (e) { }
  const now = Date.now();
  for (const id of prev) if (!want[id]) { try { await FB.db.collection("reminders").doc(id).delete(); } catch (e) { } }
  const keep = [];
  for (const id in want) {
    const w = want[id]; if (w.fireAtMs <= now) continue;
    try { await FB.db.collection("reminders").doc(id).set({ token, title: w.title, body: w.body, fireAtMs: w.fireAtMs, ts: firebase.firestore.FieldValue.serverTimestamp() }); keep.push(id); } catch (e) { }
  }
  try { localStorage.setItem("jt_depremids", JSON.stringify(keep)); } catch (e) { }
}
