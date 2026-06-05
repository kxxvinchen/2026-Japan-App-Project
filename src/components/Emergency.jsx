import React from "react";
import { useStore } from "../store.jsx";
import { EMERGENCY } from "../data.js";
import { isShadowOnly } from "../lib/groups.js";

function Row({ h, tag }) {
  return (
    <a className="emerg-row" href={"tel:" + h.tel}>
      <div className="emerg-row-city">{h.city}</div>
      <div className="emerg-row-name">{h.name}{tag && h.pharmacy ? <span className="emerg-tag">24h pharmacy</span> : null}</div>
      <div className="emerg-row-addr">{h.addr}</div>
      <div className="emerg-row-tel">{h.tel} ›</div>
    </a>
  );
}

export default function Emergency() {
  const { state, dispatch } = useStore();
  const shadow = isShadowOnly(state.groups);
  const hotels = shadow ? EMERGENCY.hotels.shadow : EMERGENCY.hotels.performer;
  const hospitals = shadow ? EMERGENCY.hospitals.shadow : EMERGENCY.hospitals.performer;
  return (
    <div className="screen">
      <div className="hdr emerg-hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹</button>
          <div className="htxt"><h1>Emergency</h1><div className="sub">Procedures, hospitals &amp; hotels</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="emerg-calls">
          {EMERGENCY.numbers.map((n, i) => (
            <a className="emerg-call" key={i} href={"tel:" + n.num}>
              <span className="emerg-call-num">{n.num}</span>
              <span className="emerg-call-lbl">{n.label}</span>
            </a>
          ))}
        </div>
        <div className="set-card">
          <h3>If something happens</h3>
          {EMERGENCY.procedures.map((p, i) => (
            <div className="emerg-proc" key={i}>
              <div className="emerg-proc-h">{p.h}</div>
              <ul className="emerg-list">{p.pts.map((x, j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="set-card">
          <h3>English-speaking hospitals{shadow ? " (Shadow Tour)" : ""}</h3>
          <div className="set-sub">Tap a hospital to call. Carry your hotel info card at all times.</div>
          {hospitals.map((h, i) => <Row key={i} h={h} tag />)}
        </div>
        <div className="set-card">
          <h3>Your hotels{shadow ? " (Shadow Tour)" : ""}</h3>
          <div className="set-sub">Tap to call the front desk.</div>
          {hotels.map((h, i) => <Row key={i} h={h} />)}
        </div>
        <div className="intro-note" style={{ marginBottom: 0 }}>Always follow the instructions of tour staff, school administrators and local authorities first.</div>
      </div>
    </div>
  );
}
