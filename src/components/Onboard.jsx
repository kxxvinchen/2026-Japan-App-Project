import React, { useState } from "react";
import { useStore } from "../store.jsx";
import { TRIP } from "../data.js";
import GroupPicker from "./GroupPicker.jsx";
import SignInCard from "./SignInCard.jsx";

export default function Onboard() {
  const { state, dispatch } = useStore();
  const [pend, setPend] = useState(state.groups || []);
  const toggle = (id) => setPend((p) => (p.indexOf(id) > -1 ? p.filter((x) => x !== id) : p.concat([id])));
  const start = () => { dispatch({ type: "groups", groups: pend }); dispatch({ type: "nav", screen: "overview" }); };
  return (
    <div className="screen">
      <div className="hdr" style={{ paddingTop: "calc(env(safe-area-inset-top) + 34px)", paddingBottom: 26, textAlign: "center" }}>
        <div className="splash-logo">日</div>
        <h1>Japan Tour 2026</h1>
        <div className="sub">{TRIP.org}</div>
        <div className="sub" style={{ marginTop: 6 }}>{TRIP.dates} · Travel Companion</div>
      </div>
      <div className="wrap">
        <div className="sec-title" style={{ marginTop: 8 }}>Choose your group(s)</div>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 4px 4px" }}>
          Pick one group to follow — or select several if you take part in more than one, or just want to
          see what the other groups are doing. The app merges every selected group's schedule, hotels and
          venues. You can change this anytime.
        </p>
        <GroupPicker value={pend} onToggle={toggle} />

        <button className="btn" disabled={!pend.length} onClick={start}>Start exploring</button>
        <div style={{ marginTop: "14px", marginBottom: "8px" }}>
          <SignInCard />
        </div>
      </div>
    </div>
  );
}
