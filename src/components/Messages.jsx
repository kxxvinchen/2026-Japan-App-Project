import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useFB } from "../lib/useFB.js";
import {
  FB, CHANNELS, CH_LABEL, accessibleChannels, channelMessages, unreadCount, relTime,
  canPostHere, sendMessage, deleteMessage, startEdit, cancelEdit,
  setActiveChannel, setMsgMenu, askDelete, closeMenu, toggleChanMenu, toggleExpanded,
  getDraft, saveDraft,
} from "../lib/firebase.js";
import { CH_MENTIONS } from "../lib/channels.js";

const Bell = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const Plane = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;

// color class for an @-mention tag — swe/sso/choir each own a color (shared across
// performers/chaperones/shadow), flights share one, @everyone its own.
function mentionClass(tag) {
  const t = String(tag).toLowerCase();
  if (t === "everyone") return "m-everyone";
  if (t.indexOf("swe") === 0) return "m-swe";
  if (t.indexOf("sso") === 0) return "m-sso";
  if (t.indexOf("choir") === 0) return "m-choir";
  if (t.indexOf("flight") === 0) return "m-flight";
  return "m-everyone";
}

function AnnCard({ m, isChapTab, canEdit }) {
  const bodyRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const exp = !!FB.expanded[m.id];
  useLayoutEffect(() => {
    const el = bodyRef.current; if (!el) return;
    if (exp) { setOverflow(true); return; }
    setOverflow(el.scrollHeight - el.clientHeight > 2);
  }, [exp, m.text]);
  const menuOpen = canEdit && FB.msgMenu === m.id;
  const dirBadge = isChapTab && m.role === "director";
  return (
    <div className="ann-card">
      {menuOpen ? (
        FB.msgDel === m.id ? (
          <div className="msg-menu"><button className="del" onClick={() => deleteMessage(m.channel, m.id)}>Delete for everyone</button><button onClick={closeMenu}>Cancel</button></div>
        ) : (
          <div className="msg-menu"><button onClick={() => startEdit(m.channel, m.id)}>Edit</button><button className="del" onClick={() => askDelete(m.id)}>Delete</button></div>
        )
      ) : null}
      <div className="ann-card-top">
        <div className="ann-card-author">{m.author || "Director"}{dirBadge ? <span className="ann-role">Director</span> : null}</div>
        <div className="ann-card-meta">
          <span className="ann-card-time">{relTime(m.ts)}{m.edited ? " · edited" : ""}</span>
          {canEdit ? <button className="ann-kebab" onClick={() => setMsgMenu(m.id)}>⋮</button> : null}
        </div>
      </div>
      <div ref={bodyRef} className={"ann-card-body " + (exp ? "" : "clamp")}>{m.text}</div>
      {overflow ? <button className="msg-more" onClick={() => toggleExpanded(m.id)}>{exp ? "Show less" : "Show more"}</button> : null}
    </div>
  );
}

