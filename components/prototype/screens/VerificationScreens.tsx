"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";

export function VerificationChoiceScreen() {
  const router = useRouter();
  return (
    <section className="onboarding-screen"><p className="step-label">필수 2 / 2 · 학교 인증</p><h1>세종대 학생임을<br />확인해 주세요</h1><p className="muted">계정 로그인과 학교 인증을 모두 마쳐야 앱에 입장할 수 있어요.</p><div className="verification-cards"><button onClick={() => router.push("/verification/email")}><span>✉️</span><div><b>학교 이메일로 인증</b><small>@sju.ac.kr 이메일 사용</small></div><i>›</i></button><button onClick={() => router.push("/verification/image")}><span>🪪</span><div><b>학생 인증 이미지 제출</b><small>학생증 또는 재학증명서</small></div><i>›</i></button></div><div className="notice-card">🔒 학교 인증을 건너뛸 수 없어요. 제출 이미지는 심사 후 즉시 삭제됩니다.</div></section>
  );
}

export function EmailVerificationScreen() {
  const router = useRouter();
  const { update, notify } = useDemo();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  function verify() { update({ verified: true }); notify("학교 인증이 완료됐어요"); router.push("/profile/setup"); }
  return (
    <section className="form-screen"><h1>학교 이메일 인증</h1><p className="muted">세종대학교 이메일로 인증 코드를 받아 주세요.</p><label>학교 이메일<div className="inline-input"><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@sju.ac.kr" /><button onClick={() => setSent(true)} disabled={!email.includes("@")}>전송</button></div></label>{sent && <><label>6자리 인증 코드<input inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} placeholder="000000" /></label><button className="text-button" onClick={() => setCode("240724")}>시연용 코드 자동 입력: 240724</button></>}<button className="primary bottom-action" disabled={code.length !== 6} onClick={verify}>인증 완료</button></section>
  );
}

export function ImageVerificationScreen() {
  const router = useRouter();
  const { update, notify } = useDemo();
  const [selected, setSelected] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  function approve() { update({ verified: true }); notify("학생 인증이 승인됐어요"); router.push("/profile/setup"); }
  return (
    <section className="form-screen"><h1>학생 인증 이미지</h1><p className="muted">학교명과 이름만 확인하며 실제 파일은 전송되지 않아요.</p><label className="upload-card"><span>{selected ? "✅" : "＋"}</span><b>{selected ? "이미지가 선택됐어요" : "학생증 또는 재학증명서 선택"}</b><input type="file" accept="image/*" onChange={() => setSelected(true)} /></label>{reviewing ? <div className="review-card"><span>◌</span><b>검토 중</b><p>시연에서는 아래 버튼으로 승인 상태를 확인할 수 있어요.</p><button className="primary" onClick={approve}>심사 결과 확인</button></div> : <button className="primary bottom-action" disabled={!selected} onClick={() => setReviewing(true)}>제출하기</button>}</section>
  );
}
