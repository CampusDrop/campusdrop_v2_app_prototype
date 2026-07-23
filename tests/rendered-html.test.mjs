import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the CampusDrop application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>CampusDrop — 캠퍼스가 게임판이 됩니다<\/title>/i);
  assert.match(html, /class="prototype-stage"/);
  assert.match(html, /입장 조건을 확인하는 중/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the production app and client-only state wiring in place", async () => {
  const [page, layout, provider, profile] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/prototype/DemoProvider.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/prototype/screens/ProfileSetupScreens.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<PrototypeApp \/>/);
  assert.match(layout, /CampusDrop — 캠퍼스가 게임판이 됩니다/);
  assert.match(provider, /useSyncExternalStore/);
  assert.match(provider, /window\.localStorage\.setItem/);
  assert.doesNotMatch(provider, /useEffect/);
  assert.match(profile, /from "next\/image"/);
  assert.match(profile, /<Image[^>]*unoptimized/);
  assert.deepEqual(await readdir(previewRoot), []);
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});

test("wires the daily artifact hunt without revealing its ending condition", async () => {
  const [router, artifacts, dailyScreens, kakaoMap, resultScreen] = await Promise.all([
    readFile(new URL("../components/prototype/PrototypeRouter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/prototype/artifacts.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/prototype/screens/DailyArtifactScreens.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/prototype/KakaoExpeditionMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/prototype/screens/ResultRewardScreens.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(router, /path === "\/daily"/);
  assert.match(router, /path === "\/daily\/hunt"/);
  assert.match(router, /path === "\/daily\/quiz"/);
  assert.match(router, /path === "\/daily\/result"/);
  assert.match(router, /path === "\/expeditions"\) screen = <DailyArtifactHomeScreen/);
  assert.match(router, /path === "\/expeditions\/teams"\) screen = <ExpeditionListScreen/);
  assert.equal((artifacts.match(/rarity: "(?:일반|고급|희귀|영웅|전설)"/g) ?? []).length, 15);
  assert.equal((artifacts.match(/monthLabel: "[567]월"/g) ?? []).length, 3);
  assert.match(artifacts, /DAILY_CHEST_LIMIT = 3/);
  assert.match(artifacts, /RESTORATION_ARTIFACT_DROP_RATE = 0\.06/);
  assert.match(artifacts, /ownsEveryRegularArtifact \|\| canRollRestorationArtifact/);
  assert.match(dailyScreens, /오늘의 상자/);
  assert.match(dailyScreens, /보물상자는 더 이상 출현하지 않습니다/);
  assert.doesNotMatch(dailyScreens, /엔딩|ending/i);
  assert.match(kakaoMap, /NEXT_PUBLIC_KAKAO_MAP_APP_KEY/);
  assert.match(kakaoMap, /dapi\.kakao\.com\/v2\/maps\/sdk\.js/);
  assert.match(kakaoMap, /navigator\.geolocation\.getCurrentPosition/);
  assert.match(resultScreen, /state\.mainThemeRuns >= 2 && hasRestorationArtifact/);
  assert.match(resultScreen, /열리지 않았던 문/);
});
