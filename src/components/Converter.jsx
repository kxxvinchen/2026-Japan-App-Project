import React, { useState } from "react";

/* Offline USD <-> JPY converter.
   The rate is an editable, on-device estimate (no network needed). Default is a
   recent USD/JPY value; users can update it anytime and it's saved locally. */
const DEFAULT_RATE = 160;          // JPY per 1 USD
const FX_KEY = "jt_fxrate";

const loadRate = () => {
  try { const v = parseFloat(localStorage.getItem(FX_KEY)); return v > 0 ? v : DEFAULT_RATE; }
  catch (e) { return DEFAULT_RATE; }
};

const fmt = (n, dp) =>
  isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }) : "0";

const Swap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4v16" /><path d="M3.5 7.5 7 4l3.5 3.5" />
    <path d="M17 20V4" /><path d="M13.5 16.5 17 20l3.5-3.5" />
  </svg>
);

export default function Converter() {
  const [rateStr, setRateStr] = useState(() => String(loadRate()));
  const [usdTop, setUsdTop] = useState(true);   // true: USD → JPY · false: JPY → USD
  const [amount, setAmount] = useState("");

  const rate = parseFloat(rateStr);
  const rateOk = isFinite(rate) && rate > 0;
  const num = parseFloat(amount);
  const valid = isFinite(num) && num >= 0 && rateOk;
  const converted = !valid ? "" : (usdTop ? num * rate : num / rate);

  const onRate = (v) => {
    setRateStr(v);
    const r = parseFloat(v);
    try { if (isFinite(r) && r > 0) localStorage.setItem(FX_KEY, String(r)); } catch (e) {}
  };

  const fromCur = usdTop ? "USD" : "JPY";
  const toCur = usdTop ? "JPY" : "USD";
  const fromSym = usdTop ? "$" : "¥";
  const toSym = usdTop ? "¥" : "$";
  const toDp = usdTop ? 0 : 2;                  // yen: whole · dollars: cents

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
        <div className="conv-out">{converted === "" ? "0" : fmt(converted, toDp)}</div>
      </div>

      <div className="conv-rate">
        <span>1 USD =</span>
        <input className="conv-rate-in" type="number" inputMode="decimal" min="0" step="any"
          value={rateStr} onChange={(e) => onRate(e.target.value)} aria-label="Yen per US dollar" />
        <span>JPY</span>
      </div>
      <div className="conv-note">Works offline. Tap the arrows to flip USD ⇄ JPY. Update the rate above anytime — it's saved on this device.</div>
    </div>
  );
}
