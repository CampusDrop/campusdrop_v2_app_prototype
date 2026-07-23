"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { GameHeader } from "../GameHeader";

export function GameReadyScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [ready, setReady] = useState(false);
  const canStart = state.checkedIn || state.completed;
  return (
    <div className="game-screen ready-screen"><GameHeader step={0} label="게임 준비" time="60:00" /><div className="game-body"><div className="mission-emblem">🔑</div><p className="eyebrow">MISSION BRIEFING</p><h1>사라진 총장의<br />열쇠를 찾아라</h1><p>제한 시간 60분 안에 캠퍼스 곳곳의 단서를 모아 마지막 암호를 풀어 주세요.</p><div className="permission-list"><div><span>⌖</span><p><b>위치 권한</b><small>목적지 도착 확인에 사용</small></p><i>시연 모드</i></div><div><span>▣</span><p><b>카메라 권한</b><small>AR 단서 탐색에 사용</small></p><i>대체 화면</i></div></div><div className="ready-members"><b>팀원 준비 상태</b><div>{["🐈", "🐻", "🫘", "🧭"].map((emoji, index) => <span key={emoji} data-ready={ready || index < 3}>{emoji}<i>{ready || index < 3 ? "✓" : "…"}</i></span>)}</div></div></div><div className="game-footer">{ready ? <button className="primary" onClick={() => router.push("/play/key-session/location")}>미션 시작</button> : <button className="primary" disabled={!canStart} onClick={() => setReady(true)}>{canStart ? "준비 완료" : "체크인이 필요해요"}</button>}</div></div>
  );
}

export function LocationMissionScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "checking" | "failed" | "arrived">("idle");
  function check() { setStatus("checking"); window.setTimeout(() => setStatus("arrived"), 1000); }
  return (
    <div className="game-screen location-screen"><GameHeader step={1} label="GPS 미션" /><div className="game-body"><p className="mission-kicker">첫 번째 목적지</p><div className="compass"><i /><span>↑</span><b>{status === "arrived" ? "도착!" : "북동쪽"}</b><small>{status === "arrived" ? "목적지 범위 안에 있어요" : "현재 위치에서 약 180m"}</small></div><div className="direction-card"><span>🏛️</span><p><b>큰 계단과 유리 벽이 있는 건물</b><small>정확한 장소명은 도착 후 공개됩니다.</small></p></div>{status === "failed" && <div className="error-card">위치를 확인하지 못했어요. 건물 입구의 QR로 대신 인증할 수 있어요.</div>}{status === "arrived" && <div className="success-card">✓ 대양AI센터에 도착했어요!</div>}</div><div className="game-footer">{status === "arrived" ? <button className="primary" onClick={() => router.push("/play/key-session/ar")}>AR 단서 찾기</button> : <><button className="primary" disabled={status === "checking"} onClick={check}>{status === "checking" ? "위치를 확인하는 중…" : "위치 확인"}</button><button className="text-button" onClick={() => setStatus("failed")}>QR 대체 인증</button></>}</div></div>
  );
}
