"use client";

import { useRouter } from "next/navigation";
import type { Expedition, Theme } from "@/lib/prototype/types";
import { Tag } from "./ui";

export function ThemeCard({ theme, compact = false }: { theme: Theme; compact?: boolean }) {
  const router = useRouter();
  return (
    <button className={`theme-card ${compact ? "compact" : ""}`} onClick={() => router.push(`/themes/${theme.id}`)}>
      <div className="theme-art" style={{ "--theme-color": theme.color } as React.CSSProperties}><span>{theme.emoji}</span>{theme.locked && <i>🔒 22:00 공개</i>}</div>
      <div className="theme-copy"><div><Tag tone={theme.locked ? "neutral" : "brand"}>{theme.locked ? "심야" : "지금 가능"}</Tag><Tag>{theme.difficulty}</Tag></div><h3>{theme.title}</h3><p>{theme.subtitle}</p><small>{theme.duration} · {theme.capacity} · {theme.schedule}</small></div>
    </button>
  );
}

export function ExpeditionCard({ expedition }: { expedition: Expedition }) {
  const router = useRouter();
  return (
    <button className="expedition-card" onClick={() => router.push(`/expeditions/${expedition.id}`)}>
      <div className="expedition-top"><Tag tone="mint">{expedition.members}/{expedition.capacity}명</Tag><small>{expedition.date}</small></div><h3>{expedition.title}</h3><p>📍 {expedition.cafe}</p><div className="member-row"><span>🐈</span><span>🐻</span><span>🫘</span><i>＋</i><small>공통 관심사 {expedition.interests.slice(0, 2).join(" · ")}</small></div>
    </button>
  );
}
