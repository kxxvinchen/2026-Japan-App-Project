import React, { useEffect } from "react";
import { useStore } from "./store.jsx";
import Nav from "./components/Nav.jsx";
import Toast from "./components/Toast.jsx";
import Overview from "./components/Overview.jsx";
import Day from "./components/Day.jsx";
import Cities from "./components/Cities.jsx";
import City from "./components/City.jsx";
import Phrases from "./components/Phrases.jsx";
import Emergency from "./components/Emergency.jsx";
import Flight from "./components/Flight.jsx";
import Bus from "./components/Bus.jsx";
import Settings from "./components/Settings.jsx";
import AddActivity from "./components/AddActivity.jsx";
import Onboard from "./components/Onboard.jsx";
import Messages from "./components/Messages.jsx";
import Utilities from "./components/Utilities.jsx";
import Handbooks from "./components/Handbooks.jsx";
import NotifBanner from "./components/NotifBanner.jsx";
import { setGroups, setFlight, FB } from "./lib/firebase.js";
import { useFB } from "./lib/useFB.js";

const SCREENS = {
  overview: Overview, day: Day, cities: Cities, city: City, phrases: Phrases,
  emergency: Emergency, flight: Flight, bus: Bus, settings: Settings,
  addact: AddActivity, onboard: Onboard, messages: Messages, utilities: Utilities, handbooks: Handbooks,
};
const LABELS = { day: "Day", cities: "Cities", city: "City", phrases: "Translation Guide", messages: "Announcements", settings: "Group & Settings", emergency: "Emergency", flight: "Flights", bus: "Buses", addact: "Add Activity", onboard: "Welcome", utilities: "Utilities", handbooks: "Handbooks" };

function Stub({ name }) {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr"><h1>{name}</h1></div>
      <div className="wrap"><button className="btn ghost" onClick={() => dispatch({ type: "nav", screen: "overview" })}>‹ Back to Trip</button></div>
    </div>
  );
}

export default function App() {
  const fb = useFB();
  const { state, dispatch } = useStore();
  // let the Firebase layer navigate (e.g. to Announcements after a director signs in)
  useEffect(() => { window.__jtNav = (scr) => dispatch({ type: "nav", screen: scr }); }, [dispatch]);
  // keep the messaging layer's channel access in sync with the chosen groups
  useEffect(() => { setGroups(state.groups); }, [state.groups]);
  // flight choice drives the departure reminders
  useEffect(() => { setFlight(state.flight); }, [state.flight]);
  // sync the current screen state to the FB layer so we know when to show toasts
  useEffect(() => { FB.currentScreen = state.screen; }, [state.screen]);

  // Synchronize store groups with director or chaperone status
  const ALL_GROUPS = ["band", "orch", "choir", "schoir", "sband"];
  useEffect(() => {
    if (!fb.ready) return;
    if (fb.isDirector) {
      const matches = state.groups.length === ALL_GROUPS.length && state.groups.every((g) => ALL_GROUPS.includes(g));
      if (!matches) {
        dispatch({ type: "groups", groups: ALL_GROUPS });
      }
    } else if ((fb.chapChannels || []).length > 0) {
      const chapGroups = (fb.chapGroups && fb.chapGroups.length) ? fb.chapGroups : ALL_GROUPS;
      const matches = state.groups.length === chapGroups.length && state.groups.every((g) => chapGroups.includes(g));
      if (!matches) {
        dispatch({ type: "groups", groups: chapGroups });
      }
    }
  }, [fb.ready, fb.isDirector, fb.chapChannels, fb.chapGroups, state.groups, dispatch]);

  const Cur = SCREENS[state.screen];
  return (
    <>
      <div id="app">{Cur ? <Cur /> : <Stub name={LABELS[state.screen] || "Screen"} />}</div>
      <Nav />
      <Toast />
      <NotifBanner />
    </>
  );
}
