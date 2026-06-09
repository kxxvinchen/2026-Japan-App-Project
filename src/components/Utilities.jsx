import React from "react";
import { useStore } from "../store.jsx";
import Converter from "./Converter.jsx";

const Book = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const Violin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

export default function Utilities() {
  const { dispatch } = useStore();
  const go = (screen) => dispatch({ type: "nav", screen });
  return (
    <div className="screen">
      <div className="hdr">
        <h1>Utilities</h1>
        <div className="sub">Handy tools for the trip</div>
      </div>
      <div className="wrap">
        <button className="util-tile" onClick={() => go("phrases")}>
          <div className="util-ic">あ</div>
          <div className="util-tx">
            <div className="t">Translation Guide</div>
            <div className="s">Key Japanese phrases — tap any to hear it spoken</div>
          </div>
          <span className="chev2">›</span>
        </button>

        <button className="util-tile books" onClick={() => go("handbooks")}>
          <div className="util-ic"><Book /></div>
          <div className="util-tx">
            <div className="t">Handbooks</div>
            <div className="s">Performer/chaperone &amp; Shadow Tour guides (PDF)</div>
          </div>
          <span className="chev2">›</span>
        </button>

        <div className="sec-title">Currency converter</div>
        <div className="card conv-card"><Converter /></div>

        <div className="sec-title">Orchestra</div>
        <button className="util-tile" onClick={() => go("orchestra")}>
          <div className="util-ic"><Violin /></div>
          <div className="util-tx">
            <div className="t">Orchestra Resources</div>
            <div className="s">Principal annotations &amp; extra-part managers</div>
          </div>
          <span className="chev2">›</span>
        </button>
      </div>
    </div>
  );
}
