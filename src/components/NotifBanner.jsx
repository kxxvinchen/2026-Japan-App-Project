import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store.jsx";
import { useFB } from "../lib/useFB.js";
import { notifGranted, notifBannerNeeded, enableNotifs } from "../lib/firebase.js";

const Bell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const VISIBLE_MS = 2600;     // time fully on-screen before it slides up
const ANIM_MS = 380;         // slide duration
const COOLDOWN_MS = 3 * 60 * 1000;

export default function NotifBanner() {
  useFB();
  const { state } = useStore();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);
  const lastShown = useRef(0);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const trigger = () => {
    if (show) return;
    if (state.screen === "onboard") return;                 // not during onboarding
    if (!notifBannerNeeded()) return;                        // already on, or unsupported
    if (Date.now() - lastShown.current < COOLDOWN_MS) return;
    lastShown.current = Date.now();
    setLeaving(false); setShow(true);
    timers.current.push(setTimeout(() => setLeaving(true), VISIBLE_MS));
    timers.current.push(setTimeout(() => { setShow(false); setLeaving(false); }, VISIBLE_MS + ANIM_MS));
  };

  // show shortly after the app opens, and again when it returns to the foreground
  useEffect(() => {
    const t = setTimeout(trigger, 1200);
    const onVis = () => { if (document.visibilityState === "visible") trigger(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", trigger);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("focus", trigger); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if notifications get enabled while it's up, retract it
  useEffect(() => { if (show && notifGranted()) { clearTimers(); setLeaving(true); timers.current.push(setTimeout(() => setShow(false), ANIM_MS)); } });

  if (!show) return null;

  const dismiss = () => { clearTimers(); setLeaving(true); timers.current.push(setTimeout(() => setShow(false), ANIM_MS)); };
  const onTap = () => { enableNotifs(); dismiss(); };

  return (
    <div className={"notif-banner" + (leaving ? " leaving" : "")} role="button" tabIndex={0} onClick={onTap}>
      <span className="nb-ic"><Bell /></span>
      <span className="nb-tx">
        <b>Turn on notifications</b>
        <span>Get tour announcements &amp; departure reminders</span>
      </span>
      <span className="nb-cta">Turn on</span>
    </div>
  );
}
