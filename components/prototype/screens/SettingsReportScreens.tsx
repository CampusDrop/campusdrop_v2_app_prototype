"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { languageOptions } from "@/lib/prototype/i18n";
import type { DemoView } from "@/lib/prototype/types";
import { useDemo } from "../DemoProvider";
import { Modal } from "../ui";

export function SettingsScreen() {
  const router = useRouter();
  const { state, update, reset, notify } = useDemo();
  const [language, setLanguage] = useState(false);
  const [demo, setDemo] = useState(false);
  const menu = [["언어", "language"], ["알림", "notify"], ["위치·카메라 권한", "permission"], ["이용약관", "terms"], ["개인정보처리방침", "privacy"], ["고객지원", "support"]];
  return <div className="screen settings-screen"><div className="settings-group">{menu.map(([label, id]) => <button key={id} onClick={() => id === "language" ? setLanguage(true) : notify(`${label} 화면은 시연용입니다`)}><b>{label}</b><span>{id === "language" ? languageOptions.find((item) => item.id === state.language)?.label : "›"}</span></button>)}</div><h2>데모 모드</h2><div className="settings-group demo-group"><button onClick={() => setDemo(true)}><b>상태 전환</b><span>{state.demoView}</span></button><button onClick={() => { update({ license: !state.license }); notify("라이선스 상태를 전환했어요"); }}><b>라이선스 보유 상태</b><span>{state.license ? "보유" : "없음"}</span></button><button className="danger-text" onClick={() => { reset(); router.push("/"); }}><b>데모 초기화</b><span>처음으로</span></button></div><button className="text-button full-button" onClick={() => router.push("/")}>로그아웃</button>{language && <Modal title="언어 선택" onClose={() => setLanguage(false)}><div className="menu-list">{languageOptions.map((item) => <button key={item.id} onClick={() => { update({ language: item.id }); setLanguage(false); }}>{item.label}<span>{state.language === item.id ? "✓" : ""}</span></button>)}</div></Modal>}{demo && <DemoStateModal onClose={() => setDemo(false)} />}</div>;
}

function DemoStateModal({ onClose }: { onClose: () => void }) {
  const { state, update } = useDemo();
  const states: [DemoView, string][] = [["normal", "정상 데이터"], ["loading", "로딩"], ["empty", "빈 상태"], ["error", "일시적 오류"], ["offline", "연결 끊김"], ["denied", "접근 권한 없음"]];
  return <Modal title="발표용 상태 전환" onClose={onClose}><div className="menu-list">{states.map(([id, label]) => <button key={id} onClick={() => { update({ demoView: id }); onClose(); }}>{label}<span>{state.demoView === id ? "✓" : ""}</span></button>)}</div></Modal>;
}

export function ReportScreen() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div className="center-screen"><span className="success-icon">✓</span><h1>신고가 접수됐어요</h1><p>접수번호 CD-20260724-018<br />검토 결과는 알림으로 안내됩니다.</p><button className="primary" onClick={() => router.back()}>돌아가기</button></div>;
  return <section className="form-screen"><div className="emergency-notice">긴급 상황은 교내 안전센터 또는 112에 직접 연락해 주세요.</div><label>신고 대상<input value="금요일 열쇠 원정대 · 미로냥" readOnly /></label><label>신고 사유<select defaultValue=""><option value="" disabled>사유를 선택해 주세요</option><option>부적절한 언행</option><option>노쇼 또는 지각</option><option>안전 수칙 위반</option><option>기타</option></select></label><label>상세 설명<textarea rows={5} placeholder="상황을 구체적으로 설명해 주세요" /></label><label className="check-row"><input type="checkbox" /> 이 사용자를 함께 차단합니다</label><button className="primary bottom-action" onClick={() => setSubmitted(true)}>신고 제출</button></section>;
}
