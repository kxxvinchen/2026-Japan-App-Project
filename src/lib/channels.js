/* Announcement channels (dropdown/order: travelers, chaperones, directors, shadow) */
export const CHANNELS = [
  { id: "swesso", label: "SWE/SSO", short: "SWE/SSO", cat: "Travelers" },
  { id: "choir", label: "Choir", short: "Choir", cat: "Travelers" },
  { id: "swesso-chap", label: "SWE/SSO Chaperones", short: "SWE/SSO Chaperones", cat: "Chaperones", chap: true },
  { id: "choir-chap", label: "Choir Chaperones", short: "Choir Chaperones", cat: "Chaperones", chap: true },
  { id: "directors", label: "Directors", short: "Directors", cat: "Directors", dir: true },
  { id: "swesso-shadow", label: "SWE/SSO Shadow", short: "SWE/SSO Shad.", cat: "Travelers" },
  { id: "choir-shadow", label: "Choir Shadow", short: "Choir Shad.", cat: "Travelers" },
];
export const CH_LABEL = {};
CHANNELS.forEach((c) => { CH_LABEL[c.id] = c.label; });
