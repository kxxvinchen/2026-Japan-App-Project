import React, { useState } from "react";
import { useStore } from "../store.jsx";
import { mapsUrl } from "../lib/ui.js";
import { daySet, attireSet, egroups, inGroup, itemGroups, myGroupsEff, groupLabel } from "../lib/groups.js";
import { TYPE_LABEL, timeBlocks } from "../lib/schedule.js";
import { deleteReminder } from "../lib/firebase.js";
import { timesToAmPm } from "../lib/activity.js";
import { isDayCompleted, isDayArchived } from "../lib/archive.js";

function PlaceRow({ name, kind, cls, q }) {
  const ic = cls === "hotel" ? "H" : cls === "venue" ? "V" : "S";
  return (
    <div className="place">
      <div className={"place-ic pi-" + cls}>{ic}</div>
      <div className="place-tx"><div className="pn">{name}</div><div className="pk">{kind}</div></div>
      {q ? <a className="go" target="_blank" rel="noopener" href={mapsUrl(q)}>Map ›</a> : null}
    </div>
  );
}

function ItemCard({ di, it, g, dir }) {
  const { state, dispatch } = useStore();
  const nk = di + "_" + it._idx;
  const ex = !!state.excluded[nk];
  const noteVal = state.notes[nk] || "";
  const [noteOpen, setNoteOpen] = useState(!!noteVal);
  const tlabel = TYPE_LABEL[it.type] || "Item";
  const chips = (dir || g.length > 1) && !it._custom ? itemGroups(it, g, dir) : [];
  return (
    <div className={"item t-" + it.type + (ex ? " excluded" : "") + (it._custom ? " custom" : "")}>
      <div className="item-in">
        <div className="item-top">
          <span className="item-hr">{timesToAmPm(it.hr || "")}</span>
          <span className="item-title">{it.title}</span>
          <span className={"type-chip c-" + it.type}>{tlabel}</span>
        </div>
        <div className="item-desc">{timesToAmPm(it.desc)}</div>
        {it.gnote ? <div className="item-gnote">{it.gnote}</div> : null}
        {it.remind ? <div className="item-gnote">⏰ Reminder {it.remind} min before</div> : null}
        {chips.length ? (
          <div className="item-for"><span className="flabel">For</span>{chips.map((c, i) => <span className="fchip" key={i}>{c.short}</span>)}</div>
        ) : null}
        <div className="item-actions">
          {it.loc ? <a className="mini-btn map" target="_blank" rel="noopener" href={mapsUrl(it.loc.q)}>📍 {it.loc.n}</a> : null}
          <button className="mini-btn ex" onClick={() => dispatch({ type: "toggleExcl", key: nk })}>{ex ? "↺ Restore" : "✕ Skip this"}</button>
          <button className="mini-btn" onClick={() => setNoteOpen((o) => !o)}>✎ Note{noteVal ? " •" : ""}</button>
          {it._custom ? <button className="mini-btn ex" onClick={() => { if (it.remId) deleteReminder(it.remId); dispatch({ type: "delCustom", di, id: it.id }); }}>Delete</button> : null}
        </div>
        {noteOpen ? (
          <div className="note-box" style={{ display: "block" }}>
            <textarea placeholder="Your private note for this activity…" value={noteVal}
              onChange={(e) => dispatch({ type: "setNote", key: nk, val: e.target.value })} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Day() {
  const { state, dispatch } = useStore();
  const g = state.groups, dir = state.isDirector, di = state.dayIdx;
  const days = daySet(g);
  const d = days[di];
  const multi = dir || g.length > 1;
  const [logOpen, setLogOpen] = useState(false);

  const base = (d.items || []).map((it, idx) => ({ ...it, _idx: idx, _custom: false })).filter((it) => inGroup(it, g, dir));
  const cust = (state.custom[di] || []).map((it) => ({ ...it, _idx: "c" + it.id, _custom: true }));
  const items = base.concat(cust);

  const hotels = (d.hotels || []).filter((h) => egroups(g, dir).some((x) => (h.groups || []).indexOf(x) > -1));
  const attMatch = (attireSet(g)[d.d] || []).filter((a) => a.g.some((x) => egroups(g, dir).indexOf(x) > -1));
  const blocks = timeBlocks(items);

  const seen = {}; hotels.forEach((h) => { seen[h.n] = 1; });
  const venues = [], sights = [];
  items.forEach((it) => {
    if (it.loc && !seen[it.loc.n]) { seen[it.loc.n] = 1; if (it.loc.kind === "venue") venues.push(it.loc); else if (it.loc.kind === "sight") sights.push(it.loc); }
  });
  const logBlocks = (d.logistics || []).filter((b) => !b.groups || b.groups.some((x) => egroups(g, dir).indexOf(x) > -1));

  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹</button>
          <div className="htxt"><h1>Day {d.d} · {d.city}</h1><div className="sub">{d.date}</div></div>
        </div>
        <div className="sub" style={{ marginTop: 8 }}>{d.headline}</div>
      </div>
      <div className="wrap">
        {isDayCompleted(d) ? (
          isDayArchived(d, state.unarchived) ? (
            <button className="day-arch-btn" onClick={() => dispatch({ type: "unarchive", d: d.d })}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="4" rx="1" /><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><path d="M12 11v6" /><path d="M9 14l3-3 3 3" />
              </svg>
              Un-archive this day
            </button>
          ) : (
            <button className="day-arch-btn ghost" onClick={() => dispatch({ type: "archive", d: d.d })}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="4" rx="1" /><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><path d="M9 13h6" />
              </svg>
              Move to archive
            </button>
          )
        ) : null}
        <div className="card">
          <div className="sec-title" style={{ margin: "0 0 7px" }}>Meals included</div>
          {d.meals.length ? <div className="meal-row">{d.meals.map((m, i) => <span className="meal" key={i}>{m}</span>)}</div>
            : <div style={{ fontSize: 12, color: "var(--muted)" }}>No group meals scheduled — meals on your own.</div>}
        </div>
        <div className="card">
          <div className="sec-title" style={{ margin: "0 0 7px" }}>Attire</div>
          {attMatch.length ? attMatch.map((a, i) => {
            const who = attMatch.length > 1 ? myGroupsEff(g, dir).filter((x) => a.g.indexOf(x.id) > -1).map((x) => x.short).join(" / ") : "";
            return <div className="attire-line" key={i}>{who ? <span className="attire-who">{who}: </span> : null}{a.t}</div>;
          }) : <div style={{ fontSize: 12, color: "var(--muted)" }}>Check with your director for today's attire.</div>}
        </div>
        {d.note ? <div className="intro-note" style={{ marginTop: 0 }}>Note: {d.note}</div> : null}

        <div className="sec-title">Schedule — {groupLabel(g, dir)}</div>
        {items.length ? blocks.map((bk, i) => (
          <React.Fragment key={i}>
            <div className="blk-title">{bk.name}</div>
            {bk.items.map((it, j) => <ItemCard key={j} di={di} it={it} g={g} dir={dir} />)}
          </React.Fragment>
        )) : <div className="empty">No scheduled items for your group today.</div>}

        {logBlocks.length ? (
          <>
            <button className="btn ghost log-toggle" onClick={() => setLogOpen((o) => !o)}>▾ Full logistics &amp; exact times</button>
            {logOpen ? (
              <div className="log-wrap">
                {logBlocks.map((b, i) => (
                  <div className="log-block" key={i}>
                    <div className="log-label">{b.label}</div>
                    <ul className="log-lines">{b.lines.map((l, j) => <li key={j}>{timesToAmPm(l)}</li>)}</ul>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        <button className="btn ghost" onClick={() => dispatch({ type: "nav", screen: "addact" })}>+ Add your own activity</button>

        <div className="sec-title">Hotels</div>
        <div className="card">
          {hotels.length ? hotels.map((h, i) => {
            let kind = "Your hotel";
            if (multi) {
              const who = myGroupsEff(g, dir).filter((x) => (h.groups || []).indexOf(x.id) > -1).map((x) => x.short);
              kind = who.length === myGroupsEff(g, dir).length ? "All groups" : who.join(", ");
            }
            return <PlaceRow key={i} name={h.n} kind={kind} cls="hotel" q={h.q} />;
          }) : <div style={{ fontSize: 12, color: "var(--muted)" }}>No hotel — {di === 0 ? "overnight flight" : "departure day"}.</div>}
        </div>
        {venues.length ? <><div className="sec-title">Performance venues</div><div className="card">{venues.map((v, i) => <PlaceRow key={i} name={v.n} kind="Performance / venue" cls="venue" q={v.q} />)}</div></> : null}
        {sights.length ? <><div className="sec-title">Sightseeing &amp; places</div><div className="card">{sights.map((s, i) => <PlaceRow key={i} name={s.n} kind="Sightseeing" cls="sight" q={s.q} />)}</div></> : null}

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {di > 0 ? <button className="btn ghost" style={{ marginTop: 0 }} onClick={() => dispatch({ type: "day", i: di - 1 })}>‹ Day {di}</button> : null}
          {di < days.length - 1 ? <button className="btn ghost" style={{ marginTop: 0 }} onClick={() => dispatch({ type: "day", i: di + 1 })}>Day {di + 2} ›</button> : null}
        </div>
      </div>
    </div>
  );
}