function ChannelDropdown({ accCh }) {
  const cur = accCh.filter((c) => c.id === FB.activeChannel)[0] || accCh[0];
  const otherUnread = accCh.some((c) => c.id !== FB.activeChannel && unreadCount(c.id) > 0);
  const open = !!FB.chanMenu;
  return (
    <div className={"ann-dd " + (open ? "open" : "")}>
      <button className="ann-dd-toggle" onClick={toggleChanMenu}>
        <span className="ann-dd-cur">{cur ? cur.label : "Select channel"}</span>
        {otherUnread && !open ? <span className="ann-dot ann-dd-curdot" /> : null}
        <span className="ann-dd-caret">▾</span>
      </button>
      {open ? (
        <div className="ann-dd-list">
          {accCh.map((c) => {
            const sel = c.id === FB.activeChannel;
            return (
              <button className={"ann-dd-item " + (sel ? "sel" : "")} key={c.id} onClick={() => setActiveChannel(c.id)}>
                <span className="ann-dd-item-label">{c.label}</span>
                {unreadCount(c.id) > 0 ? <span className="ann-dot" /> : null}
                {sel ? <span className="ann-dd-check">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Compose() {
  const chap = !FB.isDirector && !FB.isAdmin;
  const editing = FB.editing && FB.editing.channel === FB.activeChannel;
  const chLabel = CH_LABEL[FB.activeChannel] || "channel";
  const [draft, setDraft] = useState(editing ? FB.editing.text : getDraft(FB.activeChannel));
  const taRef = useRef(null);
  const [pop, setPop] = useState({ open: false, q: "", at: -1 });   // @-mention autocomplete
  useEffect(() => { setDraft(editing ? FB.editing.text : getDraft(FB.activeChannel)); }, [editing ? FB.editing.id : "", FB.activeChannel]);
  const closePop = () => setPop({ open: false, q: "", at: -1 });
  const onDraft = (v, el) => {
    setDraft(v); if (!editing) saveDraft(FB.activeChannel, v);
    const pos = el ? el.selectionStart : v.length;
    const mAt = v.slice(0, pos).match(/(^|\s)@([^\s@]*)$/);   // an @-token being typed at the cursor
    if (mAt) setPop({ open: true, q: mAt[2].toLowerCase(), at: pos - mAt[2].length - 1 });
    else closePop();
  };
  const choose = (tag) => {
    const el = taRef.current;
    const pos = el ? el.selectionStart : draft.length;
    const next = draft.slice(0, pop.at) + "@" + tag + " " + draft.slice(pos);
    setDraft(next); if (!editing) saveDraft(FB.activeChannel, next);
    closePop();
    setTimeout(() => { if (el) { el.focus(); const c = pop.at + tag.length + 2; el.setSelectionRange(c, c); } }, 0);
  };
  const allTags = ["everyone"].concat(CH_MENTIONS[FB.activeChannel] || []);
  const sugg = pop.open ? allTags.filter((t) => t.toLowerCase().indexOf(pop.q) > -1) : [];

  const send = () => { const ch = FB.activeChannel, wasEditing = editing; sendMessage(draft); setDraft(""); closePop(); if (!wasEditing) saveDraft(ch, ""); };
  const myName = FB.authorName || (FB.user && (FB.user.displayName || (FB.user.email ? FB.user.email.split("@")[0] : ""))) || "Chaperone";
  return (
    <div className="ann-compose">
      {editing ? <div className="ann-compose-editing"><span>Editing announcement</span><button onClick={cancelEdit}>Cancel</button></div> : null}
      <div className="ann-compose-label">{chap ? "Message " + chLabel : "New announcement"}</div>
      {chap ? <div className="ann-compose-who">Posting as <b>{myName}</b></div> : null}
      {pop.open && sugg.length ? (
        <div className="ann-mention-pop">
          <div className="ann-mention-pop-h">Mention to notify</div>
          {sugg.map((t) => (
            <button key={t} type="button" className="ann-mention-opt"
              onMouseDown={(e) => { e.preventDefault(); choose(t); }}>
              <span className={"ment " + mentionClass(t)}>@{t}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="ann-compose-row">
        <textarea ref={taRef} className="ann-compose-input" id="msgText" rows={1} maxLength={2000}
          placeholder={chap ? "Message " + chLabel + "…" : "Post an announcement to " + chLabel + "…"}
          value={draft}
          onChange={(e) => onDraft(e.target.value, e.target)}
          onKeyUp={(e) => onDraft(e.target.value, e.target)}
          onBlur={() => setTimeout(closePop, 150)} />
        <button className="ann-compose-btn" onClick={send}><Plane /><span>{editing ? "Save" : (chap ? "Send" : "Post")}</span></button>
      </div>
    </div>
  );
}

export default function Messages() {
  useFB();
  const accessible = FB.configured ? accessibleChannels() : [];
  const accessibleKey = accessible.join("|");

  useEffect(() => {
    if (!FB.configured) return;
    if (accessible.length && accessible.indexOf(FB.activeChannel) < 0) setActiveChannel(accessible[0]);
  }, [FB.configured, FB.activeChannel, accessibleKey]);

  const accCh = CHANNELS.filter((c) => accessible.indexOf(c.id) > -1);
  const isChapTab = (FB.activeChannel || "").slice(-5) === "-chap";
  const list = FB.activeChannel ? channelMessages(FB.activeChannel) : [];
  const label = CH_LABEL[FB.activeChannel] || "";

  let body;
  if (!FB.configured) {
    body = <div className="intro-note" style={{ margin: 0 }}>Announcements aren't set up yet.</div>;
  } else if (!accessible.length && !FB.isDirector) {
    body = <div className="empty">Pick your group in the <b>Group</b> tab to see your announcements — or sign in below as a director or chaperone.</div>;
  } else if (list.length) {
    body = list.map((m) => {
      const myName = FB.authorName || (FB.user && (FB.user.displayName || (FB.user.email ? FB.user.email.split("@")[0] : ""))) || "Chaperone";
      const mine = !FB.isDirector && isChapTab && (m.author || "") === myName && m.role !== "director";
      const canEdit = !m._local && (FB.isDirector || FB.isAdmin || mine);
      return <AnnCard key={m.id} m={m} isChapTab={isChapTab} canEdit={canEdit} />;
    });
  } else {
    body = (
      <div className="ann-empty">
        <div className="ann-empty-icon"><Bell /></div>
        <div className="ann-empty-title">No announcements yet</div>
        <div className="ann-empty-sub">Updates from your directors for {label} will show up right here.</div>
        <div className="ann-tips">
          <div className="ann-tip"><span className="ann-tip-dot" /><div>Turn on <b>notifications</b> in the Group tab so you never miss one.</div></div>
          <div className="ann-tip"><span className="ann-tip-dot" /><div>Your full day-by-day <b>schedule</b> and map links live in the Trip tab.</div></div>
          <div className="ann-tip"><span className="ann-tip-dot" /><div>Set your <b>flight group</b> and <b>bus number</b> in the Group tab.</div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-screen">
      <div className="ann-hero">
        <div className="ann-hero-icon"><Bell /></div>
        <div className="ann-hero-tx"><h1>Announcements</h1><div className="sub">Official tour communications &amp; updates</div></div>
      </div>
      {accCh.length > 1 ? <ChannelDropdown accCh={accCh} /> : null}
      {FB.configured && accessible.length && accCh.length <= 1 && FB.activeChannel
        ? <div className="ann-subhead"><div className="ann-subhead-title">{label}</div></div> : null}
      <div className="ann-body">{body}</div>
      {FB.configured && canPostHere() ? <Compose /> : null}
    </div>
  );
}
