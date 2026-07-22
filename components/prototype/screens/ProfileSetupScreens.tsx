"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { interestOptions } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";

export function ProfileSetupScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  const [nickname, setNickname] = useState(state.nickname);
  const [gender, setGender] = useState("");
  return (
    <section className="form-screen"><p className="step-label">프로필 1 / 2</p><h1>탐사원 프로필을<br />만들어 볼까요?</h1><button className="profile-picker"><span>🧭</span><small>사진 변경</small></button><label>닉네임<input maxLength={10} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label><label>주 사용 언어<select defaultValue="한국어"><option>한국어</option><option>English</option><option>中文</option><option>日本語</option></select></label><fieldset><legend>성별</legend><div className="segmented">{["여성", "남성", "응답 안 함"].map((item) => <button type="button" key={item} data-selected={gender === item} onClick={() => setGender(item)}>{item}</button>)}</div><small>탐험대 구성에만 사용되며 다른 사용자에게 공개되지 않아요.</small></fieldset><button className="primary bottom-action" disabled={!nickname || !gender} onClick={() => { update({ nickname }); router.push("/profile/interests"); }}>다음</button></section>
  );
}

export function InterestsScreen() {
  const router = useRouter();
  const { update } = useDemo();
  const [selected, setSelected] = useState<string[]>([]);
  const [issued, setIssued] = useState(false);
  function toggle(item: string) { setSelected((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]); }
  if (issued) return <div className="license-issued"><div className="license-card"><span>✦</span><small>FREE EXPLORATION LICENSE</small><h2>첫 탐사 라이선스</h2><p>모든 탐험대에 참여할 수 있어요</p></div><h1>무료 라이선스가<br />발급됐어요!</h1><button className="primary" onClick={() => { update({ interests: selected, license: true, onboarded: true }); router.push("/home"); }}>홈으로 가기</button></div>;
  return (
    <section className="onboarding-screen"><p className="step-label">프로필 2 / 2</p><h1>좋아하는 것을<br />3개 이상 골라 주세요</h1><p className="muted">잘 맞는 탐험대를 추천하는 데 활용돼요.</p><div className="interest-cloud">{interestOptions.map((item) => <button key={item} data-selected={selected.includes(item)} onClick={() => toggle(item)}>{item}</button>)}</div><p className="selection-count">{selected.length}개 선택</p><button className="primary bottom-action" disabled={selected.length < 3} onClick={() => setIssued(true)}>무료 라이선스 받기</button></section>
  );
}
