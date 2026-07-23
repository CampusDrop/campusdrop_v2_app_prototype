"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restorationArtifact } from "@/lib/prototype/artifacts";
import { useDemo } from "../DemoProvider";
import { Modal, Progress, StateGate, Tag } from "../ui";

export function ResultScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const hasRestorationArtifact = state.artifactIds.includes(restorationArtifact.id);
  const changedEnding = state.mainThemeRuns >= 2 && hasRestorationArtifact;
  const replay = state.mainThemeRuns >= 2;
  return (
    <div className={`result-screen ${changedEnding ? "changed-ending" : ""}`}>
      <div className="confetti" aria-hidden="true">✦ · ✧ · ✦ · ✧</div>
      <div className="result-emblem">{changedEnding ? "🗝️" : "🏆"}</div>
      <p className="eyebrow">MISSION COMPLETE</p>
      <h1>사라진 총장의<br />열쇠를 찾았어요!</h1>
      <p>{changedEnding ? "문이 닫히기 직전, 처음에는 없던 희미한 빛이 복도 끝에서 번졌습니다." : "팀과 함께 모든 미션을 해결했습니다."}</p>
      {changedEnding && <section className="ending-epilogue"><small>EPILOGUE</small><b>열리지 않았던 문</b><p>총장실 책장 뒤에서 작은 문 하나가 모습을 드러냈어요. 안쪽에는 누군가 다음 탐사원을 기다린 듯, 오래된 기록 한 장이 놓여 있었습니다.</p><i>“열쇠는 하나가 아니었다.”</i></section>}
      <div className="result-stats"><div><small>소요시간</small><b>47:38</b></div><div><small>사용 힌트</small><b>1개</b></div><div><small>팀 순위</small><b>상위 18%</b></div></div>
      <section className="xp-card"><div><span>Lv.{state.level}</span><p><small>{replay ? "재탐사 완료" : "레벨 업!"}</small><b>＋{replay ? 120 : 440} XP</b></p></div><Progress value={state.xp} max={1600} /></section>
      <div className="team-photo"><span>🐈</span><span>🐻</span><span>🫘</span><span>🧭</span><p>금요일 열쇠 원정대</p></div>
      <div className="result-actions"><button className="primary" onClick={() => router.push("/rewards/cafe10")}>10% 할인 쿠폰 확인</button><button className="secondary" onClick={() => router.push("/themes/missing-key/reviews/new")}>방탈출 리뷰 남기기</button><button className="secondary" onClick={() => router.push("/community/themes/missing-key")}>완료자 비밀방 입장</button><button className="text-button" onClick={() => router.push("/friends/scan")}>팀원 QR로 친구 추가</button><button className="text-button" onClick={() => router.push("/home")}>홈으로</button></div>
    </div>
  );
}

export function RewardListScreen() {
  const [tab, setTab] = useState("사용 가능");
  const { state } = useDemo();
  return <div className="screen"><div className="wide-tabs">{["사용 가능", "사용 완료", "만료"].map((item) => <button key={item} data-active={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div><StateGate empty="표시할 쿠폰이 없어요"><div className="coupon-list">{((tab === "사용 가능" && state.coupon === "available") || (tab === "사용 완료" && state.coupon === "used")) ? <CouponCard status={state.coupon} /> : <div className="state-card"><b>🎟️</b><h3>{tab} 쿠폰이 없어요</h3><p>테마를 완료하면 새로운 혜택을 받을 수 있어요.</p></div>}</div></StateGate></div>;
}

function CouponCard({ status }: { status: string }) {
  const router = useRouter();
  return <button className="coupon-card" onClick={() => router.push("/rewards/cafe10")}><div><Tag tone="brand">{status === "used" ? "사용 완료" : "오늘만"}</Tag><h2>제주몰빵<br />전 메뉴 10% 할인</h2><p>7월 24일 23:59까지</p></div><span>10<small>%</small></span></button>;
}

export function RewardDetailScreen() {
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const [qr, setQr] = useState(false);
  function completeUse() {
    update({ coupon: "used" });
    notify("쿠폰 사용이 완료됐어요");
    setQr(false);
    router.push("/rewards");
  }
  return <div className="coupon-detail"><div className="coupon-ticket"><p className="eyebrow">CAMPUSDROP REWARD</p><span>10%</span><h1>제주몰빵<br />전 메뉴 할인</h1><p>오늘 23:59까지 · 남은 시간 05:21:08</p></div><section className="detail-body"><h2>사용 안내</h2><div className="info-list"><div><span>🏪</span><p><small>사용 매장</small><b>제주몰빵 세종대점</b></p></div><div><span>✓</span><p><small>사용 조건</small><b>1인 1회 · 다른 할인과 중복 불가</b></p></div></div><div className="notice-card">직원 앞에서 사용 버튼을 누르면 확인용 QR 코드가 바로 열려요.</div></section><div className="sticky-actions single"><button className="primary" disabled={state.coupon === "used"} onClick={() => setQr(true)}>{state.coupon === "used" ? "사용 완료된 쿠폰" : "QR 코드 열고 사용하기"}</button></div>{qr && <Modal title="직원에게 QR을 보여 주세요" onClose={() => setQr(false)}><div className="qr-use-panel"><p><b>제주몰빵 세종대점</b><small>전 메뉴 10% 할인</small></p><div className="qr-demo" role="img" aria-label="쿠폰 사용 QR 코드"><i /><b /><em /><small>02:59</small></div><strong>CD-1024-0718</strong><small>QR 코드는 3분 동안 유효해요.</small></div><button className="primary" onClick={completeUse}>직원 확인 완료</button></Modal>}</div>;
}
