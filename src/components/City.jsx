import React from "react";
import { useStore } from "../store.jsx";
import { CITIES } from "../data.js";
import { mapsUrl } from "../lib/ui.js";

export default function City() {
  const { state, dispatch } = useStore();
  const c = CITIES[state.cityIdx];
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "cities" })}>‹</button>
          <div className="htxt"><h1>{c.name}</h1><div className="sub">{c.days}</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="card">
          <div className="sec-title" style={{ margin: "0 0 6px" }}>Overview</div>
          <div className="city-intro" style={{ fontSize: 13 }}>{c.intro}</div>
        </div>
        <div className="guide-h">Top attractions</div>
        <div className="card">
          <ul className="guide-list">
            {c.attractions.map((a, i) => (
              <li key={i}><span className="dotmk">◆</span><span><b>{a[0]}</b> — {a[1]}</span></li>
            ))}
          </ul>
        </div>
        <div className="guide-h">What to eat</div>
        <div className="card food-card">
          {c.food.map((a, i) => (
            <details className="food" key={i}>
              <summary className="food-sum"><span className="dotmk">●</span><b>{a[0]}</b><span className="food-chev">▾</span></summary>
              <div className="food-body">
                {a[1]}
                {a[2] && a[2].length ? (
                  <>
                    <div className="food-where">Where to try it:</div>
                    <div className="food-places">
                      {a[2].map((pl, j) => (
                        <a className="mini-btn map food-place" key={j} target="_blank" rel="noopener" href={mapsUrl(pl + " " + c.name)}>📍 {pl}</a>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </details>
          ))}
        </div>
        <div className="intro-note">Tip: tap a dish to find places to eat it, or tap a day in the Trip tab to find map links for the specific places your group visits in {c.name}.</div>
      </div>
    </div>
  );
}
