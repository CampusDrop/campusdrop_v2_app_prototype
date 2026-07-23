"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { translate } from "@/lib/prototype/i18n";
import { useDemo } from "./DemoProvider";

const titleByPath: Record<string, string> = {
  "/themes": "테마",
  "/community": "커뮤니티",
  "/community/general": "캠퍼스 라운지",
  "/expeditions": "탐험대",
  "/expeditions/new": "탐험대 만들기",
  "/friends": "친구",
  "/friends/requests": "친구 요청",
  "/friends/scan": "QR로 친구 추가",
  "/my": "MY",
  "/my/completed": "완료한 테마",
  "/my/level": "레벨·경험치",
  "/my/license": "탐사 라이선스",
  "/rewards": "쿠폰",
  "/settings": "설정",
  "/report": "신고·차단",
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toast } = useDemo();
  const onboarding = pathname === "/" || pathname.startsWith("/onboarding") || pathname.startsWith("/auth") || pathname.startsWith("/verification") || pathname.startsWith("/profile/");
  const game = pathname.startsWith("/play/");
  const topTabs = ["/home", "/themes", "/expeditions", "/community", "/my"];
  const title = titleByPath[pathname] ?? (pathname.endsWith("/reviews/new") ? "리뷰 작성" : pathname.endsWith("/reviews") ? "테마 리뷰" : pathname.startsWith("/community/themes/") ? "테마 비밀방" : pathname.includes("/chat") ? "임시 채팅방" : pathname.includes("/meetup") ? "약속·체크인" : pathname.startsWith("/themes/") ? "테마 상세" : pathname.startsWith("/expeditions/") ? "탐험대 상세" : pathname.startsWith("/rewards/") ? "쿠폰 상세" : "CampusDrop");
  const showBack = !onboarding && !topTabs.includes(pathname) && !game;
  const nav = [
    { path: "/home", icon: "⌂", label: translate(state.language, "home") },
    { path: "/themes", icon: "◇", label: translate(state.language, "themes") },
    { path: "/expeditions", icon: "⌖", label: translate(state.language, "expeditions"), primary: true },
    { path: "/community", icon: "♧", label: translate(state.language, "community") },
    { path: "/my", icon: "●", label: translate(state.language, "my") },
  ];

  return (
    <div className="prototype-stage">
      <div className={`app-frame ${game ? "game-mode" : ""}`}>
        {!onboarding && !game && (
          <header className="app-header">
            {showBack ? <button className="round-button" onClick={() => router.back()} aria-label="뒤로가기">‹</button> : <span className="mini-brand">CampusDrop</span>}
            <strong>{showBack ? title : ""}</strong>
            <button className="round-button" onClick={() => router.push("/settings")} aria-label="설정">⋯</button>
          </header>
        )}
        <main className="app-content">{children}</main>
        {!onboarding && !game && (
          <nav className="tab-bar" aria-label="주요 탭">
            {nav.map(({ path, icon, label, primary }) => {
              const active = pathname === path || (path !== "/home" && pathname.startsWith(`${path}/`));
              return <button key={path} data-active={active} data-primary={primary || undefined} aria-current={active ? "page" : undefined} onClick={() => router.push(path)}>
                <span>{icon}</span><small>{label}</small>
              </button>
            })}
          </nav>
        )}
        {toast && <div className="prototype-toast" aria-live="polite">{toast}</div>}
      </div>
    </div>
  );
}
