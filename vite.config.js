import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works from the Firebase Hosting root and file:// contexts.
// Static assets in public/ (sw.js, manifest, icons) are copied to dist/ verbatim.
export default defineConfig({
  base: "./",
  plugins: [react()],
  publicDir: "public",
  build: { outDir: "dist", emptyOutDir: true, target: "es2018" },
});
