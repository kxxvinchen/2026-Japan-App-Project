import React from "react";
import { useStore } from "../store.jsx";

const ANNOTATIONS_URL = "https://drive.google.com/drive/folders/1f9QnJLZlIRx2r8kU1B-ropVODKdlnIW6?usp=sharing";

// Orchestra members managing the extra parts for each piece.
const MANAGERS = [
  { piece: "Hoe Down", name: "Michelle" },
  { piece: "Appalachian Spring", name: "Henry" },
  { piece: "Brahms 4 Hand Concerto", name: "Aryan" },
  { piece: "Come Sunday", name: "Maahi" },
  { piece: "Galaxy Express", name: "Andrew" },
  { piece: "Takarajima", name: "Alicia" },
];

const AV_COLORS = ["#2563eb", "#15803d", "#9333ea", "#db2777", "#ea580c", "#0891b2"];

const Note = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

export default function OrchestraResources() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "utilities" })}>‹</button>
          <div className="htxt"><h1>Orchestra Resources</h1><div className="sub">Annotations &amp; extra-part managers</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="sec-title">Principal annotations</div>
        <a className="hb-card" href={ANNOTATIONS_URL} target="_blank" rel="noopener noreferrer">
          <div className="hb-ic"><Note /></div>
          <div className="hb-tx">
            <div className="t">Principal Annotations</div>
            <div className="s">Bowings &amp; markings from the principals — Google Drive</div>
          </div>
          <span className="hb-open">Open ›</span>
        </a>
        <div style={{ fontSize: 12, color: "var(--muted)", margin: "-6px 4px 4px" }}>Accessible with your school email account.</div>

        <div className="sec-title">Extra parts — managers</div>
        <div className="card orch-list">
          {MANAGERS.map((m, i) => (
            <div className="orch-row" key={m.piece}>
              <div className="orch-av" style={{ background: AV_COLORS[i % AV_COLORS.length] }}>{m.name.charAt(0)}</div>
              <div className="orch-piece">{m.piece}</div>
              <div className="orch-name">{m.name}</div>
            </div>
          ))}
        </div>
        <div className="intro-note" style={{ marginBottom: 0 }}>Need an extra part? Reach out to the manager listed for that piece.</div>
      </div>
    </div>
  );
}
