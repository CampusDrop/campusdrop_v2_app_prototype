"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { useQrScanner } from "../useQrScanner";

type Phase = "scan" | "found" | "sent";

export function FriendQrScanScreen() {
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const [phase, setPhase] = useState<Phase>("scan");
  const [scannedCode, setScannedCode] = useState("");
  const { videoRef, status, start, stop } = useQrScanner((code) => {
    setScannedCode(code);
    setPhase("found");
  });

  function showDemoProfile() {
    stop();
    setScannedCode("campusdrop://friend/mirocat");
    setPhase("found");
  }

  function addFriend() {
    update({ friends: [...new Set([...state.friends, "미로냥"])] });
    notify("QR 친구 추가가 완료됐어요");
    setPhase("sent");
  }

  if (phase === "found") return (
    <div className="screen qr-result-screen">
      <div className="qr-success-mark">✓</div>
      <p className="eyebrow">QR PROFILE FOUND</p>
      <h1>친구를 찾았어요</h1>
      <article className="qr-profile-card">
        <span>🐈</span><div><h2>미로냥</h2><p>세종대학교 인증 · 완료 테마 4개</p></div>
      </article>
      <p className="qr-code-note">CampusDrop 친구 QR · {scannedCode.slice(-12)}</p>
      <div className="qr-actions"><button className="primary" onClick={addFriend}>이 친구 추가하기</button><button className="secondary" onClick={() => setPhase("scan")}>다시 스캔</button></div>
    </div>
  );

  if (phase === "sent") return (
    <div className="center-screen qr-complete-screen">
      <div className="qr-success-mark">✓</div><h1>친구가 추가됐어요!</h1><p>미로냥과 함께 새로운 캠퍼스 탐험을 시작해 보세요.</p>
      <button className="primary" onClick={() => router.push("/friends")}>친구 목록 보기</button>
    </div>
  );

  const statusText = status === "scanning" ? "QR을 찾고 있어요" : status === "starting" ? "카메라를 여는 중이에요" : status === "denied" ? "카메라 권한이 필요해요" : status === "unsupported" ? "이 브라우저는 자동 인식을 지원하지 않아요" : "카메라를 켜고 QR을 맞춰 주세요";
  return (
    <div className="screen qr-scan-screen">
      <div className="qr-intro"><p className="eyebrow">ADD FRIEND</p><h1>친구의 QR을<br />스캔해 주세요</h1><p>QR을 인식한 뒤 프로필을 확인해야만 친구로 추가할 수 있어요.</p></div>
      <div className="qr-camera" data-active={status === "scanning" || status === "unsupported"}>
        <video ref={videoRef} muted playsInline aria-label="QR 스캔 카메라" />
        <div className="qr-camera-placeholder">▦</div><div className="qr-frame"><i /></div>
      </div>
      <p className="qr-status"><span data-live={status === "scanning"} />{statusText}</p>
      <div className="qr-actions"><button className="primary" onClick={start}>{status === "denied" ? "권한 다시 요청" : "카메라로 QR 스캔"}</button><button className="secondary" onClick={showDemoProfile}>시연용 QR 인식</button></div>
      <small className="qr-privacy">카메라 영상은 저장하거나 전송하지 않아요.</small>
    </div>
  );
}
