"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { teamMembers } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { Modal } from "../ui";

export function ChatScreen() {
  const router = useRouter();
  const { state, update } = useDemo();
  const [message, setMessage] = useState("");
  const [menu, setMenu] = useState(false);
  function send() { if (!message.trim()) return; update({ messages: [...state.messages, message.trim()] }); setMessage(""); }
  return (
    <div className="chat-screen"><button className="chat-meetup" onClick={() => router.push("/expeditions/key-friday/meetup")}><span>📍</span><div><small>7월 24일 금요일 · 오후 6:30</small><b>제주몰빵 세종대점에서 만나요</b></div><i>›</i></button><div className="chat-actions"><button onClick={() => router.push("/expeditions/key-friday/meetup")}>약속 보기</button><button onClick={() => setMenu(true)}>팀원·신고</button></div>{state.completed && <div className="closing-banner">탐험 완료 · 채팅 종료까지 23시간 42분</div>}<div className="messages"><div className="day-divider">7월 22일 수요일</div>{state.messages.map((item, index) => <div key={`${item}-${index}`} className={index > 1 ? "message mine" : "message"}>{index <= 1 && <span>{teamMembers[index].avatar}</span>}<p>{item}<small>{index > 1 ? "방금" : index ? "오후 2:15" : "오후 2:12"}</small></p></div>)}</div><div className="chat-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="메시지를 입력하세요" /><button onClick={send}>↑</button></div>{menu && <Modal title="탐험대 메뉴" onClose={() => setMenu(false)}><div className="menu-list"><button onClick={() => setMenu(false)}>👥 팀원 보기</button><button onClick={() => router.push("/report")}>⚑ 신고·차단</button></div></Modal>}</div>
  );
}

export function MeetupScreen() {
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const [locating, setLocating] = useState(false);
  function checkLocation() { setLocating(true); window.setTimeout(() => { setLocating(false); update({ checkedIn: true }); notify("제주몰빵 도착을 확인했어요"); }, 900); }
  return (
    <div className="screen meetup-screen"><div className="map-card"><div className="map-grid" /><span className="map-pin">D</span><div><b>제주몰빵 세종대점</b><small>서울 광진구 능동로 209 · 학생회관 앞</small></div></div><section className="meeting-time"><small>약속 시간</small><h1>7월 24일 금요일<br />오후 6:30</h1><p>체크인은 약속 30분 전부터 가능해요.</p></section><section className="checkin-list"><h2>참가자 체크인</h2>{teamMembers.concat([{ name: "세종탐험가", avatar: "🧭", completed: 0, interest: "" }]).map((member, index) => <div key={member.name}><span>{member.avatar}</span><b>{member.name}</b><i data-ready={index < 3 || state.checkedIn}>{index < 3 || state.checkedIn ? "도착" : "이동 중"}</i></div>)}</section><div className="sticky-actions vertical"><button className="secondary" disabled={state.checkedIn || locating} onClick={checkLocation}>{locating ? "위치를 확인하는 중…" : state.checkedIn ? "도착 확인 완료" : "현재 위치 확인"}</button><button className="primary" disabled={!state.checkedIn} onClick={() => router.push("/play/key-session")}>방탈출 시작</button></div></div>
  );
}
