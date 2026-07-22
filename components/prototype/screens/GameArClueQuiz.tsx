"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../DemoProvider";
import { GameHeader } from "../GameHeader";
import { Progress } from "../ui";

export function ArMissionScreen() {
  const router = useRouter();
  const [found, setFound] = useState(0);
  const complete = found >= 3;
  return (
    <div className="game-screen ar-screen"><GameHeader step={2} label="AR 미션" /><div className="camera-view"><div className="scan-line" /><div className="camera-grid" /><p>주변을 천천히 둘러보세요</p><button className="ar-object" data-found={complete} onClick={() => setFound((value) => Math.min(3, value + 1))}>🔮<i>{found}/3</i></button><div className="ar-progress"><b>{complete ? "숨겨진 열쇠 조각 발견!" : "빛나는 물체를 눌러 보세요"}</b><Progress value={found} max={3} /></div></div><div className="game-footer on-camera">{complete ? <button className="primary" onClick={() => router.push("/play/key-session/team-clue")}>단서 확인</button> : <button className="secondary" onClick={() => setFound(3)}>AR 미지원 · 2D 미션으로 완료</button>}</div></div>
  );
}

const clues = [
  ["나의 단서", "책이 가득한 방에서 숫자 4를 찾았다", "📚 ④"],
  ["미로냥의 단서", "시계는 자정을 가리키고 있었다", "🕛 ⓪"],
  ["사진곰의 단서", "마지막 문에는 두 개의 원이 그려져 있었다", "◯◯ ④"],
];

export function TeamClueScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(1);
  return (
    <div className="game-screen clue-screen"><GameHeader step={3} label="협동 단서" /><div className="game-body"><p className="mission-kicker">각자 다른 단서를 받았어요</p><h1>팀원에게 설명하고<br />하나의 암호로 조합하세요</h1><div className="clue-stack">{clues.slice(0, visible).map(([owner, text, symbol], index) => <article key={owner} data-current={index === 0}><small>{owner}</small><strong>{symbol}</strong><p>{text}</p>{index === 0 && <i>이 화면은 나에게만 보여요</i>}</article>)}</div>{visible < clues.length && <button className="secondary full-button" onClick={() => setVisible(visible + 1)}>팀원 단서 확인 ({visible}/{clues.length})</button>}</div><div className="game-footer"><button className="primary" disabled={visible < clues.length} onClick={() => router.push("/play/key-session/quiz")}>암호 입력하기</button></div></div>
  );
}

export function QuizMissionScreen() {
  const router = useRouter();
  const { completeGame } = useDemo();
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hint, setHint] = useState(0);
  function submit() { if (answer.trim() === "404") { completeGame(); router.push("/play/key-session/result"); } else setWrong(true); }
  return (
    <div className={`game-screen quiz-screen ${wrong ? "shake" : ""}`}><GameHeader step={4} label="최종 퀴즈" /><div className="game-body"><p className="mission-kicker">FINAL MISSION</p><h1>세 단서가 가리키는<br />강의실 번호는?</h1><div className="quiz-symbols"><span>📚 ④</span><span>＋</span><span>🕛 ⓪</span><span>＋</span><span>◯◯ ④</span></div><label>정답<input inputMode="numeric" value={answer} onChange={(event) => { setAnswer(event.target.value); setWrong(false); }} placeholder="숫자 3자리" /></label>{wrong && <p className="wrong-message">아직 열쇠가 돌아가지 않아요. 단서를 다시 조합해 보세요.</p>}{hint > 0 && <div className="hint-card"><b>힌트 {hint}</b><p>{hint === 1 ? "세 단서의 숫자를 순서대로 읽어 보세요." : "정답은 존재하지 않는 강의실 번호예요."}</p></div>}<button className="text-button" onClick={() => setHint(Math.min(2, hint + 1))}>힌트 보기 ({hint}/2)</button></div><div className="game-footer"><button className="primary" disabled={!answer} onClick={submit}>정답 제출</button></div></div>
  );
}
