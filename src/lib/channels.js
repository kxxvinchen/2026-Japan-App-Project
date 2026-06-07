/* Announcement channels. Dropdown order: Performers, Percussion, Chaperones, Directors, Shadow, Flights.
   Channels a user isn't part of stay hidden (see accessibleChannels).
   Percussion is a closed channel — only directors and percussion members can see it. */
export const CHANNELS = [
  { id: "performers", label: "Performers", short: "Performers", cat: "Announcements" },
  { id: "percussion", label: "Percussion", short: "Percussion", cat: "Announcements" },
  { id: "chaperones", label: "Chaperones", short: "Chaperones", cat: "Announcements", chap: true },
  { id: "directors",  label: "Directors",  short: "Directors",  cat: "Announcements", dir: true },
  { id: "shadow",     label: "Shadow",      short: "Shadow",     cat: "Announcements" },
  { id: "flights",    label: "Flights / Buses", short: "Flights / Buses", cat: "Announcements", flights: true },
];
export const CH_LABEL = {};
CHANNELS.forEach((c) => { CH_LABEL[c.id] = c.label; });

export const FLIGHT_IDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
// Touring coaches (see BUSES in data.js). Each traveler picks theirs in the Group tab,
// and that choice is what @Bus N targets.
export const BUS_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/* @-mention tags offered in each channel (besides @everyone, which every channel has).
   Group tags ping only that group; flight/bus tags ping only that flight/bus. */
export const CH_MENTIONS = {
  performers: ["swe", "sso", "choir", "perc"],
  percussion: ["perc"],
  chaperones: ["swe-chaperones", "sso-chaperones", "choir-chaperones"],
  shadow:     ["swe-shadow", "sso-shadow", "choir-shadow"],
  directors:  [],
  flights:    FLIGHT_IDS.map((f) => "Flight " + f).concat(BUS_IDS.map((b) => "Bus " + b)),
};

/* A user's app group → the mention tags they belong to (for notification targeting).
   sband = shadow Band & Orchestra, so it answers to both @swe and @sso.
   perc (Percussion) is part of the wind ensemble, so it answers to @swe and to @perc. */
export const GROUP_TAGS = { band: ["swe"], orch: ["sso"], choir: ["choir"], sband: ["swe", "sso"], schoir: ["choir"], perc: ["swe", "perc"] };
