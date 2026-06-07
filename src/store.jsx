import React, { createContext, useContext, useReducer, useEffect } from "react";

/* Same localStorage keys/format as the original app, so a user's saved
   groups / flight / bus / theme carry over. */
const LS = { group: "jt_group", flight: "jt_flight", bus: "jt_bus",
  theme: "jt_theme", excl: "jt_excluded", custom: "jt_custom", notes: "jt_notes" };

function load(k, def) {
  try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); }
  catch (e) { return def; }
}

// Stable, collision-resistant id for a custom activity (so its notes/skip survive
// the deletion of any other custom activity on the same day).
let _idSeq = 0;
const newCustomId = () => "k" + Date.now().toString(36) + (_idSeq++).toString(36) + Math.random().toString(36).slice(2, 5);

/* One-time migration: older custom activities were keyed by array index, so notes
   and skip-states (jt_notes / jt_excluded) used keys like "3_c0". Give every custom
   activity a permanent id and rewrite those index-based keys to id-based ones, so a
   deletion can never shift them onto the wrong activity again. */
function migrateCustom(custom, notes, excluded) {
  Object.keys(custom).forEach((di) => {
    (custom[di] || []).forEach((it, ci) => {
      if (it.id) return;                       // already migrated
      it.id = newCustomId();
      const oldK = di + "_c" + ci, newK = di + "_c" + it.id;
      if (notes[oldK] != null) { notes[newK] = notes[oldK]; delete notes[oldK]; }
      if (excluded[oldK] != null) { excluded[newK] = excluded[oldK]; delete excluded[oldK]; }
    });
  });
}

function sanitizeGroups(groups) {
  if (!groups || !groups.length) return [];
  const hasPerf = groups.some((g) => g === "band" || g === "orch" || g === "choir");
  const hasShadow = groups.some((g) => g === "sband" || g === "schoir");
  if (hasPerf && hasShadow) {
    return groups.filter((g) => g === "band" || g === "orch" || g === "choir");
  }
  return groups;
}

function initial() {
  const groups = sanitizeGroups(load(LS.group, []));
  const custom = load(LS.custom, {});
  const notes = load(LS.notes, {});
  const excluded = load(LS.excl, {});
  migrateCustom(custom, notes, excluded);
  return {
    screen: groups.length ? "overview" : "onboard",
    groups,
    flight: load(LS.flight, ""),
    bus: load(LS.bus, ""),
    excluded,
    custom,
    notes,
    // First install (no saved theme): follow the browser/OS color scheme once.
    // After that the value is persisted, so the user's manual toggle always wins.
    dark: (() => {
      try {
        const v = localStorage.getItem(LS.theme);
        if (v === "dark") return true;
        if (v === "light") return false;
        return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
      } catch (e) { return false; }
    })(),
    dayIdx: 0,
    cityIdx: 0,
    isDirector: false, // set later by the Firebase layer
  };
}

function reducer(s, a) {
  switch (a.type) {
    case "nav": return { ...s, screen: a.screen };
    case "day": return { ...s, screen: "day", dayIdx: a.i };
    case "city": return { ...s, screen: "city", cityIdx: a.i };
    case "groups": return { ...s, groups: a.groups };
    case "flight": return { ...s, flight: a.flight };
    case "bus": return { ...s, bus: a.bus };
    case "toggleTheme": return { ...s, dark: !s.dark };
    case "toggleExcl": {
      const ex = { ...s.excluded }; ex[a.key] = !ex[a.key]; return { ...s, excluded: ex };
    }
    case "setNote": {
      const n = { ...s.notes }; n[a.key] = a.val; return { ...s, notes: n };
    }
    case "delCustom": {
      // delete by stable id (never by index) and drop that activity's note/skip
      const arr = s.custom[a.di] || [];
      const removed = arr.find((x) => x.id === a.id);
      const c = { ...s.custom };
      c[a.di] = arr.filter((x) => x.id !== a.id);
      const notes = { ...s.notes }, excluded = { ...s.excluded };
      if (removed && removed.id) { const k = a.di + "_c" + removed.id; delete notes[k]; delete excluded[k]; }
      return { ...s, custom: c, notes, excluded };
    }
    case "addCustom": {
      const c = { ...s.custom };
      const item = { ...a.item, id: a.item.id || newCustomId() };
      c[a.di] = (c[a.di] || []).concat([item]);
      return { ...s, custom: c };
    }
    case "set": return { ...s, ...a.patch };
    default: return s;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  const persist = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  useEffect(() => persist(LS.group, state.groups), [state.groups]);
  useEffect(() => persist(LS.flight, state.flight), [state.flight]);
  useEffect(() => persist(LS.bus, state.bus), [state.bus]);
  useEffect(() => persist(LS.excl, state.excluded), [state.excluded]);
  useEffect(() => persist(LS.custom, state.custom), [state.custom]);
  useEffect(() => persist(LS.notes, state.notes), [state.notes]);

  // theme: persist (raw string, like the original) + reflect on <html>/<body>
  useEffect(() => {
    try { localStorage.setItem(LS.theme, state.dark ? "dark" : "light"); } catch (e) {}
    document.documentElement.classList.toggle("dark", state.dark);
    document.body.classList.toggle("dark", state.dark);
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", state.dark ? "#0f141b" : "#1F3864");
  }, [state.dark]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
