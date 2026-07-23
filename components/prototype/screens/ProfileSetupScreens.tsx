"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { hobbyOptions, interestOptions, type PreferenceOption } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";

export function ProfileSetupScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  const [nickname, setNickname] = useState(state.nickname);
  const [gender, setGender] = useState("");
  return (
    <section className="form-screen"><p className="step-label">프로필 1 / 3</p><h1>탐사원 프로필을<br />만들어 볼까요?</h1><button className="profile-picker"><span>🧭</span><small>사진 변경</small></button><label>닉네임<input maxLength={10} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label><label>주 사용 언어<select defaultValue="한국어"><option>한국어</option><option>English</option><option>中文</option><option>日本語</option></select></label><fieldset><legend>성별</legend><div className="segmented">{["여성", "남성", "응답 안 함"].map((item) => <button type="button" key={item} data-selected={gender === item} onClick={() => setGender(item)}>{item}</button>)}</div><small>탐험대 구성에만 사용되며 다른 사용자에게 공개되지 않아요.</small></fieldset><button className="primary bottom-action" disabled={!nickname || !gender} onClick={() => { update({ nickname, profileReady: true }); router.push("/profile/interests"); }}>다음</button></section>
  );
}

export function InterestsScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  const [selected, setSelected] = useState<string[]>(state.interests);
  function toggle(item: string) { setSelected((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]); }
  return (
    <PreferenceScreen step="프로필 2 / 3 · 관심사" title="평소 관심 있는 분야를 골라 주세요" description="탐험대와 테마를 추천하는 데 활용해요." options={interestOptions} selected={selected} onToggle={toggle} action="취미 선택하기" onContinue={() => { update({ interests: selected }); router.push("/profile/hobbies"); }} />
  );
}

export function HobbiesScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  const [selected, setSelected] = useState<string[]>(state.hobbies);
  const [issued, setIssued] = useState(false);
  function toggle(item: string) { setSelected((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]); }
  if (issued) return <div className="license-issued"><div className="license-card"><span>✦</span><small>FREE EXPLORATION LICENSE</small><h2>첫 탐사 라이선스</h2><p>모든 탐험대에 참여할 수 있어요</p></div><h1>가입이 완료됐어요!</h1><p>로그인과 학교 인증, 프로필 설정을 모두 마쳤어요.</p><button className="primary" onClick={() => { update({ hobbies: selected, license: true, onboarded: true }); router.push("/home"); }}>CampusDrop 입장하기</button></div>;
  return <PreferenceScreen step="프로필 3 / 3 · 취미" title="직접 즐기는 취미를 골라 주세요" description="함께 활동하기 좋은 친구를 찾는 데 활용해요." options={hobbyOptions} selected={selected} onToggle={toggle} action="가입 완료하기" onContinue={() => setIssued(true)} />;
}

function PreferenceScreen({ step, title, description, options, selected, onToggle, action, onContinue }: { step: string; title: string; description: string; options: PreferenceOption[]; selected: string[]; onToggle: (item: string) => void; action: string; onContinue: () => void }) {
  return <section className="onboarding-screen preference-screen"><div className="preference-intro"><p className="step-label">{step}</p><h1>{title}</h1><p className="muted">{description}</p></div><div className="preference-grid">{options.map((item) => <button key={item.id} data-selected={selected.includes(item.label)} onClick={() => onToggle(item.label)} aria-pressed={selected.includes(item.label)}><Image src={`${import.meta.env.BASE_URL}${item.image.slice(1)}`} alt="" fill sizes="(min-width: 400px) 25vw, 33vw" unoptimized /><span>{item.label}</span><i>✓</i></button>)}</div><div className="preference-footer"><p className="selection-count">{selected.length}개 선택 · 최소 3개</p><button className="primary" disabled={selected.length < 3} onClick={onContinue}>{action}</button></div></section>;
}
