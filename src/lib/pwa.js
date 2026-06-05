import { FB } from "./firebase.js";

let _reloaded = false;
function reloadOnce() { if (_reloaded) return; _reloaded = true; location.reload(); }

let _checking = false;
/* Vite hashes the bundle filename per build, so a new deploy = a new asset name.
   Compare the live index.html's bundle name to the one we're running; if it changed,
   clear caches and reload. Belt-and-suspenders alongside the service worker for iOS PWAs
   that reopen a frozen snapshot. */
export async function checkForUpdate() {
  if (_checking || location.protocol.indexOf("http") !== 0) return;
  _checking = true;
  try {
    const cur = (import.meta.url.split("/").pop() || "");
    const res = await fetch("index.html?_v=" + Date.now(), { cache: "no-store" });
    const txt = await res.text();
    const m = txt.match(/assets\/(index-[\w.-]+\.js)/);
    if (m && cur && m[1] !== cur) {
      try { if ("caches" in window) { const ks = await caches.keys(); await Promise.all(ks.map((k) => caches.delete(k))); } } catch (e) {}
      reloadOnce();
      return;
    }
  } catch (e) { /* offline — try again next foreground */ }
  _checking = false;
}

export function setupPWA() {
  if (!("serviceWorker" in navigator) || location.protocol.indexOf("http") !== 0) return;
  navigator.serviceWorker.register("sw.js").then((r) => {
    FB.swReg = r;
    try { r.update(); } catch (e) {}
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { try { r.update(); } catch (e) {} } });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);
  navigator.serviceWorker.addEventListener("message", (e) => { if (e.data && e.data.type === "jt-reload") reloadOnce(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) checkForUpdate(); });
  window.addEventListener("focus", checkForUpdate);
  window.addEventListener("pageshow", checkForUpdate);
  setTimeout(checkForUpdate, 1500);
}
