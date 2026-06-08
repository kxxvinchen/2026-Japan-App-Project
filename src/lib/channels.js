/* Announcement channels. Dropdown order: Performers, Percussion, Chaperones, Directors, Shadow, Flights.
   Channels a user isn't part of stay hidden (see accessibleChannels).
   Percussion is a closed channel — only directors and percussion members can see it. */
export const CHANNELS = [
  { id: "performers", label: "Performers", short: "Performers", cat: "Announcements" },
  { id: "percussion", label: "Percussion", short: "Percussion", cat: "Announcements" },
  { id: "chaperones", label: "Chaperones", short: "Chaperones", cat: "Announcements", chap: true },
  { id: "directors",  label: "Directors",  short: "Directors",  cat: "Announcements", dir: true },
  { id: "shadow",     label: "Shadow",      short: "Shadow",     cat: "Announcements" },
  { id: "flights",    label: "Flights",     short: "Flights",    cat: "Announcements", flights: true },
  { id: "test",       label: "Test",        short: "Test",       cat: "Announcements" },
];
export const CH_LABEL = {};
CHANNELS.forEach((c) => { CH_LABEL[c.id] = c.label; });

export const FLIGHT_IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

/* @-mention tags offered in each channel (besides @everyone, which every channel has).
   Group tags ping only that group; flight tags ping only that flight. */
export const CH_MENTIONS = {
  performers: ["swe", "sso", "choir", "perc"],
  percussion: ["perc"],
  chaperones: ["swe", "sso", "choir"],
  shadow:     ["swe-shadow", "sso-shadow", "choir-shadow"],
  directors:  [],
  flights:    FLIGHT_IDS.map((f) => "Flight " + f),
  test:       ["swe", "sso", "choir", "perc", "swe-shadow", "sso-shadow", "choir-shadow"].concat(FLIGHT_IDS.map((f) => "Flight " + f)),
};

/* A user's app group → the mention tags they belong to (for notification targeting).
   sband = shadow Band & Orchestra, so it answers to both @swe and @sso.
   perc (Percussion) is part of the wind ensemble, so it answers to @swe and to @perc. */
export const GROUP_TAGS = { band: ["swe"], orch: ["sso"], choir: ["choir"], sband: ["swe", "sso"], schoir: ["choir"], perc: ["swe", "perc"] };

export const MENTION_RE = /@(everyone|swe-shadow|sso-shadow|choir-shadow|swe|sso|choir|perc|Flight\s+[A-I])\b/gi;

// color class for an @-mention tag — swe/sso/choir each own a color (shared across
// performers/chaperones/shadow via the suffix), flights share one, @everyone its own.
export function mentionClass(tag) {
  const t = String(tag).toLowerCase();
  if (t === "everyone") return "m-everyone";
  if (t.indexOf("swe") === 0) return "m-swe";
  if (t.indexOf("sso") === 0) return "m-sso";
  if (t.indexOf("choir") === 0) return "m-choir";
  if (t.indexOf("perc") === 0) return "m-perc";
  if (t.indexOf("flight") === 0) return "m-flight";
  return "m-everyone";
}
