import React, { useState, useEffect } from "react";
import { useStore } from "../store.jsx";
import { TRIP, GROUPS } from "../data.js";
import GroupPicker from "./GroupPicker.jsx";
import FlightSelect from "./FlightSelect.jsx";
import BusSelect from "./BusSelect.jsx";
import SignInCard from "./SignInCard.jsx";
import { enableNotifs, notifGranted, clearActivityReminders, setShowSignIn } from "../lib/firebase.js";
import { useFB } from "../lib/useFB.js";

export default function Settings() {
  const fb = useFB();
  const { state, dispatch } = useStore();
  
  useEffect(() => {
    return () => {
      setShowSignIn(false);
    };
  }, []);

  const [pend, setPend] = useState(state.groups || []);
  const [, force] = useState(0);
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
  const exCount = Object.keys(state.excluded).filter((k) => state.excluded[k]).length;
  const cuCount = Object.values(state.custom).reduce((s, a) => s + a.length, 0);
  const notif = notifGranted();
  const enableNotif = () => { enableNotifs(); setTimeout(() => force((n) => n + 1), 400); };

  const isDir = fb.isDirector;
  const isChap = (fb.chapChannels || []).length > 0;
  return (
    <div className="screen">
      <div className="hdr"><h1>Your Group &amp; Settings</h1><div className="sub">Tailor the itinerary to you</div></div>
      <div className="wrap">
        <div className="set-card">
          <h3>Groups</h3>
          {isDir ? (
            <div className="set-sub">You are signed in as a director and are assigned to all groups.</div>
          ) : isChap ? (
            <div className="set-sub">
              You are signed in as a chaperone and are assigned to:{" "}
              <b>
                {state.groups
                  .map((gid) => {
                    const g = GROUPS.find((x) => x.id === gid);
                    return g ? g.name : gid;
                  })
                  .join(", ") || "No groups"}
              </b>
            </div>
          ) : (
            <>
              <div className="set-sub">Pick the group(s) you're traveling with.</div>
              <GroupPicker value={pend} onToggle={toggle} />
              <button className="btn" onClick={() => {
                dispatch({ type: "groups", groups: pend });
                // Stay on the Group tab and jump to the top (rAF so it sticks after the re-render).
                const app = document.getElementById("app");
                if (app) { app.scrollTop = 0; requestAnimationFrame(() => { if (app) app.scrollTop = 0; }); }
              }}>Save</button>
            </>
          )}
        </div>

        <div className="set-card"><h3>Flights</h3><div className="set-sub">Your assigned flight group (A–I).</div><FlightSelect /></div>
        <div className="set-card"><h3>Buses</h3><div className="set-sub">Your touring coach.</div><BusSelect /></div>

        <div className="set-card">
          <h3>Notifications</h3>
          <div className="set-sub">Get push notifications for announcements.</div>
          {notif
            ? <button className="btn" disabled style={{ background: "#9aa5b1", color: "#fff", border: "none", cursor: "default" }}>✓ Notifications enabled</button>
            : <><button className="btn" onClick={enableNotif}>Enable notifications</button><div className="set-sub" style={{ margin: "10px 0 0" }}>On iPhone, add to your Home Screen first.</div></>}
        </div>

        <div className="set-card">
          <h3>Appearance</h3>
          <div className="set-sub">Switch between light and dark.</div>
          <button className="btn ghost" onClick={() => dispatch({ type: "toggleTheme" })}>{state.dark ? "Switch to light mode" : "Switch to dark mode"}</button>
        </div>

        <SignInCard />

        <div className="set-card">
          <h3>Customizations</h3>
          <div className="set-sub">Skipped {exCount} · added {cuCount} (saved on this device only).</div>
          <button className="btn ghost" onClick={() => { clearActivityReminders(); dispatch({ type: "set", patch: { excluded: {}, custom: {}, notes: {} } }); }}>Reset all</button>
        </div>

        <div className="set-card" style={{ fontSize: 12.5, color: "var(--muted)" }}>
          <h3 style={{ marginBottom: 10 }}>About</h3>
          <b>{TRIP.title}</b><br />{TRIP.org}<br />{TRIP.dates}<br />Arranged by BMC Tours (Brain Co. Ltd.).<br /><br />
          Built from the official itinerary. Each day's “Full logistics” section holds the exact bus, train and flight times. Always confirm details with your directors and Tour Managers.
        </div>
      </div>
    </div>
  );
}
