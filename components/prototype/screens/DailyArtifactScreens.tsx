"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { currentMonthlyTheme, getKoreanDateKey, getTodayArtifact, hiddenArtifacts } from "@/lib/prototype/artifacts";
import { themes } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { Tag } from "../ui";

const rarityTone: Record<string, string> = {
  일반: "common",
  고급: "uncommon",
  희귀: "rare",
  영웅: "epic",
  전설: "legendary",
};

export function DailyArtifactHomeScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const todayKey = getKoreanDateKey();
  const completedToday = state.dailyCompletedDate === todayKey;
  const monthlyTheme = themes.find((theme) => theme.id === currentMonthlyTheme.themeId) ?? themes[0];
  const owned = hiddenArtifacts.filter((artifact) => state.artifactIds.includes(artifact.id));

  return (
    <div className="screen daily-screen">
      <section className="daily-hero">
        <div>
          <p className="eyebrow">DAILY DISCOVERY</p>
          <Tag tone="mint">{completedToday ? "오늘 탐사 완료" : "오늘 자정까지"}</Tag>
          <h1>캠퍼스 어딘가에<br />새로운 흔적이 나타났어요</h1>
          <p>하루에 한 번, 위치를 찾아 현장 퀴즈를 풀어 보세요.</p>
        </div>
        <div className="daily-orbit" aria-hidden="true"><i /><span>?</span><i /></div>
      </section>

      <section className="daily-route-card">
        <div><span>⌖</span><p><small>오늘의 탐사 구역</small><b>세종대학교 캠퍼스 · 약 8분</b></p></div>
        <div><span>▣</span><p><small>획득 기록</small><b>{owned.length} / {hiddenArtifacts.length}종 발견</b></p></div>
        <button className="primary" onClick={() => router.push(completedToday ? "/daily/result" : "/daily/hunt")}>
          {completedToday ? "오늘 발견한 유물 보기" : "오늘의 흔적 추적하기"}
        </button>
      </section>

      <section className="content-section artifact-preview">
        <div className="section-title">
          <div><p className="eyebrow">MONTHLY ARCHIVE</p><h2>{currentMonthlyTheme.label} · 숨은 유물</h2></div>
          <button onClick={() => router.push("/my/artifacts")}>전체 보기</button>
        </div>
        <p className="artifact-theme-name">{monthlyTheme.emoji} {monthlyTheme.title}</p>
        <div className="artifact-silhouettes">
          {hiddenArtifacts.map((artifact) => {
            const found = state.artifactIds.includes(artifact.id);
            return <div key={artifact.id} data-found={found}><span>{found ? artifact.emoji : "?"}</span><small>{found ? artifact.rarity : "미발견"}</small></div>;
          })}
        </div>
      </section>

      <div className="daily-rule"><b>매일 00:00에 새로운 탐사가 열려요</b><p>오늘 놓쳐도 괜찮아요. 내일은 또 다른 위치에서 시작됩니다.</p></div>
    </div>
  );
}

export function DailyArtifactHuntScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [status, setStatus] = useState<"idle" | "checking" | "near" | "arrived">("idle");
  const completedToday = state.dailyCompletedDate === getKoreanDateKey();

  if (completedToday) {
    return <div className="center-screen"><b className="daily-complete-mark">✓</b><h1>오늘의 탐사를<br />이미 마쳤어요</h1><p>내일 새로운 흔적이 나타납니다.</p><button className="primary" onClick={() => router.replace("/daily/result")}>발견 기록 보기</button></div>;
  }

  function locate() {
    setStatus("checking");
    window.setTimeout(() => setStatus("near"), 900);
  }

  return (
    <div className="daily-hunt">
      <div className="daily-map">
        <div className="map-grid" />
        <i className="search-ring" data-arrived={status === "arrived"} />
        <span className="explorer-pin">D</span>
        <span className="mystery-pin">?</span>
      </div>
      <section className="daily-hunt-panel">
        <p className="mission-kicker">TODAY&apos;S TRACE</p>
        <h1>{status === "arrived" ? "숨겨진 보관함을 찾았어요!" : "종소리가 가장 먼저 닿는 곳을 찾아가세요"}</h1>
        <p>{status === "arrived" ? "현장에 도착했습니다. 보관함의 마지막 잠금을 풀어 주세요." : status === "near" ? "흔적이 가까워졌어요. 약 35m 안쪽을 살펴보세요." : "정확한 장소는 도착한 뒤 공개됩니다."}</p>
        <div className="signal-meter"><i data-active={status !== "idle"} /><i data-active={status === "near" || status === "arrived"} /><i data-active={status === "arrived"} /><small>{status === "arrived" ? "도착" : status === "near" ? "강한 신호" : "신호 탐색 중"}</small></div>
        {status === "near" && <button className="secondary full-button" onClick={() => setStatus("arrived")}>시연 · 보관함 앞에 도착</button>}
        {status === "arrived"
          ? <button className="primary full-button" onClick={() => router.push("/daily/quiz")}>현장 퀴즈 풀기</button>
          : <button className="primary full-button" disabled={status === "checking"} onClick={locate}>{status === "checking" ? "현재 위치를 확인하는 중…" : "현재 위치 확인"}</button>}
      </section>
    </div>
  );
}

