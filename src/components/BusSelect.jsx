import React from "react";
import { useStore } from "../store.jsx";
import { BUSES } from "../data.js";

export default function BusSelect() {
  const { state, dispatch } = useStore();
  const b = BUSES.find((x) => x.id === state.bus);
  return (
    <>
      <select className="flight-select" value={state.bus} onChange={(e) => dispatch({ type: "bus", bus: e.target.value })}>
        <option value="">— Select your bus number —</option>
        {BUSES.map((x) => <option key={x.id} value={x.id}>{(x.shadow ? "Shadow Bus " : "Bus ") + x.num + " — " + x.ensemble}</option>)}
      </select>
      {b ? (
        <div className="card fl-card">
          <div className="fl-title">{b.shadow ? "Shadow Bus " : "Bus "}{b.num}</div>
          <div className="fl-who" style={{ margin: "0 0 6px" }}>{b.ensemble}</div>
          <div className="fl-meta">{b.desc}</div>
          <div className="fl-meta">Your daily boarding and departure times are listed in each day's “Full logistics” section.</div>
        </div>
      ) : null}
    </>
  );
}
