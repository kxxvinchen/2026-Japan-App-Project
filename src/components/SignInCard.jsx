import React, { useState } from "react";
import { useFB } from "../lib/useFB.js";
import { FB, CH_LABEL, localName, signIn, signOut, setShowSignIn } from "../lib/firebase.js";

export default function SignInCard() {
  useFB();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  if (!FB.configured) return null;

  if (FB.isDirector) return (
    <div className="set-card"><h3>Director</h3>
      <div className="set-sub">Signed in as <b>{(FB.user && FB.user.email) || "director"}</b> — you can post to every channel.</div>
      <button className="btn ghost" onClick={signOut}>Sign out</button></div>
  );
  if (FB.isAdmin) return (
    <div className="set-card"><h3>Admin</h3>
      <div className="set-sub">Signed in as <b>{(FB.user && FB.user.email) || "admin"}</b> — you can post to every channel except the Directors chat.</div>
      <button className="btn ghost" onClick={signOut}>Sign out</button></div>
  );
  if (FB.chapChannels && FB.chapChannels.length) {
    const names = FB.chapChannels.map((id) => CH_LABEL[id] || id).join(", ");
    const nm = localName();
    return (
      <div className="set-card"><h3>Chaperone</h3>
        <div className="set-sub">Your channel{FB.chapChannels.length > 1 ? "s" : ""}: <b>{names}</b>.{nm ? <> Posting as <b>{nm}</b>.</> : " You'll set the name shown on your messages in the Announcements tab."}</div>
        <button className="btn ghost" onClick={signOut}>Sign out</button></div>
    );
  }
  if (FB.user) return (
    <div className="set-card"><h3>Account</h3>
      <div className="set-sub">Signed in as <b>{(FB.user && FB.user.email) || ""}</b>.</div>
      <button className="btn ghost" onClick={signOut}>Sign out</button></div>
  );
  if (FB.showSignIn) return (
    <div className="set-card"><h3>Sign in</h3>
      {FB.error ? <div className="msg-status err" style={{ margin: "0 0 8px" }}>{FB.error}</div> : null}
      <label className="form-label">Username or email</label>
      <input className="form-in" type="text" autoCapitalize="none" autoCorrect="off" placeholder="your username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="form-label">Password</label>
      <div className="pw-wrap">
        <input className="form-in" type={show ? "text" : "password"} placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-label="Show password">{show ? "🙈" : "👁"}</button>
      </div>
      <button className="btn" disabled={FB.signinBusy} onClick={() => signIn(email, pwd)}>{FB.signinBusy ? "Signing in…" : "Sign in"}</button>
      <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => { setShowSignIn(false); setEmail(""); setPwd(""); }}>Cancel</button>
    </div>
  );
  return (
    <div className="set-card"><h3>Directors &amp; chaperones</h3>
      <div className="set-sub">Sign in to access your channels.</div>
      <button className="btn" onClick={() => setShowSignIn(true)}>Sign in</button></div>
  );
}
