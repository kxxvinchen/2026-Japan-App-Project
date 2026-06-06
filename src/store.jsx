import React, { createContext, useContext, useReducer, useEffect } from "react";

/* Same localStorage keys/format as the original app, so a user's saved
   groups / flight / bus / theme carry over. */
const LS = { group: "jt_group", flight: "jt_flight", bus: "jt_bus",
  theme: "jt_theme", excl: "jt_excluded", custom: "jt_custom", notes: "jt_notes" };

function load(k, def) {
  try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); }
  catch (e) { return def; }
}

function initial() {
  const groups = load(LS.group, []);
  return {
    screen: groups.length ? "overview" : "onboard",
    groups,
    flight: load(LS.flight, ""),
    bus: load(LS.bus, ""),
    excluded: load(LS.excl, {}),
    custom: load(LS.custom, {}),
    notes: load(LS.notes, {}),
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
      const c = { ...s.custom };
      c[a.di] = (c[a.di] || []).filter((_, i) => i !== a.ci);
      return { ...s, custom: c };
    }
    case "addCustom": {
      const c = { ...s.custom };
      c[a.di] = (c[a.di] || []).concat([a.item]);
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
