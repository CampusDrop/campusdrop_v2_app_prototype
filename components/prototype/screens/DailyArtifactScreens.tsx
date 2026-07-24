"use client";

import { useCallback, useRef, useState, type UIEvent } from "react";
import { useRouter } from "next/navigation";
import {
  artifactCollections,
  currentMonthlyTheme,
  DAILY_CHEST_LIMIT,
  getDailyChestReward,
  getKoreanDateKey,
  hiddenArtifacts,
  restorationArtifact,
} from "@/lib/prototype/artifacts";
import { themes } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { KakaoExpeditionMap, type KakaoLocationStatus, type KakaoMapStatus } from "../KakaoExpeditionMap";
import { Modal, Tag } from "../ui";

const rarityTone: Record<string, string> = {
  일반: "common",
  고급: "uncommon",
  희귀: "rare",
  영웅: "epic",
  전설: "legendary",
};

const chestLocations = [
  { title: "종탑 남쪽 정원", time: "약 8분", clue: "종소리가 가장 먼저 닿는 곳" },
  { title: "학술정보원 돌계단", time: "약 11분", clue: "오래된 기록이 쌓이는 곳" },
  { title: "학생회관 게시판", time: "약 6분", clue: "사라진 공지가 남은 곳" },
];

function getTodayChestCount(state: ReturnType<typeof useDemo>["state"], todayKey = getKoreanDateKey()) {
  return state.dailyChestDate === todayKey ? Math.min(state.dailyChestCount, DAILY_CHEST_LIMIT) : 0;
}

