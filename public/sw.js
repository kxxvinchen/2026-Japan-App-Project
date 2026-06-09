/* Service worker: offline app shell + Firebase background push.
   Registered by the app when served over http(s). */

/* --- Firebase Cloud Messaging (background notifications) --- */
try {
  importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
  firebase.initializeApp({
    apiKey: "AIzaSyA2uy_QSc0eV9dmED4blU5SwdiYLAcE75U",
    authDomain: "japan-tour-2026.firebaseapp.com",
    projectId: "japan-tour-2026",
    appId: "1:629182869469:web:5a4931bb45e32d3fc31034",
    messagingSenderId: "629182869469",
    storageBucket: "japan-tour-2026.firebasestorage.app"
  });
  firebase.messaging(); // FCM auto-displays "notification" payloads while backgrounded
} catch (e) { /* offline / SDK unavailable — caching still works */ }

/* --- Badge on push (iOS PWA support) ---
   iOS PWAs freeze JS when backgrounded, so navigator.setAppBadge() in the
   main thread never runs.  The service-worker push event DOES fire, so we
   set the badge here so the icon dot appears immediately alongside the banner. */
self.addEventListener("push", e => {
  // Set badge — navigator.setAppBadge is available in service worker scope
  if (self.navigator && self.navigator.setAppBadge) {
    e.waitUntil(self.navigator.setAppBadge(1).catch(() => {}));
  }
  // Firebase auto-displays the notification from the "notification" payload,
  // so we don't need to call showNotification ourselves.
});

/* --- Notification click → open / focus the app --- */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(wins => {
      for (const w of wins) {
        if (w.url.includes(self.registration.scope) || w.url.includes(self.location.origin)) {
          return w.focus();
        }
      }
      return clients.openWindow("/");
    })
  );
});

/* --- Offline app shell cache --- */
const CACHE = "jt-v200";
const ASSETS = ["./", "index.html", "manifest.json",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // best-effort, freshly-fetched: one failing asset must never block activation (and the self-heal)
    await Promise.all(ASSETS.map(a => c.add(new Request(a, { cache: "reload" })).catch(() => {})));
    await self.skipWaiting();   // take over without waiting for old tabs to close
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    // wipe every old cache so no stale/broken index.html can survive
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    // SELF-HEAL: force every open window (even a blank/crashed one) to reload under this
    // fresh worker. The browser always re-checks this script (served no-cache) when the app
    // is opened, so a stuck device recovers by itself the next time it's launched.
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const win of wins) {
      try { win.postMessage({ type: "jt-reload" }); } catch (_) {}
      try { await win.navigate(win.url); } catch (_) {}
    }
  })());
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "jt-skip-waiting") self.skipWaiting();
  if (e.data && e.data.type === "jt-clear-badge") {
    if (self.navigator && self.navigator.clearAppBadge) {
      self.navigator.clearAppBadge().catch(() => {});
    }
  }
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let cross-origin (Firebase, maps) hit network
  const isNav = e.request.mode === "navigate" ||
    (e.request.headers.get("accept") || "").includes("text/html");
  e.respondWith((async () => {
    try {
      // navigations always pull the freshest copy (cache:"reload" bypasses the HTTP cache),
      // so a stale or broken page can never persist when the device is online
      const req = isNav ? new Request(e.request.url, { cache: "reload" }) : e.request;
      const r = await fetch(req);
      const c = await caches.open(CACHE); c.put(e.request, r.clone());
      return r;
    } catch (_) {
      const m = await caches.match(e.request);
      return m || (await caches.match("index.html")) || Response.error();
    }
  })());
});
