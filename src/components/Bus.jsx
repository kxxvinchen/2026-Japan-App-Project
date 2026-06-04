import React from "react";
import { useStore } from "../store.jsx";
import BusSelect from "./BusSelect.jsx";

export default function Bus() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹</button>
          <div className="htxt"><h1>Your Bus</h1><div className="sub">Daily touring coach</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="sec-title">Bus number</div>
        <BusSelect />
      </div>
    </div>
  );
}
