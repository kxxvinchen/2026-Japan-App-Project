import React from "react";
import { useStore } from "../store.jsx";
import { FLIGHTS } from "../data.js";

function Leg({ l }) {
  return (
    <div className="fl-leg">
      <div className="fl-no">{l.no} <span className="fl-air">{l.airline}</span></div>
      <div className="fl-route">{l.from} → {l.to}</div>
      <div className="fl-times"><span>Dep {l.dep}</span><span>Arr {l.arr}</span></div>
      {l.note ? <div className="fl-note">{l.note}</div> : null}
      <a className="mini-btn map" target="_blank" rel="noopener" href={"https://www.google.com/search?q=" + encodeURIComponent(l.no + " flight status")}>🔎 Look up {l.no}</a>
    </div>
  );
}
function Seg({ title, seg }) {
  return (
    <div className="card fl-card">
      <div className="fl-title">{title}</div>
      <div className="fl-meta">{seg.meta}</div>
      {seg.escort ? <div className="fl-meta">Bus escort: {seg.escort}</div> : null}
      {seg.legs.map((l, i) => <Leg key={i} l={l} />)}
    </div>
  );
}

export default function FlightSelect() {
  const { state, dispatch } = useStore();
  const f = FLIGHTS.find((x) => x.id === state.flight);
  return (
    <>
      <select className="flight-select" value={state.flight} onChange={(e) => dispatch({ type: "flight", flight: e.target.value })}>
        <option value="">— Select your flight group —</option>
        {FLIGHTS.map((x) => <option key={x.id} value={x.id}>{"Group " + x.id + " — " + x.menu}</option>)}
      </select>
      {f ? (
        <>
          <div className="fl-who">{f.who}</div>
          <Seg title="Outbound — Jun 9–10" seg={f.out} />
          <Seg title="Return — Jun 23" seg={f.ret} />
          <div className="intro-note" style={{ marginTop: 0 }}>Flight times are from the official itinerary and may change. Tap “Look up” on a flight for live status closer to the date.</div>
        </>
      ) : null}
    </>
  );
}
