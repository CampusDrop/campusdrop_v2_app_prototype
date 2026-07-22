"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { translate } from "@/lib/prototype/i18n";
import { useDemo } from "./DemoProvider";

const titleByPath: Record<string, string> = {
  "/themes": "테마",
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
  const topTabs = ["/home", "/themes", "/expeditions", "/friends", "/my"];
  const title = titleByPath[pathname] ?? (pathname.includes("/chat") ? "임시 채팅방" : pathname.includes("/meetup") ? "약속·체크인" : pathname.startsWith("/themes/") ? "테마 상세" : pathname.startsWith("/expeditions/") ? "탐험대 상세" : pathname.startsWith("/rewards/") ? "쿠폰 상세" : "CampusDrop");
  const showBack = !onboarding && !topTabs.includes(pathname) && !game;
  const nav = [
    ["/home", "⌂", translate(state.language, "home")],
    ["/themes", "◇", translate(state.language, "themes")],
    ["/expeditions", "♙", translate(state.language, "expeditions")],
    ["/friends", "♧", translate(state.language, "friends")],
    ["/my", "●", translate(state.language, "my")],
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
            {nav.map(([path, icon, label]) => (
              <button key={path} data-active={pathname === path || (path !== "/home" && pathname.startsWith(`${path}/`))} onClick={() => router.push(path)}>
                <span>{icon}</span><small>{label}</small>
              </button>
            ))}
          </nav>
        )}
        {toast && <div className="prototype-toast" aria-live="polite">{toast}</div>}
      </div>
    </div>
  );
}
