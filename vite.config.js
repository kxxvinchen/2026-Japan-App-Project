import { defineConfig } from "vite";

// Relative base so the built files work from the Firebase Hosting root and from
// file:// contexts (native wrappers). Static assets in public/ (sw.js, manifest,
// icons) are copied to dist/ verbatim. Build output goes to dist/, which Firebase
// Hosting serves (see firebase.json "public": "dist").
export default defineConfig({
  base: "./",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2018",
  },
});
