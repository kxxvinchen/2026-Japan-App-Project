import { parseSingleTime } from "./schedule.js";

export function fmt12(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
  if (!m) return hhmm || "";
  let h = +m[1]; const mm = m[2]; const ap = h < 12 ? "AM" : "PM"; let h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ":" + mm + " " + ap;
}
// Convert every 24-hour "HH:MM" inside a free-text string to 12-hour with AM/PM.
// Times that already carry an am/pm suffix (e.g. "9:00am", "1:15pm") are left alone,
// and anything without an HH:MM time (phone numbers, addresses, "1F", "Nozomi 9") is untouched.
export function timesToAmPm(str) {
  return String(str == null ? "" : str).replace(/\b(\d{1,2}):(\d{2})\b(?!\s*[ap]\.?m\.?)/gi, (full, h, mm) => {
    h = +h;
    if (h > 23 || +mm > 59) return full;
    const ap = h < 12 ? "AM" : "PM";
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ":" + mm + " " + ap;
  });
}
export function blockFor(hhmm) { const h = +String(hhmm).split(":")[0]; return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; }
export function toMin(hhmm) { const pp = String(hhmm).split(":"); return (+pp[0]) * 60 + (+pp[1]); }

/* busy windows from the user's important items (perf/rehearsal/exchange/travel/party) */
function busyWindows(items) {
  const out = []; const imp = ["performance", "rehearsal", "exchange", "travel", "party"];
  items.forEach((it) => {
    if (it._custom || imp.indexOf(it.type) < 0) return;
    const txt = (it.desc || "") + "  " + (it.hr || "");
    const re = /(\d{1,2}):(\d{2})\s*[–—\-→]\s*(\d{1,2}):(\d{2})/g;
    let m, found = false;
    while ((m = re.exec(txt))) {
      const a = (+m[1]) * 60 + (+m[2]), b = (+m[3]) * 60 + (+m[4]);
      if (b > a) { found = true; out.push({ s: a, e: b, label: it.title }); }
    }
    if (!found) { const t = parseSingleTime(it.hr); if (t != null) out.push({ s: t, e: t + 90, label: it.title }); }
  });
  return out;
}

/* returns the clashing window, or null. `items` = the day's visible items for the user */
export function activityConflict(items, hhmm) {
  const t = toMin(hhmm);
  for (const x of busyWindows(items)) { if (t >= x.s && t < x.e) return x; }
  return null;
}
