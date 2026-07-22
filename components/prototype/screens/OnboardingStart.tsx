"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { languageOptions, translate } from "@/lib/prototype/i18n";
import { useDemo } from "../DemoProvider";
import { Modal } from "../ui";

export function SplashScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  useEffect(() => { if (state.hydrated && state.onboarded) router.replace("/home"); }, [router, state.hydrated, state.onboarded]);
  if (!state.hydrated) return <div className="center-screen"><div className="logo-orbit">D</div><p>캠퍼스를 불러오는 중…</p></div>;
  return (
    <div className="splash-screen">
      <div className="splash-art"><span>🔑</span><span>🏫</span><span>🧩</span></div>
      <div><p className="eyebrow">CAMPUS ESCAPE ADVENTURE</p><h1>Campus<br />Drop</h1><p>캠퍼스가 게임판이 됩니다.<br />함께 해결하고, 새로운 친구를 만나보세요.</p></div>
      <div className="stack-actions"><button className="primary" onClick={() => router.push("/onboarding/language")}>처음부터 시작</button><button className="secondary" onClick={() => { update({ onboarded: true, verified: true, interests: ["카페", "게임", "사진", "여행"] }); router.push("/home"); }}>핵심 시연 바로 시작</button></div>
    </div>
  );
}

export function LanguageScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  return (
    <section className="onboarding-screen"><p className="step-label">1 / 4</p><h1>사용할 언어를<br />선택해 주세요</h1><p className="muted">설정에서 언제든 변경할 수 있어요.</p>
      <div className="choice-grid">{languageOptions.map((language) => <button key={language.id} data-selected={state.language === language.id} onClick={() => update({ language: language.id })}><b>{language.label}</b><span>{language.sample}</span></button>)}</div>
      <button className="primary bottom-action" onClick={() => router.push("/onboarding/intro")}>{translate(state.language, "continue")}</button>
    </section>
  );
}

const introSlides = [
  ["🗺️", "캠퍼스가 게임판이 됩니다", "익숙한 캠퍼스 곳곳이 미션과 단서가 가득한 탐험 공간으로 바뀌어요."],
  ["🤝", "함께 해결하며 친해져요", "나와 잘 맞는 탐사원들과 단서를 나누고 문제를 해결해 보세요."],
  ["🎁", "완료하고 혜택을 받아요", "테마를 완주하면 경험치와 캠퍼스 제휴 쿠폰을 받을 수 있어요."],
];

export function IntroScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [emoji, title, description] = introSlides[index];
  return (
    <section className="intro-screen"><button className="text-button intro-skip" onClick={() => router.push("/auth")}>건너뛰기</button><div className="intro-visual"><span>{emoji}</span><i /><i /></div><div><p className="step-label">{index + 1} / 3</p><h1>{title}</h1><p className="muted">{description}</p></div>
      <button className="primary bottom-action" onClick={() => index < 2 ? setIndex(index + 1) : router.push("/auth")}>{index < 2 ? "다음" : "시작하기"}</button>
    </section>
  );
}

export function AuthScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [terms, setTerms] = useState(false);
  return (
    <section className="onboarding-screen auth-screen"><div className="auth-logo">D</div><h1>반가워요!</h1><p className="muted">학교 인증 후 캠퍼스 탐험을 시작해 보세요.</p><button className="primary social-button" onClick={() => router.push("/verification")}>{translate(state.language, "start")}</button><div className="divider"><span>또는</span></div><button className="secondary">Apple로 계속</button><button className="secondary">Google로 계속</button><p className="legal">계속하면 <button onClick={() => setTerms(true)}>이용약관 및 개인정보처리방침</button>에 동의하게 됩니다.</p>
      {terms && <Modal title="약관 요약" onClose={() => setTerms(false)}><p className="muted">프로토타입은 실제 개인정보를 저장하거나 외부로 전송하지 않습니다.</p><button className="primary" onClick={() => setTerms(false)}>확인</button></Modal>}
    </section>
  );
}
