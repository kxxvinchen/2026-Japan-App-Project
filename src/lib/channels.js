/* Announcement channels. Dropdown order: Performers, Chaperones, Directors, Shadow, Flights.
   Channels a user isn't part of stay hidden (see accessibleChannels). */
export const CHANNELS = [
  { id: "performers", label: "Performers", short: "Performers", cat: "Announcements" },
  { id: "chaperones", label: "Chaperones", short: "Chaperones", cat: "Announcements", chap: true },
  { id: "directors",  label: "Directors",  short: "Directors",  cat: "Announcements", dir: true },
  { id: "shadow",     label: "Shadow",      short: "Shadow",     cat: "Announcements" },
  { id: "flights",    label: "Flights",     short: "Flights",    cat: "Announcements", flights: true },
];
export const CH_LABEL = {};
CHANNELS.forEach((c) => { CH_LABEL[c.id] = c.label; });

export const FLIGHT_IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

/* @-mention tags offered in each channel (besides @everyone, which every channel has).
   Group tags ping only that group; flight tags ping only that flight. */
export const CH_MENTIONS = {
  performers: ["swe", "sso", "choir"],
  chaperones: ["swe-chaperones", "sso-chaperones", "choir-chaperones"],
  shadow:     ["swe-shadow", "sso-shadow", "choir-shadow"],
  directors:  [],
  flights:    FLIGHT_IDS.map((f) => "Flight " + f),
};

/* A user's app group → the mention tags they belong to (for notification targeting).
   sband = shadow Band & Orchestra, so it answers to both @swe and @sso. */
export const GROUP_TAGS = { band: ["swe"], orch: ["sso"], choir: ["choir"], sband: ["swe", "sso"], schoir: ["choir"] };
