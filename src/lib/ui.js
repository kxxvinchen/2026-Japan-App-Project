export const mapsUrl = (q) =>
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q || "");
