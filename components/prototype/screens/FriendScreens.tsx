"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { Modal, StateGate } from "../ui";

export function FriendListScreen() {
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("");
  const friends = state.friends.filter((name) => name.includes(query));
  return <div className="screen"><button className="qr-add-banner" onClick={() => router.push("/friends/scan")}><span>▦</span><p><b>QR로 친구 추가</b><small>친구의 QR을 스캔해야 추가할 수 있어요</small></p><i>›</i></button><label className="search-field">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="내 친구 검색" /></label><button className="request-banner" onClick={() => router.push("/friends/requests")}><span>💌</span><p><b>받은 친구 요청 2개</b><small>새로운 탐사원이 기다리고 있어요</small></p><i>›</i></button><section className="content-section"><div className="section-title"><h2>최근 함께한 탐사원</h2></div><div className="recent-friends">{["미로냥", "사진곰", "카페콩"].map((name, index) => <button key={name} onClick={() => notify(`${name} 프로필을 열었어요`)}><span>{["🐈", "🐻", "🫘"][index]}</span><small>{name}</small></button>)}</div></section><section className="content-section"><div className="section-title"><h2>전체 친구</h2><small>{friends.length}명</small></div><StateGate empty="QR을 스캔해 첫 친구를 추가해 보세요"><div className="friend-list">{friends.map((name, index) => <div key={name}><span>{["🦊", "🐈", "🐻", "🫘"][index % 4]}</span><p><b>{name}</b><small>최근 활동 2일 전</small></p><button onClick={() => setTarget(name)}>⋯</button></div>)}</div></StateGate></section>{target && <Modal title={target} onClose={() => setTarget("")}><div className="menu-list"><button onClick={() => { update({ friends: state.friends.filter((name) => name !== target) }); setTarget(""); }}>친구 삭제</button><button className="danger-text" onClick={() => router.push("/report")}>차단·신고</button></div></Modal>}</div>;
}

export function FriendRequestsScreen() {
  const { state, update, notify } = useDemo();
  const [tab, setTab] = useState("받은 요청");
  const [requests, setRequests] = useState(["도서관유령", "운동장토끼"]);
  function accept(name: string) { update({ friends: [...new Set([...state.friends, name])] }); setRequests(requests.filter((item) => item !== name)); notify("친구 요청을 수락했어요"); }
  return <div className="screen"><div className="wide-tabs"><button data-active={tab === "받은 요청"} onClick={() => setTab("받은 요청")}>받은 요청</button><button data-active={tab === "보낸 요청"} onClick={() => setTab("보낸 요청")}>보낸 요청</button></div>{tab === "받은 요청" ? <div className="request-list">{requests.map((name, index) => <div key={name}><span>{index ? "🐇" : "👻"}</span><p><b>{name}</b><small>함께한 테마 1개</small></p><button className="small-secondary" onClick={() => setRequests(requests.filter((item) => item !== name))}>거절</button><button className="small-primary" onClick={() => accept(name)}>수락</button></div>)}</div> : <div className="state-card"><b>▦</b><h3>보낸 요청이 없어요</h3><p>친구의 QR을 스캔하면 요청을 보낼 수 있어요.</p></div>}</div>;
}
