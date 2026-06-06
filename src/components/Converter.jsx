import React, { useState, useEffect, useCallback, useRef } from "react";

/* USD <-> JPY converter.
   The rate is fetched live from a free, no-key endpoint and refreshed whenever
   the app opens or regains focus. The latest value is cached on-device so the
   converter keeps working offline (showing the last known rate). Users can't
   edit the rate — it always reflects the published market value. */
const FX_KEY = "jt_fxrate";
const FALLBACK_RATE = 160;                          // used only until the first fetch lands
const API = "https://open.er-api.com/v6/latest/USD";

function loadCache() {
  try {
    const raw = localStorage.getItem(FX_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (o && typeof o === "object" && o.rate > 0) return { rate: o.rate, ts: o.ts || 0 };
    const n = parseFloat(raw); if (n > 0) return { rate: n, ts: 0 };   // legacy: bare number
  } catch (e) {}
  return null;
}

const fmtMoney = (n, dp) =>
  isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }) : "0";
const fmtRate = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const fmtTime = (ts) => {
  if (!ts) return "";
  try { return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
  catch (e) { return ""; }
};

const Swap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4v16" /><path d="M3.5 7.5 7 4l3.5 3.5" /><path d="M17 20V4" /><path d="M13.5 16.5 17 20l3.5-3.5" />
  </svg>
);
const Refresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" />
  </svg>
);

export default function Converter() {
  const cached = useRef(loadCache()).current;
  const [rate, setRate] = useState(cached ? cached.rate : FALLBACK_RATE);
  const [ts, setTs] = useState(cached ? cached.ts : 0);
  const [status, setStatus] = useState(cached ? "cached" : "none"); // none|cached|loading|live|offline
  const [usdTop, setUsdTop] = useState(true);
  const [amount, setAmount] = useState("");
  const everLive = useRef(false);

  const refresh = useCallback(async () => {
    if (typeof fetch === "undefined") return;
    setStatus((s) => (s === "live" ? "live" : "loading"));
    try {
      const r = await fetch(API, { cache: "no-store" });
      const j = await r.json();
      const jpy = j && j.rates && j.rates.JPY;
      if (j && j.result === "success" && jpy > 0) {
        const stamp = j.time_last_update_unix ? j.time_last_update_unix * 1000 : Date.now();
        everLive.current = true;
        setRate(jpy); setTs(stamp); setStatus("live");
        try { localStorage.setItem(FX_KEY, JSON.stringify({ rate: jpy, ts: stamp })); } catch (e) {}
        return;
      }
      throw new Error("bad response");
    } catch (e) {
      setStatus(everLive.current ? "live" : (cached ? "offline" : "none"));
    }
  }, [cached]);

  useEffect(() => {
    refresh();
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", refresh);
    const id = setInterval(refresh, 5 * 60 * 1000);   // keep it fresh while open
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", refresh);
      clearInterval(id);
    };
  }, [refresh]);

  const num = parseFloat(amount);
  const valid = isFinite(num) && num >= 0 && rate > 0;
  const converted = !valid ? "" : (usdTop ? num * rate : num / rate);
  const fromCur = usdTop ? "USD" : "JPY";
  const toCur = usdTop ? "JPY" : "USD";
  const fromSym = usdTop ? "$" : "¥";
  const toSym = usdTop ? "¥" : "$";
  const toDp = usdTop ? 0 : 2;

  const statusLabel =
    status === "live" ? "Live rate" :
    status === "loading" ? "Updating…" :
    status === "offline" ? "Offline — last updated" :
    status === "cached" ? "Last updated" : "Estimate — connect to update";

  return (
    <div className="conv">
      <div className="conv-field">
        <div className="conv-cur"><span className="conv-sym">{fromSym}</span>{fromCur}</div>
        <input className="conv-in" type="number" inputMode="decimal" min="0" step="any"
          placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label={"Amount in " + fromCur} />
      </div>

      <button className="conv-flip" onClick={() => setUsdTop((v) => !v)} aria-label="Swap currencies"><Swap /></button>

      <div className="conv-field conv-result">
        <div className="conv-cur"><span className="conv-sym">{toSym}</span>{toCur}</div>
        <div className="conv-out">{converted === "" ? "0" : fmtMoney(converted, toDp)}</div>
      </div>

      <div className="conv-rate">
        <span className="conv-rate-main">1 USD = <b>{fmtRate(rate)}</b> JPY</span>
        <button className={"conv-refresh" + (status === "loading" ? " spin" : "")} onClick={refresh} aria-label="Refresh rate"><Refresh /></button>
      </div>
      <div className="conv-status">
        <span className={"conv-dot " + (status === "live" ? "on" : status === "offline" ? "off" : "")} />
        {statusLabel}{ts ? " · " + fmtTime(ts) : ""}
      </div>
      <div className="conv-note">The rate updates automatically when you're online and is saved for offline use. Tap the arrows to flip USD ⇄ JPY.</div>
    </div>
  );
}
