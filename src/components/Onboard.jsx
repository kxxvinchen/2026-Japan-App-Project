import React, { useState } from "react";
import { useStore } from "../store.jsx";
import { TRIP } from "../data.js";
import GroupPicker from "./GroupPicker.jsx";
import SignInCard from "./SignInCard.jsx";
import { useFB } from "../lib/useFB.js";

export default function Onboard() {
  const fb = useFB();
  const { state, dispatch } = useStore();
  const [pend, setPend] = useState(state.groups || []);
  const toggle = (id) => setPend((p) => {
    const isPerf = ["band", "orch", "choir", "perc"].indexOf(id) > -1;
    const isShadow = ["schoir", "sband"].indexOf(id) > -1;
    if (p.indexOf(id) > -1) return p.filter((x) => x !== id);
    let next = p;
    if (isPerf) next = next.filter((x) => ["schoir", "sband"].indexOf(x) === -1);
    if (isShadow) next = next.filter((x) => ["band", "orch", "choir", "perc"].indexOf(x) === -1);
    next = next.concat([id]);
    // Percussion travels & performs with the Symphonic Wind Ensemble — selecting it also enrolls SWE (Band).
    if (id === "perc" && next.indexOf("band") < 0) next = next.concat(["band"]);
    return next;
  });
  const start = () => { dispatch({ type: "groups", groups: pend }); dispatch({ type: "nav", screen: "overview" }); };

  const isDir = fb.isDirector;
  const isChap = (fb.chapChannels || []).length > 0;
  return (
    <div className="screen">
      <div className="hdr" style={{ paddingTop: "calc(env(safe-area-inset-top) + 34px)", paddingBottom: 26, textAlign: "center" }}>
        <div className="splash-logo">日</div>
        <h1>Japan Tour 2026</h1>
        <div className="sub">{TRIP.org}</div>
        <div className="sub" style={{ marginTop: 6 }}>{TRIP.dates} · Travel Companion</div>
      </div>
      <div className="wrap">
        {!isDir && !isChap ? (
          <>
            <div className="sec-title" style={{ marginTop: 8 }}>Choose your group(s)</div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 4px 4px" }}>
              Pick one group to follow — or select several if you take part in more than one, or just want to
              see what the other groups are doing. The app merges every selected group's schedule, hotels and
              venues. You can change this anytime.
            </p>
            <GroupPicker value={pend} onToggle={toggle} />

            <button className="btn" disabled={!pend.length} onClick={start}>Start exploring</button>
          </>
        ) : (
          <button className="btn" onClick={() => dispatch({ type: "nav", screen: "overview" })}>Go to Trip</button>
        )}
        <div style={{ marginTop: "14px", marginBottom: "8px" }}>
          <SignInCard />
        </div>
      </div>
    </div>
  );
}
