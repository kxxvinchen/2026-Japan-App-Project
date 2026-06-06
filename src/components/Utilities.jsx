import React from "react";
import { useStore } from "../store.jsx";
import Converter from "./Converter.jsx";

export default function Utilities() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <h1>Utilities</h1>
        <div className="sub">Handy tools for the trip</div>
      </div>
      <div className="wrap">
        <button className="util-tile" onClick={() => dispatch({ type: "nav", screen: "phrases" })}>
          <div className="util-ic">あ</div>
          <div className="util-tx">
            <div className="t">Translation Guide</div>
            <div className="s">Key Japanese phrases — tap any to hear it spoken</div>
          </div>
          <span className="chev2">›</span>
        </button>

        <div className="sec-title">Currency converter</div>
        <div className="card conv-card"><Converter /></div>
      </div>
    </div>
  );
}
