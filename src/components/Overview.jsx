import React from "react";
import { useStore } from "../store.jsx";
import { TRIP, BUSES } from "../data.js";
import { daySet, dayPerfCount, inGroup } from "../lib/groups.js";
import { isDayArchived } from "../lib/archive.js";

function FlightBanner() {
  const { state, dispatch } = useStore();
  const f = state.flight;
  return (
    <div className="grp-banner flight-banner" onClick={() => dispatch({ type: "nav", screen: "flight" })}>
      <span>Flight letter: <b>{f || "Tap to select"}</b></span>
      <span className="chg">{f ? "View ›" : "Select ›"}</span>
    </div>
  );
}

function BusBanner() {
  const { state, dispatch } = useStore();
  const bo = BUSES.find((b) => b.id === state.bus);
  return (
    <div className="grp-banner bus-banner" onClick={() => dispatch({ type: "nav", screen: "bus" })}>
      <span>Bus number: <b>{bo ? (bo.shadow ? "Shadow " + bo.num : bo.num) : "Tap to select"}</b></span>
      <span className="chg">{bo ? "View ›" : "Select ›"}</span>
    </div>
  );
}

function EmergencyBanner() {
  const { dispatch } = useStore();
  return (
    <div className="grp-banner emerg-banner" onClick={() => dispatch({ type: "nav", screen: "emergency" })}>
      <span>Emergency info &amp; procedures</span>
      <span className="chg">Open ›</span>
    </div>
  );
}

export default function Overview() {
  const { state, dispatch } = useStore();
  const g = state.groups, dir = state.isDirector;
  const days = daySet(g);
  const totalPerf = days.reduce((s, d) => s + dayPerfCount(d, g, dir), 0);
  const multi = dir || g.length > 1;
  const archivedCount = days.reduce((n, d) => n + (isDayArchived(d, state.unarchived) ? 1 : 0), 0);

  return (
    <div className="screen">
      <div className="hdr">
        <h1>{TRIP.title}</h1>
        <div className="sub">{TRIP.org}</div>
        <div className="stats">
          <div className="stat"><div className="n">15</div><div className="l">Days</div></div>
          <div className="stat"><div className="n">5</div><div className="l">Cities</div></div>
          <div className="stat"><div className="n">{totalPerf}</div><div className="l">{multi ? "Shows" : "Your shows"}</div></div>
        </div>
        <FlightBanner />
        <BusBanner />
        <EmergencyBanner />
      </div>
      <div className="wrap">
        <div className="sec-title">Day-by-day itinerary</div>
        {days.map((d, i) => {
          if (isDayArchived(d, state.unarchived)) return null;   // completed days live in the Archive
          const pc = dayPerfCount(d, g, dir);
          const sights = (d.items || []).some((it) => it.type === "sightseeing" && inGroup(it, g, dir));
          const moves = (d.items || []).some((it) => it.type === "travel" && inGroup(it, g, dir));
          const badges = [];
          if (pc > 0) badges.push(<span key="p" className="badge b-perf">{pc} performance{pc > 1 ? "s" : ""}</span>);
          if (sights) badges.push(<span key="s" className="badge b-sight">Sightseeing</span>);
          if (moves) badges.push(<span key="m" className="badge b-move">Travel day</span>);
          if (!badges.length) badges.push(<span key="f" className="badge b-sight">Free / leisure</span>);
          return (
            <div className="card day-card" key={d.d} onClick={() => dispatch({ type: "day", i })}>
              <div className="day-tag">
                <div className="dn">{d.dow}</div><div className="dd">{d.dd}</div><div className="dm">{d.dm}</div>
              </div>
              <div className="day-body">
                <div className="dcity">Day {d.d} · {d.city}</div>
                <div className="ddate">{d.date}</div>
                <div className="dhead">{d.headline}</div>
                <div className="day-badges">{badges}</div>
              </div>
              <div className="chev">›</div>
            </div>
          );
        })}
        <div className="intro-note">Tap any day for the full hour-by-hour schedule, hotels, venues and map links.</div>
        {archivedCount > 0 ? (
          <button className="archive-tile" onClick={() => dispatch({ type: "nav", screen: "archive" })}>
            <span className="arch-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />
              </svg>
            </span>
            <span className="arch-tx">
              <span className="t">Archive</span>
              <span className="s">{archivedCount} completed day{archivedCount > 1 ? "s" : ""}</span>
            </span>
            <span className="arch-chev">›</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
