import React from "react";

/* If the app ever throws while rendering, self-heal once: clear caches, unregister the
   service worker, and reload — so a bad build can't strand users on a blank screen. */
export default class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch() {
    try {
      if (!sessionStorage.getItem("jt_healed")) {
        sessionStorage.setItem("jt_healed", "1");
        Promise.resolve()
          .then(() => ("caches" in window ? caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))) : null))
          .then(() => (navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then((rs) => Promise.all(rs.map((r) => r.unregister()))) : null))
          .then(() => location.reload());
      }
    } catch (e) { try { location.reload(); } catch (_) {} }
  }
  render() {
    if (this.state.err) return <div style={{ padding: 20, fontFamily: "sans-serif" }}>Reloading…</div>;
    return this.props.children;
  }
}
