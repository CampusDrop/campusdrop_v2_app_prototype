import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const projectRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");
  const kakaoMapsAppKey =
    process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ??
    env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ??
    "";

  return {
    root: fileURLToPath(new URL("./github-pages", import.meta.url)),
    base: "/campusdrop_v2_app_prototype/",
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    define: {
      "process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY": JSON.stringify(kakaoMapsAppKey),
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": projectRoot,
        "next/navigation": fileURLToPath(new URL("./components/prototype/pagesNavigation.ts", import.meta.url)),
      },
    },
    build: {
      outDir: fileURLToPath(new URL("./gh-pages", import.meta.url)),
      emptyOutDir: true,
    },
  };
});
