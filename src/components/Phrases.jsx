import React, { useState } from "react";
import { useStore } from "../store.jsx";
import { PHRASES } from "../phrases.js";
import { speakJa } from "../lib/audio.js";

const Spk = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a9 9 0 0 1 0 14" />
  </svg>
);
const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Phrases() {
  const { dispatch } = useStore();
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();
  const match = (p) => !ql || (p.en + " " + p.ja + " " + p.ro).toLowerCase().includes(ql);
  const groups = PHRASES.map((g) => ({ cat: g.cat, items: g.items.filter(match) })).filter((g) => g.items.length);
  return (
    <div className="screen">
      <div className="hdr">
        <div className="hdr-row">
          <button className="back" onClick={() => dispatch({ type: "nav", screen: "utilities" })}>‹</button>
          <div className="htxt"><h1>Translation Guide</h1><div className="sub">Common phrases · tap to hear it</div></div>
        </div>
      </div>
      <div className="wrap">
        <div className="ph-search">
          <Search />
          <input type="search" autoCapitalize="none" autoCorrect="off" spellCheck="false"
            placeholder="Search phrases (English, romaji…)" value={q} onChange={(e) => setQ(e.target.value)} />
          {q ? <button className="ph-search-x" aria-label="Clear" onClick={() => setQ("")}>×</button> : null}
        </div>
        <div className="intro-note" style={{ marginTop: 0 }}>
          Point to the Japanese, read the romaji, and confirm with gestures or a map. Tip: the は in these phrases is said <b>“wa”</b> (not “ha”) — it marks the topic. And remember <b>和 (wa)</b>, harmony: keep your voice low on trains and in public, and look out for the group.
        </div>
        {groups.map((g, gi) => (
          <div className="ph-group" key={gi}>
            <div className="ph-cat">{g.cat}</div>
            {g.items.map((p, ii) => (
              <div className="ph-row" key={ii}>
                <div className="ph-txt">
                  <div className="ph-en">{p.en}</div>
                  <div className="ph-ja">{p.ja}</div>
                  <div className="ph-ro">{p.ro}</div>
                </div>
                <button className="ph-audio" aria-label="Play pronunciation" onClick={() => speakJa(p.ja)}><Spk /></button>
              </div>
            ))}
          </div>
        ))}
        {groups.length === 0 ? <div className="ph-noresult">No phrases match your search.</div> : null}
      </div>
    </div>
  );
}
