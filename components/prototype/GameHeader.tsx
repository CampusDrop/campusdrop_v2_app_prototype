"use client";

import { useRouter } from "next/navigation";
import { Progress } from "./ui";

export function GameHeader({ step, label, time = "48:21" }: { step: number; label: string; time?: string }) {
  const router = useRouter();
  return <header className="game-header"><div><button onClick={() => router.push("/expeditions/key-friday/chat")}>×</button><p><small>사라진 총장의 열쇠</small><b>{label}</b></p><time>{time}</time></div><Progress value={step} max={5} /><small>{step} / 5 미션</small></header>;
}
