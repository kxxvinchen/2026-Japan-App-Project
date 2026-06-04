import React from "react";
import { GROUPS } from "../data.js";

/* multi-select group picker. `value` = array of group ids; onToggle(id) toggles one. */
export default function GroupPicker({ value, onToggle }) {
  let cat = "";
  const rows = [];
  GROUPS.forEach((g) => {
    if (g.cat !== cat) { cat = g.cat; rows.push(<div className="grp-head" key={"h" + cat}>{cat}</div>); }
    const sel = value.indexOf(g.id) > -1;
    rows.push(
      <div className={"opt " + (sel ? "sel" : "")} key={g.id} onClick={() => onToggle(g.id)}>
        <div className="opt-radio">{sel ? "✓" : ""}</div>
        <div className="opt-tx"><div className="on">{g.name}</div></div>
      </div>
    );
  });
  return <>{rows}</>;
}
