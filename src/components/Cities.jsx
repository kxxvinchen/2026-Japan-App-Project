import React from "react";
import { useStore } from "../store.jsx";
import { CITIES } from "../data.js";

export default function Cities() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <h1>City Guides</h1>
        <div className="sub">Highlights, attractions and food for every stop</div>
        <div className="transl-banner" onClick={() => dispatch({ type: "nav", screen: "phrases" })}>
          <div className="transl-ic">あ</div>
          <div className="transl-tx">
            <div className="t">Translation Guide</div>
            <div className="s">Key Japanese phrases — tap any to hear it</div>
          </div>
          <span className="chev2">›</span>
        </div>
      </div>
      <div className="wrap">
        <div className="sec-title">Five cities on the tour</div>
        {CITIES.map((c, i) => (
          <div className="card city-card" key={c.id || i} onClick={() => dispatch({ type: "city", i })}>
            <div className="city-thumb">{c.emoji}</div>
            <div className="day-body">
              <div className="dcity">{c.name}</div>
              <div className="ddate">{c.days}</div>
              <div className="dhead">{c.intro.slice(0, 82)}…</div>
            </div>
            <div className="chev">›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
