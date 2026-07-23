"use client";

import { useRouter } from "next/navigation";
import { themes, expeditions } from "@/lib/prototype/data";
import { getKoreanDateKey } from "@/lib/prototype/artifacts";
import { translate } from "@/lib/prototype/i18n";
import { useDemo } from "../DemoProvider";
import { ExpeditionCard, ThemeCard } from "../cards";
import { Progress, StateGate } from "../ui";

export function HomeScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const completedToday = state.dailyCompletedDate === getKoreanDateKey();
  return (
    <div className="screen home-screen">
      <section className="home-greeting"><div><p>안녕하세요 👋</p><h1>{translate(state.language, "greeting")}</h1></div><button className="profile-chip" onClick={() => router.push("/my")}>🧭</button></section>
      <section className="level-strip"><div><span>Lv.{state.level}</span><div><b>{state.nickname}</b><small>{state.completed ? "다음 레벨까지 1,320 XP" : "다음 레벨까지 360 XP"}</small></div></div><Progress value={state.xp} max={1600} /></section>
      <button className="daily-home-banner" onClick={() => router.push("/daily")}>
        <span className="daily-home-icon">⌖<i /></span>
        <p><small>DAILY DISCOVERY · 하루 한 번</small><b>{completedToday ? "오늘 발견한 유물을 확인해 보세요" : "캠퍼스에 새로운 흔적이 나타났어요"}</b></p>
        <strong>{completedToday ? "완료" : "추적하기"} ›</strong>
      </button>
      <StateGate empty="오늘 추천할 테마가 없어요">
        {state.joined && <section className="scheduled-card"><div className="scheduled-label"><span>다음 탐험까지</span><b>D-2</b></div><h2>금요일 열쇠 원정대</h2><p>7월 24일 오후 6:30 · 제주몰빵 세종대점</p><div><button onClick={() => router.push("/expeditions/key-friday/chat")}>채팅방</button><button onClick={() => router.push("/expeditions/key-friday/meetup")}>약속 보기</button></div></section>}
        <section className="content-section"><div className="section-title"><div><p className="eyebrow">TODAY</p><h2>오늘 가능한 테마</h2></div><button onClick={() => router.push("/themes")}>전체 보기</button></div><div className="horizontal-list">{themes.slice(0, 2).map((theme) => <ThemeCard key={theme.id} theme={theme} compact />)}</div></section>
        <section className="content-section"><div className="section-title"><div><p className="eyebrow">MATCH</p><h2>나와 맞는 탐험대</h2></div><button onClick={() => router.push("/expeditions")}>전체 보기</button></div><ExpeditionCard expedition={expeditions[0]} /></section>
        <button className="coupon-summary" onClick={() => router.push("/rewards")}><span>🎟️</span><div><small>사용 가능한 쿠폰</small><b>{state.coupon === "available" ? "제주몰빵 10% 할인" : "새 쿠폰이 없어요"}</b></div><i>›</i></button>
      </StateGate>
    </div>
  );
}
