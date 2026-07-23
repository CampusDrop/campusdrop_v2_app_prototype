"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { expeditions } from "@/lib/prototype/data";
import { useDemo } from "../DemoProvider";
import { ExpeditionCard } from "../cards";
import { StateGate } from "../ui";

export function ExpeditionListScreen() {
  const router = useRouter();
  const { state } = useDemo();
  const [tab, setTab] = useState("참여 가능");
  const list = tab === "참여 가능" ? expeditions : tab === "내 탐험대" && state.joined ? [expeditions[0]] : [];
  return (
    <div className="screen">
      <section className="screen-intro"><p className="eyebrow">FIND YOUR CREW</p><h1>함께할 탐사원을<br />찾아보세요</h1></section>
      <div className="wide-tabs">{["참여 가능", "내 탐험대", "완료"].map((item) => <button key={item} data-active={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "참여 가능" && <div className="matching-notice">✨ 내 프로필과 탐험대 구성 조건에 맞는 모집만 표시됩니다.</div>}
      <StateGate empty="현재 참여 가능한 탐험대가 없어요. 새로운 모집이 생기면 다시 확인해 주세요."><div className="expedition-list">{list.map((expedition) => <ExpeditionCard key={expedition.id} expedition={expedition} />)}{list.length === 0 && <div className="state-card"><b>○</b><h3>아직 탐험 기록이 없어요</h3><p>새로운 탐험대를 찾아보세요.</p></div>}</div></StateGate>
      <button className="floating-create" onClick={() => state.license ? router.push("/expeditions/new") : router.push("/my/license")}>＋ 탐험대 만들기</button>
    </div>
  );
}
