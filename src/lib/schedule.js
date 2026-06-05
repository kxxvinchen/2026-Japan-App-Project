export const TYPE_LABEL = {
  performance: "Performance", rehearsal: "Rehearsal", exchange: "Exchange",
  sightseeing: "Sightseeing", meal: "Meal", travel: "Travel", hotel: "Hotel",
  free: "Free time", party: "Party", other: "Logistics",
};

const BLOCK_ORDER = ["Pre-departure", "Departure", "Overnight", "Daytime",
  "Arrival", "Morning", "Late morning", "Afternoon", "Evening"];

export function parseSingleTime(hr) {
  if (!hr) return null;
  let m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(hr);
  if (m) { let h = (+m[1]) % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + (+m[2]); }
  m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(hr);
  if (m) return (+m[1]) * 60 + (+m[2]);
  return null;
}

/* chronological order within a block; untimed items keep their authored slot */
export function sortByTime(arr) {
  let prev = -1;
  arr.forEach((it) => { const t = parseSingleTime(it.hr); if (t != null) { prev = t; it._sortT = t; } else { it._sortT = prev; } });
  return arr.map((it, i) => [it, i]).sort((a, b) => (a[0]._sortT - b[0]._sortT) || (a[1] - b[1])).map((x) => x[0]);
}

/* group a day's visible items into ordered time blocks */
export function timeBlocks(items) {
  const blocks = {};
  items.forEach((it) => { (blocks[it.t] = blocks[it.t] || []).push(it); });
  return Object.keys(blocks)
    .sort((a, b) => {
      let ia = BLOCK_ORDER.indexOf(a), ib = BLOCK_ORDER.indexOf(b);
      if (ia < 0) ia = 99; if (ib < 0) ib = 99; return ia - ib;
    })
    .map((bk) => ({ name: bk, items: sortByTime(blocks[bk]) }));
}