export function DailyArtifactHomeScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [missionOpen, setMissionOpen] = useState(true);
  const [mapFocusRequest, setMapFocusRequest] = useState(0);
  const [mapStatus, setMapStatus] = useState<KakaoMapStatus>("loading");
  const [locationStatus, setLocationStatus] = useState<KakaoLocationStatus>("idle");
  const [mapPosition, setMapPosition] = useState({ lat: 37.5502, lng: 127.0738 });
  const todayKey = getKoreanDateKey();
  const chestCount = getTodayChestCount(state, todayKey);
  const completedToday = chestCount >= DAILY_CHEST_LIMIT;
  const monthlyTheme = themes.find((theme) => theme.id === currentMonthlyTheme.themeId) ?? themes[0];
  const owned = hiddenArtifacts.filter((artifact) => state.artifactIds.includes(artifact.id));
  const seasonComplete = owned.length === hiddenArtifacts.length;
  const displayDate = `${Number(todayKey.slice(5, 7))}월 ${Number(todayKey.slice(8, 10))}일`;
  const nextChest = chestLocations[chestCount] ?? chestLocations[DAILY_CHEST_LIMIT - 1];
  const openTreasureHunt = useCallback(() => router.push("/daily/hunt"), [router]);
  const updateMapStatus = useCallback((status: KakaoMapStatus) => setMapStatus(status), []);
  const updateLocationStatus = useCallback((status: KakaoLocationStatus) => setLocationStatus(status), []);
  const updateMapPosition = useCallback((position: { lat: number; lng: number }) => setMapPosition(position), []);

  return (
    <div className="expedition-map-screen" data-completed={completedToday} data-season-complete={seasonComplete}>
      <div
        className="expedition-map-canvas"
        data-map-ready={mapStatus === "ready"}
        data-mission-open={missionOpen}
        onPointerDown={(event) => {
          const target = event.target;
          if (
            missionOpen
            && target instanceof Element
            && target.closest(".kakao-map-layer, .campus-map-grid, .campus-map-contours, .campus-road, .campus-map-building, .campus-map-green")
          ) setMissionOpen(false);
        }}
      >
        <KakaoExpeditionMap
          chestCount={chestCount}
          completedToday={completedToday}
          focusRequest={mapFocusRequest}
          onLocationStatusChange={updateLocationStatus}
          onPositionChange={updateMapPosition}
          onStatusChange={updateMapStatus}
          onTreasureSelect={openTreasureHunt}
          showTreasures={!seasonComplete}
        />
        <div className="campus-map-grid" aria-hidden="true" />
        <div className="campus-map-contours" aria-hidden="true" />
        <i className="campus-road road-a" aria-hidden="true" />
        <i className="campus-road road-b" aria-hidden="true" />
        <i className="campus-road road-c" aria-hidden="true" />
        <span className="campus-map-building building-library" aria-hidden="true">학술정보원</span>
        <span className="campus-map-building building-hall" aria-hidden="true">학생회관</span>
        <span className="campus-map-building building-tower" aria-hidden="true">종탑</span>
        <span className="campus-map-green green-a" aria-hidden="true" />
        <span className="campus-map-green green-b" aria-hidden="true" />

        <header className="map-top-hud">
          <button className="map-season-chip" onClick={() => router.push("/my/artifacts")}>
            <span>{monthlyTheme.emoji}</span>
            <p><small>7월 탐사 시즌 · {displayDate}</small><b>{monthlyTheme.title}</b></p>
            <i>유물 {owned.length}/5</i>
          </button>
        </header>

        <div className="map-compass" aria-hidden="true"><b>N</b><i>▲</i><span>W　＋　E</span><small>S</small></div>
        <div className="map-coordinate-readout" data-location-status={locationStatus}>
          <span>{mapPosition.lat.toFixed(4)}° N　{mapPosition.lng.toFixed(4)}° E</span>
          <b><i /> {mapStatus !== "ready" ? "탐사 지도" : locationStatus === "ready" ? "GPS 연결됨" : locationStatus === "locating" ? "현재 위치 확인 중" : "위치 권한 필요"}</b>
        </div>

        {!seasonComplete && mapStatus !== "ready" && <div className="map-treasure-layer" aria-label="오늘 발견된 보물상자">
          <span className="map-route-dots route-one" aria-hidden="true" />
          <span className="map-route-dots route-two" aria-hidden="true" />
          {chestLocations.map((chest, index) => {
            const cleared = chestCount > index;
            const active = chestCount === index && !completedToday;
            return <button
              key={chest.title}
              className={`map-treasure-marker treasure-marker-${index + 1}`}
              data-cleared={cleared}
              data-active={active}
              disabled={!active}
              aria-label={`${chest.title} 보물상자 ${cleared ? "개봉 완료" : active ? "탐사 가능" : "잠김"}`}
              onClick={openTreasureHunt}
            >
              <span>{cleared ? "✓" : active ? "▣" : "?"}</span>
              <p><small>탐사 지점 {String.fromCharCode(65 + index)} · {cleared ? "완료" : active ? "신호 발견" : "미확인"}</small><b>{cleared ? "발견 완료" : active ? chest.title : "아직 확인 안 된 위치"}</b></p>
            </button>;
          })}
        </div>}

        {mapStatus !== "ready" && <div className="current-location-pin" aria-label="현재 위치"><em aria-hidden="true" /><i>⌖</i><span>탐사대 위치</span></div>}
        <button className="map-location-control" aria-label="내 위치로 지도 이동하고 오늘의 탐사 패널 접기" onClick={() => { setMissionOpen(false); setMapFocusRequest((request) => request + 1); }}>◎</button>

        {seasonComplete && <section className="map-season-complete">
          <span>◆</span>
          <small>이번 테마 수집 완료</small>
          <h1>모든 흔적을<br />발견했어요</h1>
          <p>이번 테마의 보물상자는<br />더 이상 지도에 나타나지 않습니다.</p>
        </section>}

        <button className="map-mission-peek" data-visible={!missionOpen} aria-hidden={missionOpen} tabIndex={missionOpen ? -1 : 0} onClick={() => setMissionOpen(true)}>
          <span>▣</span>
          <p><small>{completedToday ? "오늘의 탐사 완료" : "오늘의 탐사"}</small><b>{seasonComplete ? "이번 테마 수집 완료" : completedToday ? "보물상자 3개 발견" : nextChest.title}</b></p>
          <i>⌃</i>
        </button>

        <section className="map-mission-sheet" data-open={missionOpen} aria-hidden={!missionOpen} inert={!missionOpen}>
          <button className="map-sheet-toggle" aria-label="오늘의 탐사 패널 접기" onClick={() => setMissionOpen(false)}><i /></button>
          <header>
            <div>
              <small>{seasonComplete ? "이번 시즌 탐사 기록" : completedToday ? "오늘의 탐사 완료" : `오늘의 탐사 · 지점 ${String.fromCharCode(65 + chestCount)}`}</small>
              <h1>{seasonComplete ? "이번 테마 수집 완료" : completedToday ? "오늘의 탐사 완료" : nextChest.title}</h1>
            </div>
            <span>{seasonComplete ? "5 / 5" : completedToday ? "완료" : nextChest.time}</span>
          </header>
          <p>{seasonComplete ? "완성한 유물 도감을 확인하거나 메인 테마를 다시 탐사할 수 있어요." : completedToday ? "새로운 보물상자는 내일 00:00에 다시 나타납니다." : nextChest.clue}</p>
          <div className="map-mission-meta">
            <span><i>⌖</i> GPS 도착 인증</span>
            <span><i>?</i> 현장 퀴즈</span>
            <span><i>＋</i> 최대 60 XP</span>
          </div>
          <button className="map-mission-start" onClick={() => router.push(seasonComplete ? "/my/artifacts" : completedToday ? "/daily/result" : "/daily/hunt")}>
            <span>{seasonComplete ? "완성한 유물 도감 보기" : completedToday ? "마지막 발견 기록 보기" : "탐사 개시"}</span>
            <i>{seasonComplete || completedToday ? "›" : `${chestCount + 1}/${DAILY_CHEST_LIMIT}`}</i>
          </button>
        </section>
      </div>
    </div>
  );
}

