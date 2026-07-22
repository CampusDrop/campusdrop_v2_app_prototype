import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL("./pages", import.meta.url)),
  base: "/campusdrop_v2_app_prototype/",
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "next/navigation": fileURLToPath(new URL("./components/prototype/pagesNavigation.ts", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./gh-pages", import.meta.url)),
    emptyOutDir: true,
  },
});
