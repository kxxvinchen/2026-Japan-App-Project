import React, { useState } from "react";
import { useStore } from "../store.jsx";
import { ALL } from "../data.js";
import { daySet, inGroup } from "../lib/groups.js";
import { fmt12, blockFor, activityConflict } from "../lib/activity.js";
import { saveReminder } from "../lib/firebase.js";

export default function AddActivity() {
  const { state, dispatch } = useStore();
  const di = state.dayIdx;
  const d = daySet(state.groups)[di];
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [addr, setAddr] = useState("");
  const [remind, setRemind] = useState(0);
  const [error, setError] = useState("");

  const save = () => {
    if (!title.trim()) return setError("Please enter a title for your activity.");
    if (!time) return setError("Please choose a time.");
    const base = (d.items || []).map((it, idx) => ({ ...it, _idx: idx })).filter((it) => inGroup(it, state.groups, state.isDirector));
    const cust = (state.custom[di] || []).map((it) => ({ ...it, _custom: true }));
    const clash = activityConflict(base.concat(cust), time);
    if (clash) return setError("That time clashes with “" + clash.label + "”. Please pick another time.");
    const item = { t: blockFor(time), hr: fmt12(time), type: "other", title: title.trim(), desc: desc.trim() || "Personal addition to the itinerary.", groups: ALL };
    if (addr.trim()) item.loc = { n: addr.trim(), q: addr.trim(), kind: "sight" };
    if (remind > 0) item.remind = remind;
    dispatch({ type: "addCustom", di, item });
    if (remind > 0) saveReminder(d, time, remind, title.trim());
    dispatch({ type: "nav", screen: "day" });
  };

  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "day" })}>‹</button>
          <div className="htxt"><h1>Add activity</h1><div className="sub">Day {d.d} · {d.city} · {d.date}</div></div>
        </div>
      </div>
      <div className="wrap">
        {error ? <div className="form-err">{error}</div> : null}
        <div className="card">
          <label className="form-label">Time</label>
          <input className="form-in" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <label className="form-label">Title</label>
          <input className="form-in" type="text" maxLength={80} placeholder="e.g. Meet friends for ramen" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="form-label">Description (optional)</label>
          <textarea className="form-in" rows={3} placeholder="Any details…" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <label className="form-label">Address (optional)</label>
          <input className="form-in" type="text" placeholder="e.g. Ichiran Ramen, Shibuya, Tokyo" value={addr} onChange={(e) => setAddr(e.target.value)} />
          <label className="form-label">Reminder (optional)</label>
          <select className="form-in" value={remind} onChange={(e) => setRemind(+e.target.value)}>
            <option value={0}>No reminder</option>
            <option value={5}>5 minutes before</option>
            <option value={10}>10 minutes before</option>
            <option value={15}>15 minutes before</option>
            <option value={30}>30 minutes before</option>
            <option value={60}>60 minutes before</option>
          </select>
        </div>
        <button className="btn" onClick={save}>Add to my itinerary</button>
        <button className="btn ghost" onClick={() => dispatch({ type: "nav", screen: "day" })}>Cancel</button>
        <div className="intro-note">Saved on this device and added to Day {d.d}. If the time clashes with a performance, rehearsal, exchange or travel for your group, you'll be asked to pick another time.</div>
      </div>
    </div>
  );
}
