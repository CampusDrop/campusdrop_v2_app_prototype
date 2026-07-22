"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { Modal, Progress, Tag } from "../ui";

export function MyScreen() {
  const router = useRouter();
  const { state, notify } = useDemo();
  const menus = [["✓", "완료한 테마", "/my/completed"], ["✦", "레벨·경험치", "/my/level"], ["🎟️", "쿠폰", "/rewards"], ["♧", "친구", "/friends"], ["▣", "탐사 라이선스", "/my/license"], ["⚙", "설정", "/settings"]];
  return <div className="screen my-screen"><section className="profile-hero"><span>🧭</span><div><Tag tone="mint">✓ 세종대학교 인증</Tag><h1>{state.nickname}</h1><p>카페 · 게임 · 사진 · 여행</p></div><button onClick={() => notify("프로필 편집은 다음 단계에서 연결됩니다")}>편집</button></section><section className="my-level-card" onClick={() => router.push("/my/level")}><div><b>Lv.{state.level} 캠퍼스 탐험가</b><small>{state.completed ? "다음 레벨까지 1,520 XP" : "다음 레벨까지 360 XP"}</small></div><Progress value={state.xp} max={1600} /></section><div className="profile-stats"><div><b>{state.completed ? 4 : 3}</b><small>완료 테마</small></div><div><b>{state.friends.length}</b><small>친구</small></div><div><b>{state.coupon === "available" ? 1 : 0}</b><small>쿠폰</small></div></div><div className="my-menu">{menus.map(([icon, label, path]) => <button key={path} onClick={() => router.push(path)}><span>{icon}</span><b>{label}</b><i>›</i></button>)}</div></div>;
}

export function CompletedThemesScreen() {
  const { state } = useDemo();
  const records = state.completed ? [["사라진 총장의 열쇠", "7월 24일 · 47분 38초", "🐈 🐻 🫘"]] : [];
  return <div className="screen">{records.length ? <div className="completed-list">{records.map(([title, meta, team]) => <article key={title}><div>🔑</div><Tag tone="mint">완료</Tag><h2>{title}</h2><p>{meta}</p><small>함께한 탐사원 {team}</small></article>)}</div> : <div className="state-card"><b>🧩</b><h3>완료한 테마가 없어요</h3><p>첫 캠퍼스 탐험을 시작해 보세요.</p></div>}</div>;
}

export function LevelScreen() {
  const { state } = useDemo();
  return <div className="screen level-screen"><section className="level-hero"><div className="level-orbit"><span>{state.level}</span></div><p>현재 레벨</p><h1>Lv.{state.level} 캠퍼스 탐험가</h1><Progress value={state.xp} max={1600} /><small>{state.xp.toLocaleString()} / 1,600 XP</small></section><section className="content-section"><h2>경험치 획득 내역</h2><div className="xp-history"><div><span>🔑</span><p><b>사라진 총장의 열쇠 성공</b><small>7월 24일</small></p><strong>＋440 XP</strong></div><div><span>🧭</span><p><b>프로필 설정 완료</b><small>7월 22일</small></p><strong>＋100 XP</strong></div></div></section></div>;
}

export function LicenseScreen() {
  const { state, update, notify } = useDemo();
  const [purchase, setPurchase] = useState(false);
  return <div className="screen license-screen"><div className={`license-pass ${state.license ? "active" : "inactive"}`}><small>CAMPUSDROP EXPLORATION LICENSE</small><h1>{state.license ? "탐사 라이선스" : "라이선스 회수됨"}</h1><p>{state.license ? "모든 탐험대 기능 사용 가능" : "모집 및 합류 기능이 제한됩니다"}</p><span>{state.license ? "ACTIVE" : "LOCKED"}</span></div>{state.license ? <section className="detail-body"><h2>최초 무료 발급 라이선스</h2><p>학교 인증과 프로필 설정을 완료해 무료로 발급됐어요.</p><div className="check-list"><p>✓ 탐험대 만들기</p><p>✓ 새로운 탐험대 합류</p><p>✓ 테마 플레이와 보상</p></div><button className="secondary full-button" onClick={() => { update({ license: false }); notify("라이선스 없음 상태로 전환했어요"); }}>DEMO · 라이선스 회수 상태 보기</button></section> : <section className="detail-body"><h2>다시 탐험하려면</h2><p>운영 정책 위반 시 라이선스가 회수될 수 있습니다. 시연에서는 재취득 결제를 통해 즉시 복구할 수 있어요.</p><div className="notice-card">탐험대 모집·합류가 제한되지만 테마와 프로필은 계속 볼 수 있어요.</div><button className="primary full-button" onClick={() => setPurchase(true)}>50,000원에 라이선스 재취득</button><button className="text-button full-button">이의제기 안내</button></section>}{purchase && <Modal title="시연용 결제" onClose={() => setPurchase(false)}><p>실제 결제는 진행되지 않습니다.</p><button className="primary" onClick={() => { update({ license: true }); notify("라이선스가 복구됐어요"); setPurchase(false); }}>결제 완료 시뮬레이션</button></Modal>}</div>;
}
