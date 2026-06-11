import React, { useState, useRef } from "react";
import { useStore } from "../store.jsx";
import { daySet, dayPerfCount, inGroup } from "../lib/groups.js";
import { isDayArchived } from "../lib/archive.js";

const ACTION_W = 104;   // px revealed behind the card

/* A single archived day card that can be swiped horizontally to reveal an
   "Un-archive" action behind it (Gmail-style). Tapping the card (without
   swiping) opens the day. touch-action:pan-y lets the page scroll vertically
   while this element owns the horizontal gesture, so no preventDefault needed. */
function SwipeRow({ children, onOpen, onUnarchive }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const g = useRef({ x: 0, y: 0, base: 0, axis: null, moved: false });

  const start = (e) => {
    const t = e.touches[0];
    g.current = { x: t.clientX, y: t.clientY, base: offset, axis: null, moved: false };
  };
  const move = (e) => {
    const t = e.touches[0], r = g.current;
    const mx = t.clientX - r.x, my = t.clientY - r.y;
    if (r.axis === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) r.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
    if (r.axis !== "x") return;          // vertical gesture → let the page scroll
    r.moved = true;
    if (!dragging) setDragging(true);
    setOffset(Math.max(-ACTION_W, Math.min(0, r.base + mx)));   // clamp to swipe-left only
  };
  const end = () => {
    setDragging(false);
    if (g.current.axis === "x") setOffset(offset < -ACTION_W / 2 ? -ACTION_W : 0);
  };
  const cardClick = () => {
    if (g.current.moved) return;         // this was a swipe, not a tap
    if (offset !== 0) { setOffset(0); return; }   // tap on an open row just closes it
    onOpen();
  };

  return (
    <div className="swipe-wrap">
      <button type="button" className="swipe-action" style={{ width: ACTION_W + "px" }}
        onClick={() => { setOffset(0); onUnarchive(); }}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><rect x="2" y="3" width="20" height="4" rx="1" />
          <path d="M12 11v6" /><path d="M9 14l3-3 3 3" />
        </svg>
        Un-archive
      </button>
      <div className="swipe-card" style={{ transform: "translateX(" + offset + "px)", transition: dragging ? "none" : "transform .22s ease" }}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} onTouchCancel={end} onClick={cardClick}>
        {children}
      </div>
    </div>
  );
}

function badgesFor(d, g, dir) {
  const pc = dayPerfCount(d, g, dir);
  const sights = (d.items || []).some((it) => it.type === "sightseeing" && inGroup(it, g, dir));
  const moves = (d.items || []).some((it) => it.type === "travel" && inGroup(it, g, dir));
  const out = [];
  if (pc > 0) out.push(<span key="p" className="badge b-perf">{pc} performance{pc > 1 ? "s" : ""}</span>);
  if (sights) out.push(<span key="s" className="badge b-sight">Sightseeing</span>);
  if (moves) out.push(<span key="m" className="badge b-move">Travel day</span>);
  if (!out.length) out.push(<span key="f" className="badge b-sight">Free / leisure</span>);
  return out;
}

export default function Archive() {
  const { state, dispatch } = useStore();
  const g = state.groups, dir = state.isDirector;
  const days = daySet(g);
  const archived = days
    .map((d, i) => ({ d, i }))
    .filter((x) => isDayArchived(x.d, state.unarchived));

  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹</button>
          <div className="htxt"><h1>Archive</h1><div className="sub">Completed days</div></div>
        </div>
      </div>
      <div className="wrap">
        {archived.length === 0 ? (
          <div className="intro-note">No completed days yet. Days move here automatically after they end.</div>
        ) : (
          <>
            <div className="intro-note">Swipe a day left to reveal <b>Un-archive</b>, or tap to view it.</div>
            {archived.map(({ d, i }) => (
              <SwipeRow key={d.d}
                onOpen={() => dispatch({ type: "day", i })}
                onUnarchive={() => dispatch({ type: "unarchive", d: d.d })}>
                <div className="card day-card">
                  <div className="day-tag">
                    <div className="dn">{d.dow}</div><div className="dd">{d.dd}</div><div className="dm">{d.dm}</div>
                  </div>
                  <div className="day-body">
                    <div className="dcity">Day {d.d} · {d.city}</div>
                    <div className="ddate">{d.date}</div>
                    <div className="dhead">{d.headline}</div>
                    <div className="day-badges">{badgesFor(d, g, dir)}</div>
                  </div>
                  <div className="chev">›</div>
                </div>
              </SwipeRow>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