export function DailyArtifactHuntScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [status, setStatus] = useState<"idle" | "checking" | "near" | "arrived">("idle");
  const chestCount = getTodayChestCount(state);
  const completedToday = chestCount >= DAILY_CHEST_LIMIT;
  const seasonComplete = hiddenArtifacts.every((artifact) => state.artifactIds.includes(artifact.id));
  const chest = chestLocations[chestCount] ?? chestLocations[DAILY_CHEST_LIMIT - 1];

  if (seasonComplete || completedToday) {
    return <div className="center-screen"><b className="daily-complete-mark">✓</b><h1>{seasonComplete ? <>이번 테마의 탐사를<br />모두 마쳤어요</> : <>오늘의 상자 3개를<br />모두 열었어요</>}</h1><p>{seasonComplete ? "보물상자는 더 이상 출현하지 않습니다." : "내일 새로운 보물상자가 나타납니다."}</p><button className="primary" onClick={() => router.replace(seasonComplete ? "/my/artifacts" : "/daily/result")}>{seasonComplete ? "완성한 도감 보기" : "발견 기록 보기"}</button></div>;
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
        <p className="mission-kicker">TREASURE {chestCount + 1} / {DAILY_CHEST_LIMIT}</p>
        <h1>{status === "arrived" ? `${chest.title}에서 보물상자를 찾았어요!` : chest.clue}</h1>
        <p>{status === "arrived" ? "현장에 도착했습니다. 보물상자의 마지막 잠금을 풀어 주세요." : status === "near" ? "신호가 가까워졌어요. 약 35m 안쪽을 살펴보세요." : "정확한 장소는 도착한 뒤 공개됩니다."}</p>
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
  const todayKey = getKoreanDateKey();
  const chestCount = getTodayChestCount(state, todayKey);
  const completedToday = chestCount >= DAILY_CHEST_LIMIT;
  const seasonComplete = hiddenArtifacts.every((artifact) => state.artifactIds.includes(artifact.id));
  const choices = ["종", "열쇠", "책", "나침반"];

  function submit() {
    if (answer !== "열쇠") {
      setWrong(true);
      return;
    }
    const artifact = getDailyChestReward(state.artifactIds, chestCount);
    const firstDiscovery = !state.artifactIds.includes(artifact.id);
    const nextArtifactIds = [...new Set([...state.artifactIds, artifact.id])];
    const nextChestCount = chestCount + 1;
    const seasonCompletesNow = hiddenArtifacts.every((item) => nextArtifactIds.includes(item.id));
    const dailyCompletesNow = nextChestCount >= DAILY_CHEST_LIMIT || seasonCompletesNow;
    update({
      artifactIds: nextArtifactIds,
      dailyChestDate: todayKey,
      dailyChestCount: nextChestCount,
      lastDailyArtifactId: artifact.id,
      lastDailyArtifactWasNew: firstDiscovery,
      dailyCompletedDate: dailyCompletesNow ? todayKey : state.dailyCompletedDate,
      dailyStreak: dailyCompletesNow ? state.dailyStreak + 1 : state.dailyStreak,
      xp: Math.min(1600, state.xp + (firstDiscovery ? 60 : 20)),
    });
    notify(firstDiscovery ? "새로운 유물을 발견했어요" : "이미 발견한 유물이에요 · 20 XP");
    router.replace("/daily/result");
  }

  if (seasonComplete || completedToday) {
    return <div className="center-screen"><b className="daily-complete-mark">✓</b><h1>{seasonComplete ? <>이번 테마의 모든 유물을<br />발견했어요</> : <>오늘의 상자 3개를<br />모두 열었어요</>}</h1><button className="primary" onClick={() => router.replace("/daily/result")}>발견 기록 보기</button></div>;
  }

  return (
    <section className="daily-quiz">
      <div className="locked-chest" data-wrong={wrong}><i /><span>▣</span></div>
      <p className="mission-kicker">FIELD QUIZ</p>
      <h1>보물상자 {chestCount + 1}의<br />마지막 잠금을 풀어 주세요</h1>
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
  const chestCount = getTodayChestCount(state);
  const artifact = hiddenArtifacts.find((item) => item.id === state.lastDailyArtifactId);
  const completedToday = chestCount >= DAILY_CHEST_LIMIT;
  const seasonComplete = hiddenArtifacts.every((item) => state.artifactIds.includes(item.id));

  if (!artifact || chestCount === 0) {
    return <div className="center-screen"><span className="empty-icon">?</span><h1>아직 오늘의 보물상자를<br />열지 않았어요</h1><button className="primary" onClick={() => router.replace("/expeditions")}>오늘의 탐사 시작</button></div>;
  }

  return (
    <div className="artifact-result">
      <div className="artifact-rays" aria-hidden="true" />
      <p className="eyebrow">{state.lastDailyArtifactWasNew ? "NEW DISCOVERY" : "FOUND AGAIN"}</p>
      <div className={`artifact-emblem ${rarityTone[artifact.rarity]}`}><span>{artifact.emoji}</span></div>
      <Tag tone="brand">{artifact.id === restorationArtifact.id ? "복원 유물" : `${artifact.rarity} 유물`}</Tag>
      <h1>{artifact.name}</h1>
      <p>{state.lastDailyArtifactWasNew ? artifact.lore : "이미 도감에 등록된 유물입니다. 발견 기록과 경험치가 추가됐어요."}</p>
      <div className="artifact-result-meta"><span>{seasonComplete ? "이번 테마 수집 완료" : `오늘의 상자 ${chestCount}/${DAILY_CHEST_LIMIT}`}</span><b>＋{state.lastDailyArtifactWasNew ? 60 : 20} XP</b></div>
      <div className="result-actions">
        <button className="primary" onClick={() => router.push(seasonComplete || completedToday ? "/my/artifacts" : "/daily/hunt")}>{seasonComplete ? "완성한 유물 도감 보기" : completedToday ? "오늘 발견한 유물 보기" : "다음 보물상자 찾기"}</button>
        <button className="secondary" onClick={() => router.push("/expeditions")}>{seasonComplete ? "탐험 화면으로" : completedToday ? "오늘의 탐사 결과 보기" : "오늘의 탐사 지도로"}</button>
        <button className="text-button" onClick={() => router.push("/home")}>홈으로</button>
      </div>
    </div>
  );
}

export function ArtifactCollectionScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const recyclerRef = useRef<HTMLDivElement>(null);
  const [collectionIndex, setCollectionIndex] = useState<number | null>(0);
  const [artifactIndex, setArtifactIndex] = useState(0);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const collection = collectionIndex === null ? null : artifactCollections[collectionIndex];
  const allArtifacts = artifactCollections.flatMap((item) => item.artifacts);
  const collectionArtifacts = collection?.artifacts ?? allArtifacts;
  const ownedCount = collectionArtifacts.filter((artifact) => state.artifactIds.includes(artifact.id)).length;
  const completedToday = getTodayChestCount(state) >= DAILY_CHEST_LIMIT;
  const collectionProgress = Math.round(ownedCount / collectionArtifacts.length * 100);
  const isAllCollections = collection === null;
  const isCurrentCollection = collection?.status === "current";

  function showCollection(index: number | null) {
    setCollectionIndex(index);
    setArtifactIndex(0);
    setArchiveOpen(false);
    recyclerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }

  function showArtifact(index: number) {
    const nextIndex = Math.max(0, Math.min(collectionArtifacts.length - 1, index));
    setArtifactIndex(nextIndex);
    const recycler = recyclerRef.current;
    if (recycler) recycler.scrollTo({ left: nextIndex * (recycler.clientWidth + 12), behavior: "smooth" });
  }

  function syncArtifactIndex(event: UIEvent<HTMLDivElement>) {
    const recycler = event.currentTarget;
    const nextIndex = Math.round(recycler.scrollLeft / (recycler.clientWidth + 12));
    setArtifactIndex(Math.max(0, Math.min(collectionArtifacts.length - 1, nextIndex)));
  }

  return (
    <div className="screen artifact-collection">
      <button className="archive-selector" onClick={() => setArchiveOpen(true)}>
        <span>▦</span>
        <p><small>COMPLETE ARCHIVE</small><b>모든 메인 테마 보기</b></p>
        <strong>{artifactCollections.length}개 테마 ›</strong>
      </button>

      <section className="collection-head monthly-collection-head">
        <div className="collection-season"><span>{isAllCollections ? "COMPLETE ARCHIVE" : "MONTHLY MAIN THEME"}</span><strong>{isAllCollections ? "ALL SEASONS" : collection.yearLabel}</strong></div>
        <h1>{isAllCollections ? <>전체 메인 테마<br />유물 도감</> : <>{collection.monthLabel} 메인 테마<br />유물 도감</>}</h1>
        <div className="collection-theme-card">
          <span>{isAllCollections ? "◆" : collection.themeEmoji}</span>
          <p><small>{isAllCollections ? "전체 시즌 아카이브" : isCurrentCollection ? "이번 달 메인 테마" : "지난 메인 테마"}</small><b>{isAllCollections ? `${artifactCollections.length}개 메인 테마` : collection.themeTitle}</b></p>
          <i>{isAllCollections ? "통합 보기" : isCurrentCollection ? "진행 중" : "보관됨"}</i>
        </div>
        <div className="collection-progress">
          <div><span>COLLECTION PROGRESS</span><b>{ownedCount} / {collectionArtifacts.length}</b></div>
          <div className="collection-progress-bar"><i style={{ width: `${collectionProgress}%` }} /></div>
          <small>{collectionProgress}% 수집 완료 · {isAllCollections ? "전체 시즌 통합 기록" : isCurrentCollection ? "7월 31일까지" : "시즌 보관 완료"}</small>
        </div>
      </section>

      <section className="collection-list-head">
        <div><p className="eyebrow">{isAllCollections ? "ALL ARTIFACTS" : `${collection.id.replace("-", " ")} ARTIFACTS`}</p><h2>{isAllCollections ? `모든 유물 ${collectionArtifacts.length}종` : `${collection.monthLabel} 유물 5종`}</h2></div>
        <div className="recycler-counter"><b>{artifactIndex + 1}</b><span>/ {collectionArtifacts.length}</span></div>
      </section>

      <div className="artifact-recycler-controls">
        <button aria-label="이전 유물" disabled={artifactIndex === 0} onClick={() => showArtifact(artifactIndex - 1)}>‹</button>
        <div className="artifact-recycler-dots" aria-label="유물 페이지">
          {collectionArtifacts.map((artifact, index) => <button key={artifact.id} aria-label={`${index + 1}번 유물 보기`} data-active={artifactIndex === index} onClick={() => showArtifact(index)} />)}
        </div>
        <button aria-label="다음 유물" disabled={artifactIndex === collectionArtifacts.length - 1} onClick={() => showArtifact(artifactIndex + 1)}>›</button>
      </div>

      <div className="artifact-recycler" ref={recyclerRef} onScroll={syncArtifactIndex} aria-label={isAllCollections ? "전체 메인 테마 유물 목록" : `${collection.monthLabel} 메인 테마 유물 목록`}>
        {collectionArtifacts.map((artifact, index) => {
          const found = state.artifactIds.includes(artifact.id);
          const parentCollection = artifactCollections.find((item) => item.themeId === artifact.themeId);
          return <article key={artifact.id} data-found={found} className={found ? rarityTone[artifact.rarity] : ""}>
            <div className="artifact-card-top"><span>{isAllCollections ? `${parentCollection?.monthLabel ?? ""} · ` : ""}NO.{String(index + 1).padStart(2, "0")}</span><Tag>{found ? artifact.rarity : artifact.id === restorationArtifact.id ? "복원 유물" : "미발견"}</Tag></div>
            <div className="artifact-recycler-emblem"><span>{found ? artifact.emoji : "?"}</span><i /></div>
            <div className="artifact-recycler-copy">
              <small>{isAllCollections && parentCollection ? `${parentCollection.themeEmoji} ${parentCollection.themeTitle}` : found ? `${artifact.rarity.toUpperCase()} ARTIFACT` : "LOCKED ARTIFACT"}</small>
              <h2>{found ? artifact.name : "알 수 없는 유물"}</h2>
              <p>{found ? artifact.lore : artifact.id === restorationArtifact.id ? "보물상자 어딘가에 잠든, 아직 복원되지 않은 유물입니다." : "데일리 탐사에서 단서를 따라가면 이 기록이 해제됩니다."}</p>
            </div>
            <div className="artifact-card-state">{found ? "✓ 도감 등록 완료" : "🔒 아직 발견하지 못했어요"}</div>
          </article>;
        })}
      </div>

      <button className="collection-quest-link" data-archive={!isCurrentCollection} onClick={() => router.push(isAllCollections ? "/expeditions" : isCurrentCollection ? (completedToday ? "/daily/result" : "/expeditions") : `/themes/${collection.themeId}`)}>
        <span>{isAllCollections ? "⌖" : isCurrentCollection ? (completedToday ? "✓" : "⌖") : collection.themeEmoji}</span>
        <p><b>{isAllCollections ? "현재 시즌 탐험으로" : isCurrentCollection ? (completedToday ? "오늘의 보물상자 개봉 완료" : "오늘의 보물상자 찾으러 가기") : `${collection.themeTitle} 다시 보기`}</b><small>{isAllCollections ? "7월 메인 테마의 새로운 유물을 찾아보세요." : isCurrentCollection ? (completedToday ? "오늘 발견한 유물 기록을 다시 확인해 보세요." : "탐험 탭에서 오늘 나타난 보물상자 3개를 찾아보세요.") : "지난 메인 테마의 이야기와 완료 기록을 확인해 보세요."}</small></p>
        <strong>›</strong>
      </button>

      <div className="daily-rule collection-rule"><b>{isAllCollections ? "모든 시즌의 유물을 한곳에서 보고 있어요" : isCurrentCollection ? "다음 메인 테마가 시작되면 새로운 도감이 열려요" : `${collection.monthLabel} 유물 도감은 안전하게 보관 중이에요`}</b><p>{isAllCollections ? "테마별 도감은 상단의 전체 도감 메뉴에서 선택할 수 있습니다." : isCurrentCollection ? "7월에 발견한 유물은 시즌이 끝난 뒤에도 보관됩니다." : "과거에 발견한 유물은 언제든 다시 확인할 수 있습니다."}</p></div>

      {archiveOpen && <Modal title="전체 시즌 유물 도감" onClose={() => setArchiveOpen(false)}>
        <div className="archive-picker">
          <button className="archive-all-option" data-selected={isAllCollections} onClick={() => showCollection(null)}>
            <span>◆</span><p><b>모든 유물 한 번에 보기</b><small>{artifactCollections.length}개 테마 · {allArtifacts.length}종</small></p><i>{isAllCollections ? "✓" : "›"}</i>
          </button>
          <div className="archive-year-label"><b>2026</b><small>메인 테마 아카이브</small></div>
          {artifactCollections.map((item, index) => {
            const found = item.artifacts.filter((artifact) => state.artifactIds.includes(artifact.id)).length;
            return <button key={item.id} className="archive-theme-option" data-selected={collectionIndex === index} onClick={() => showCollection(index)}>
              <span>{item.themeEmoji}</span><p><small>{item.monthLabel} · {item.status === "current" ? "진행 중" : "보관됨"}</small><b>{item.themeTitle}</b></p><strong>{found}/{item.artifacts.length}</strong><i>{collectionIndex === index ? "✓" : "›"}</i>
            </button>;
          })}
        </div>
      </Modal>}
    </div>
  );
}
