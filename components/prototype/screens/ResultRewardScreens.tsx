"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { Modal, Progress, StateGate, Tag } from "../ui";

export function ResultScreen() {
  const router = useRouter();
  const { state } = useDemo();
  return (
    <div className="result-screen"><div className="confetti" aria-hidden="true">✦ · ✧ · ✦ · ✧</div><div className="result-emblem">🏆</div><p className="eyebrow">MISSION COMPLETE</p><h1>사라진 총장의<br />열쇠를 찾았어요!</h1><p>팀과 함께 모든 미션을 해결했습니다.</p><div className="result-stats"><div><small>소요시간</small><b>47:38</b></div><div><small>사용 힌트</small><b>1개</b></div><div><small>팀 순위</small><b>상위 18%</b></div></div><section className="xp-card"><div><span>Lv.{state.level}</span><p><small>레벨 업!</small><b>＋440 XP</b></p></div><Progress value={state.xp} max={1600} /></section><div className="team-photo"><span>🐈</span><span>🐻</span><span>🫘</span><span>🧭</span><p>금요일 열쇠 원정대</p></div><div className="result-actions"><button className="primary" onClick={() => router.push("/rewards/cafe10")}>10% 할인 쿠폰 확인</button><button className="secondary" onClick={() => router.push("/friends/scan")}>팀원 QR로 친구 추가</button><button className="text-button" onClick={() => router.push("/home")}>홈으로</button></div></div>
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
  const [confirm, setConfirm] = useState(false);
  const [qr, setQr] = useState(false);
  return <div className="coupon-detail"><div className="coupon-ticket"><p className="eyebrow">CAMPUSDROP REWARD</p><span>10%</span><h1>제주몰빵<br />전 메뉴 할인</h1><p>오늘 23:59까지 · 남은 시간 05:21:08</p></div><section className="detail-body"><h2>사용 안내</h2><div className="info-list"><div><span>🏪</span><p><small>사용 매장</small><b>제주몰빵 세종대점</b></p></div><div><span>✓</span><p><small>사용 조건</small><b>1인 1회 · 다른 할인과 중복 불가</b></p></div></div><div className="notice-card">직원 앞에서 사용 버튼을 누르세요. 사용 처리 후에는 되돌릴 수 없어요.</div></section><div className="sticky-actions single"><button className="primary" disabled={state.coupon === "used"} onClick={() => setConfirm(true)}>{state.coupon === "used" ? "사용 완료된 쿠폰" : "직원 앞에서 사용하기"}</button></div>{confirm && <Modal title="지금 쿠폰을 사용할까요?" onClose={() => setConfirm(false)}><p className="muted">직원이 확인할 수 있도록 QR 화면을 보여 주세요.</p><div className="modal-actions"><button className="secondary" onClick={() => setConfirm(false)}>취소</button><button className="primary" onClick={() => { setConfirm(false); setQr(true); }}>QR 열기</button></div></Modal>}{qr && <Modal title="동적 사용 코드" onClose={() => setQr(false)}><div className="qr-demo">▦<small>03:00</small></div><button className="primary" onClick={() => { update({ coupon: "used" }); notify("쿠폰을 사용했어요"); setQr(false); router.push("/rewards"); }}>사용 완료</button></Modal>}</div>;
}
