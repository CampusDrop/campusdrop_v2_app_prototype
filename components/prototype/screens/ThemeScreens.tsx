"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { themeReviews, themes } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { ThemeCard } from "../cards";
import { StateGate, Tag } from "../ui";

export function ThemeListScreen() {
  const [filter, setFilter] = useState("전체");
  const { state } = useDemo();
  const visible = themes.filter((theme) => filter === "전체" || filter === "심야" && theme.locked || filter === "지금 가능" && !theme.locked || filter === "완료" && state.completed && theme.id === "missing-key");
  return (
    <div className="screen"><section className="screen-intro"><p className="eyebrow">ESCAPE THEMES</p><h1>캠퍼스의 숨은 이야기를<br />플레이해 보세요</h1></section><div className="filter-row">{["전체", "지금 가능", "심야", "완료"].map((item) => <button key={item} data-active={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><StateGate empty="조건에 맞는 테마가 없어요"><div className="theme-list">{visible.map((theme) => <ThemeCard key={theme.id} theme={theme} />)}</div></StateGate></div>
  );
}

export function ThemeDetailScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, notify } = useDemo();
  const theme = themes.find((item) => pathname.endsWith(item.id)) ?? themes[0];
  const reviews = [...state.reviews, ...themeReviews].filter((review) => review.themeId === theme.id);
  const score = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const communityOpen = state.completed && theme.id === "missing-key";
  return (
    <div className="detail-screen"><div className="detail-hero" style={{ "--theme-color": theme.color } as React.CSSProperties}><span>{theme.emoji}</span><div>{state.completed && theme.id === "missing-key" ? <Tag tone="mint">완료한 테마</Tag> : <Tag tone="brand">{theme.locked ? "심야 전용" : "지금 가능"}</Tag>}<h1>{theme.title}</h1><p>{theme.subtitle}</p></div></div><section className="detail-body"><div className="stat-grid"><div><small>난이도</small><b>{theme.difficulty}</b></div><div><small>예상시간</small><b>{theme.duration}</b></div><div><small>정원</small><b>{theme.capacity}</b></div></div><h2>테마 소개</h2><p>{theme.description}</p><button className="theme-review-preview" onClick={() => router.push(`/themes/${theme.id}/reviews`)}><span><b>{score.toFixed(1)}</b><i>{"★".repeat(Math.round(score))}</i></span><p><b>탐사원 리뷰 {reviews.length}개</b><small>스포일러 보호 리뷰 확인하기</small></p><strong>›</strong></button><button className="theme-community-preview" data-open={communityOpen} onClick={() => communityOpen ? router.push(`/community/themes/${theme.id}`) : notify("테마를 완료하면 비밀방이 열려요")}><span>{communityOpen ? "🔓" : "🔒"}</span><p><b>테마 비밀 커뮤니티</b><small>{communityOpen ? "완료 인증됨 · 지금 입장 가능" : "테마를 완료한 탐사원만 입장"}</small></p><strong>›</strong></button><h2>예상 동선</h2><div className="route-preview"><span>제주몰빵</span><i /><span>대양AI센터</span><i /><span>광개토관</span></div><div className="notice-card">⚠️ 야외 이동이 포함돼요. 편한 신발을 신고 안전 안내를 따라 주세요.</div></section><div className="sticky-actions">{theme.locked ? <><button className="secondary" onClick={() => notify("공개 알림을 신청했어요")}>알림 받기</button><button className="primary" disabled>22:00 공개</button></> : <><button className="secondary" onClick={() => router.push(`/expeditions/new?theme=${theme.id}`)}>친구들과 만들기</button><button className="primary" onClick={() => router.push("/expeditions")}>탐험대 찾기</button></>}</div></div>
  );
}