export function DailyArtifactQuizScreen() {
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const artifact = getTodayArtifact();
  const completedToday = state.dailyCompletedDate === getKoreanDateKey();
  const choices = ["종", "열쇠", "책", "나침반"];

  function submit() {
    if (answer !== "열쇠") {
      setWrong(true);
      return;
    }
    const firstDiscovery = !state.artifactIds.includes(artifact.id);
    update({
      artifactIds: [...new Set([...state.artifactIds, artifact.id])],
      dailyCompletedDate: getKoreanDateKey(),
      dailyStreak: state.dailyStreak + 1,
      xp: Math.min(1600, state.xp + (firstDiscovery ? 60 : 20)),
    });
    notify(firstDiscovery ? "새로운 숨은 유물을 발견했어요" : "오늘의 탐사를 완료했어요");
    router.replace("/daily/result");
  }

  if (completedToday) {
    return <div className="center-screen"><b className="daily-complete-mark">✓</b><h1>오늘의 보관함은<br />이미 열렸어요</h1><button className="primary" onClick={() => router.replace("/daily/result")}>발견 기록 보기</button></div>;
  }

  return (
    <section className="daily-quiz">
      <div className="locked-chest" data-wrong={wrong}><i /><span>▣</span></div>
      <p className="mission-kicker">FIELD QUIZ</p>
      <h1>기록 속 빈칸에<br />들어갈 물건은?</h1>
      <blockquote>“집무실의 문은 잠겨 있었지만,<br />사라진 것은 문이 아니라 _____였다.”</blockquote>
      <div className="quiz-choice-grid">
        {choices.map((choice) => <button key={choice} data-selected={answer === choice} onClick={() => { setAnswer(choice); setWrong(false); }}>{choice}</button>)}
      </div>
      {wrong && <p className="wrong-message">보관함이 열리지 않아요. 기록을 다시 읽어 보세요.</p>}
      <button className="primary full-button" disabled={!answer} onClick={submit}>보관함 열기</button>
    </section>
  );
}

export function DailyArtifactResultScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const artifact = getTodayArtifact();
  const completedToday = state.dailyCompletedDate === getKoreanDateKey();

  if (!completedToday) {
    return <div className="center-screen"><span className="empty-icon">?</span><h1>아직 오늘의 유물을<br />찾지 못했어요</h1><button className="primary" onClick={() => router.replace("/daily")}>오늘의 탐사 시작</button></div>;
  }

  return (
    <div className="artifact-result">
      <div className="artifact-rays" aria-hidden="true" />
      <p className="eyebrow">NEW DISCOVERY</p>
      <div className={`artifact-emblem ${rarityTone[artifact.rarity]}`}><span>{artifact.emoji}</span></div>
      <Tag tone="brand">{artifact.rarity} 유물</Tag>
      <h1>{artifact.name}</h1>
      <p>{artifact.lore}</p>
      <div className="artifact-result-meta"><span>오늘의 탐사 완료</span><b>＋60 XP</b></div>
      <div className="result-actions">
        <button className="primary" onClick={() => router.push("/my/artifacts")}>유물 도감에 보관하기</button>
        <button className="secondary" onClick={() => router.push("/themes/missing-key")}>이번 달 테마 둘러보기</button>
        <button className="text-button" onClick={() => router.push("/home")}>홈으로</button>
      </div>
    </div>
  );
}

export function ArtifactCollectionScreen() {
  const { state } = useDemo();
  const monthlyTheme = themes.find((theme) => theme.id === currentMonthlyTheme.themeId) ?? themes[0];
  const ownedCount = hiddenArtifacts.filter((artifact) => state.artifactIds.includes(artifact.id)).length;

  return (
    <div className="screen artifact-collection">
      <section className="collection-head"><p className="eyebrow">HIDDEN ARCHIVE</p><h1>숨은 유물 도감</h1><p>{monthlyTheme.emoji} {monthlyTheme.title}</p><strong>{ownedCount} / {hiddenArtifacts.length}</strong></section>
      <div className="artifact-grid">
        {hiddenArtifacts.map((artifact) => {
          const found = state.artifactIds.includes(artifact.id);
          return <article key={artifact.id} data-found={found} className={found ? rarityTone[artifact.rarity] : ""}><span>{found ? artifact.emoji : "?"}</span><Tag>{found ? artifact.rarity : "미발견"}</Tag><h2>{found ? artifact.name : "알 수 없는 유물"}</h2><p>{found ? artifact.lore : "데일리 탐사에서 단서를 따라가면 발견할 수 있어요."}</p></article>;
        })}
      </div>
      <div className="daily-rule"><b>유물은 테마가 바뀌면 새롭게 구성돼요</b><p>이번 달 발견 기록은 도감에 계속 보관됩니다.</p></div>
    </div>
  );
}
