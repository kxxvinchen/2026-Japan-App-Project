#!/usr/bin/env node
/* Build the single-file app from src/ pieces.
 *
 *   node build.mjs
 *
 * It stitches src/styles.css + src/data.js + src/logic.js into the
 * src/index.template.html shell, writes the three deployed copies, and
 * syncs the service-worker cache name to the APP_VERSION in src/logic.js.
 *
 * Edit the SOURCE files in src/ — never the generated .html files directly.
 *   - src/styles.css   → all CSS
 *   - src/data.js      → itinerary / flights / buses / groups / emergency data
 *   - src/logic.js     → Firebase, state, rendering, events (APP_VERSION lives here)
 *   - src/index.template.html → the HTML shell (head, meta tags, body)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const R = (p) => readFileSync(join(root, p), "utf8");

const template = R("src/index.template.html");
const css      = R("src/styles.css");
const data     = R("src/data.js");
const logic    = R("src/logic.js");

const app = data + logic;
// function replacements so literal $ in the source isn't treated as a pattern
const html = template
  .replace("/*__STYLES__*/", () => css)
  .replace("/*__APP__*/", () => app);

// keep the service-worker cache name in lockstep with APP_VERSION (defined in src/data.js)
const ver = (app.match(/APP_VERSION="(v\d+)"/) || [])[1];

const targets = [
  "JapanTour2026_TravelCompanion.html",
  "public/index.html",
  "JapanTour2026-iOS/JapanTour2026/index.html",
];
for (const t of targets) writeFileSync(join(root, t), html);

if (ver) {
  const swPath = join(root, "public/sw.js");
  const sw = R("public/sw.js").replace(/const CACHE = "jt-v\d+";/, `const CACHE = "jt-${ver}";`);
  writeFileSync(swPath, sw);
}

console.log(`Built ${ver || "(version?)"} → ${targets.length} HTML copies + sw.js cache synced`);
