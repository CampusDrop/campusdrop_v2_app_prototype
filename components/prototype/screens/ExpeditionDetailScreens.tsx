"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { expeditions, teamMembers, themes } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { Modal, Tag } from "../ui";

export function ExpeditionDetailScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const expedition = expeditions.find((item) => pathname.includes(item.id)) ?? expeditions[0];
  const theme = themes.find((item) => item.id === expedition.themeId) ?? themes[0];
  const [confirm, setConfirm] = useState(false);
  function join() {
    setConfirm(false);
    if (!state.license) return router.push("/my/license");
    if (expedition.full) { notify("방금 정원이 마감됐어요"); return router.push("/expeditions/teams"); }
    update({ joined: true }); notify("탐험대에 합류했어요!");
  }
  return (
    <div className="detail-screen"><div className="expedition-detail-hero"><p className="eyebrow">{theme.title}</p><h1>{expedition.title}</h1><div><Tag tone="mint">{expedition.members}/{expedition.capacity}명</Tag><Tag>공통 관심사 {expedition.interests[0]}</Tag></div></div><section className="detail-body"><div className="info-list"><div><span>📅</span><p><small>일정</small><b>{expedition.date}</b></p></div><div><span>📍</span><p><small>만남 장소</small><b>{expedition.cafe}</b></p></div><div><span>🧩</span><p><small>테마</small><b>{theme.title}</b></p></div></div><div className="section-title"><h2>함께할 탐사원</h2><small>합류 전 공개 정보</small></div><div className="member-list">{teamMembers.map((member) => <div key={member.name}><span>{member.avatar}</span><p><b>{member.name}</b><small>완료 테마 {member.completed}개</small></p><Tag>{member.interest}</Tag></div>)}</div><div className="notice-card">🛡️ 성별과 상세 관심사는 다른 사용자에게 공개되지 않아요.</div></section><div className="sticky-actions single"><button className="primary" onClick={() => state.joined ? router.push(`/expeditions/${expedition.id}/chat`) : setConfirm(true)}>{state.joined ? "채팅방 입장" : "탐험대 합류하기"}</button></div>{confirm && <Modal title="탐험대에 합류할까요?" onClose={() => setConfirm(false)}><p>{expedition.date}<br />{expedition.cafe}</p><div className="modal-actions"><button className="secondary" onClick={() => setConfirm(false)}>취소</button><button className="primary" onClick={join}>합류하기</button></div></Modal>}</div>
  );
}

export function CreateExpeditionScreen() {
  const router = useRouter();
  const { state, notify } = useDemo();
  const [mode, setMode] = useState("새로운 탐사원");
  if (!state.license) return <LicenseBlocked />;
  return (
    <section className="form-screen"><h1>새 탐험대 만들기</h1><label>테마<select defaultValue="missing-key"><option value="missing-key">사라진 총장의 열쇠</option><option value="hidden-classroom">시간표에 없는 강의실</option></select></label><div className="two-columns"><label>날짜<input type="date" defaultValue="2026-07-24" /></label><label>시간<input type="time" defaultValue="18:30" /></label></div><label>만남 카페<select><option>제주몰빵 세종대점</option></select></label><fieldset><legend>모집 방식</legend><div className="choice-grid compact">{["친구 탐험대", "새로운 탐사원"].map((item) => <button type="button" key={item} data-selected={mode === item} onClick={() => setMode(item)}><b>{item}</b><span>{item === "친구 탐험대" ? "아는 친구 초대" : "조건에 맞는 탐사원 모집"}</span></button>)}</div></fieldset><div className="notice-card">정원 4명 · 테마별 참가 구성은 안전한 플레이를 위해 변경할 수 없어요.</div><button className="primary bottom-action" onClick={() => { notify("탐험대를 만들었어요"); router.push(mode === "친구 탐험대" ? "/expeditions/key-friday/invite" : "/expeditions/key-friday"); }}>탐험대 만들기</button></section>
  );
}

function LicenseBlocked() {
  const router = useRouter();
  return <div className="center-screen blocked"><span>🎫</span><h1>탐사 라이선스가 필요해요</h1><p>탐험대를 만들거나 합류하려면 라이선스를 복구해 주세요.</p><button className="primary" onClick={() => router.push("/my/license")}>라이선스 확인</button></div>;
}

export function InviteScreen() {
  const { notify } = useDemo();
  const [selected, setSelected] = useState<string[]>([]);
  return <section className="screen"><div className="screen-intro"><h1>친구 초대</h1><p>함께 플레이할 친구를 선택해 주세요.</p></div><div className="friend-select-list">{["캠퍼스루키", "미로냥", "사진곰"].map((name, index) => <button key={name} data-selected={selected.includes(name)} onClick={() => setSelected((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])}><span>{["🦊", "🐈", "🐻"][index]}</span><b>{name}</b><i>{selected.includes(name) ? "✓" : "＋"}</i></button>)}</div><button className="secondary full-button" onClick={() => notify("초대 링크를 복사했어요")}>🔗 초대 링크 복사</button><button className="primary bottom-action" disabled={!selected.length} onClick={() => notify(`${selected.length}명에게 초대를 보냈어요`)}>선택한 친구 초대</button></section>;
}
