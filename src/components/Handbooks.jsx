import React from "react";
import { useStore } from "../store.jsx";

const BOOKS = [
  {
    id: "student",
    title: "Performers & Chaperones",
    sub: "Saratoga HS 2026 Japan Handbook — students, performers and chaperones",
    url: "https://www.dropbox.com/scl/fi/mp1hb1s1em2va89vzucs9/Saratoga-HS-2026-Japan-Handbook-STUDENT.pdf?rlkey=4y843ktblkf3137f16r53bjyl&e=4&dl=0",
  },
  {
    id: "shadow",
    title: "Shadow Tour",
    sub: "Saratoga HS 2026 Japan Handbook — Shadow Tour families",
    url: "https://www.dropbox.com/scl/fi/qc5lfoox01kptuxdhuvyr/Saratoga-HS-2026-Japan-Handbook-SHADOW.pdf?rlkey=q6naklrx6riu2g9x5fef1sgu8&e=4&dl=0",
  },
];

const Book = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export default function Handbooks() {
  const { dispatch } = useStore();
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "utilities" })}>‹</button>
          <div className="htxt"><h1>Handbooks</h1><div className="sub">Official trip handbooks · PDF</div></div>
        </div>
      </div>
      <div className="wrap">
        {BOOKS.map((b) => (
          <a className="hb-card" key={b.id} href={b.url} target="_blank" rel="noopener noreferrer">
            <div className="hb-ic"><Book /></div>
            <div className="hb-tx">
              <div className="t">{b.title}</div>
              <div className="s">{b.sub}</div>
            </div>
            <span className="hb-open">Open ›</span>
          </a>
        ))}
        <div className="intro-note" style={{ marginBottom: 0 }}>Opens the PDF in your browser. Once it's open you can save it to your device to read offline.</div>
      </div>
    </div>
  );
}
