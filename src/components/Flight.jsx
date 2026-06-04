import React from "react";
import { useStore } from "../store.jsx";
import FlightSelect from "./FlightSelect.jsx";

export default function Flight() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹</button>
          <div className="htxt"><h1>Your Flight</h1><div className="sub">Departure &amp; return details</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="sec-title">Flight group</div>
        <FlightSelect />
      </div>
    </div>
  );
}
