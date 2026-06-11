import React from "react";
import { useStore } from "../store.jsx";
import { useFB } from "../lib/useFB.js";
import { FB, totalUnread } from "../lib/firebase.js";

// which bottom-tab is highlighted for each screen
const NAV_FOR = {
  overview: "trip", archive: "trip", day: "trip", addact: "trip", emergency: "trip",
  cities: "cities", city: "cities",
  utilities: "utilities", phrases: "utilities", handbooks: "utilities", orchestra: "utilities",
  flight: "group", bus: "group", settings: "group",
  messages: "messages",
};

const Icon = ({ id }) => {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "trip") return <svg {...common}><path d="M3 7h18M3 12h18M3 17h18" /></svg>;
  if (id === "messages") return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
  if (id === "utilities") return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>;
  if (id === "cities") return <svg {...common}><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" /></svg>;
  return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" /></svg>;
};

export default function Nav() {
  const { state, dispatch } = useStore();
  useFB();
  if (state.screen === "onboard") return null;
  const active = NAV_FOR[state.screen] || "trip";
  const utilLabel = state.screen === "phrases" ? "Translation" : "Utilities";
  const unread = FB.configured && totalUnread() > 0;
  const Btn = ({ id, label, scr }) => (
    <button className={active === id ? "on" : ""} onClick={() => dispatch({ type: "nav", screen: scr })}>
      <Icon id={id} />{label}{id === "messages" && unread ? <span className="nav-badge" /> : null}
    </button>
  );
  return (
    <div className="nav" id="navbar">
      <Btn id="trip" label="Trip" scr="overview" />
      <Btn id="messages" label="Announcements" scr="messages" />
      <Btn id="utilities" label={utilLabel} scr="utilities" />
      <Btn id="cities" label="Cities" scr="cities" />
      <Btn id="group" label="Group" scr="settings" />
    </div>
  );
}
