"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useDemo } from "./DemoProvider";

export function BrandLogo({ className = "", withName = false }: { className?: string; withName?: boolean }) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-label="CampusDrop">
      {withName ? (
        <Image
          className="brand-logo-wordmark"
          src={`${import.meta.env.BASE_URL}brand/campusdrop-typo.png`}
          alt=""
          width={812}
          height={179}
          priority
          unoptimized
        />
      ) : (
        <Image
          className="brand-logo-mark"
          src={`${import.meta.env.BASE_URL}brand/campusdrop-logo.png`}
          alt=""
          width={116}
          height={159}
          priority
          unoptimized
        />
      )}
    </span>
  );
}

export function Progress({ value, max = 100 }: { value: number; max?: number }) {
  return <div className="progress" aria-label={`${value} / ${max}`}><span style={{ width: `${Math.min(100, value / max * 100)}%` }} /></div>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="modal-handle" /><h2>{title}</h2>{children}
      </section>
    </div>
  );
}

export function StateGate({ children, empty = "표시할 내용이 없어요" }: { children: ReactNode; empty?: string }) {
  const { state } = useDemo();
  if (state.demoView === "normal") return children;
  const states = {
    loading: ["불러오는 중이에요", "잠시만 기다려 주세요", "◌"],
    empty: [empty, "새로운 소식이 생기면 여기에 표시돼요", "○"],
    error: ["일시적인 문제가 생겼어요", "잠시 후 다시 시도해 주세요", "!"],
    offline: ["인터넷 연결이 끊겼어요", "연결을 확인한 뒤 다시 시도해 주세요", "⌁"],
    denied: ["접근 권한이 없어요", "현재 계정으로는 이 화면을 볼 수 없어요", "⊘"],
  } as const;
  const [title, description, icon] = states[state.demoView];
  return <div className="state-card"><b>{icon}</b><h3>{title}</h3><p>{description}</p></div>;
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "mint" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}
