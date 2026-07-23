"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { communityPosts, themes } from "@/lib/prototype/data";
import type { CommunityPost } from "@/lib/prototype/types";
import { useDemo } from "../DemoProvider";
import { Tag } from "../ui";

function canEnterTheme(themeId: string, completed: boolean) {
  return completed && themeId === "missing-key";
}

export function CommunityHomeScreen() {
  const router = useRouter();
  const { state, notify } = useDemo();
  return (
    <div className="screen community-home">
      <section className="community-intro"><p className="eyebrow">CAMPUS LOUNGE</p><h1>같이 푼 사람들과<br />다음 이야기를 나눠요</h1><p>일반 게시판은 모두에게 열려 있고, 테마방은 직접 완료한 탐사원만 입장할 수 있어요.</p></section>
      <button className="general-room-card" onClick={() => router.push("/community/general")}><span>☕</span><div><Tag tone="mint">누구나 입장</Tag><h2>캠퍼스 라운지</h2><p>탐험대 모집, 학교 생활, 자유로운 이야기</p></div><i>›</i></button>
      <section className="content-section"><div className="section-title"><div><p className="eyebrow">THEME ROOMS</p><h2>테마별 비밀방</h2></div><button onClick={() => router.push("/my/completed")}>완료 기록</button></div><div className="theme-room-list">{themes.map((theme) => {
        const open = canEnterTheme(theme.id, state.completed);
        return <button key={theme.id} data-locked={!open} onClick={() => open ? router.push(`/community/themes/${theme.id}`) : notify("테마를 완료하면 비밀방이 열려요")}><span style={{ "--room-color": theme.color } as React.CSSProperties}>{theme.emoji}</span><div><b>{theme.title}</b><small>{open ? "완료 인증됨 · 입장 가능" : "완료한 탐사원만 입장"}</small></div><i>{open ? "›" : "🔒"}</i></button>;
      })}</div></section>
      <button className="friends-shortcut" onClick={() => router.push("/friends")}><span>♧</span><p><b>내 친구 보기</b><small>QR로 추가한 친구와 다시 탐험해요</small></p><i>›</i></button>
    </div>
  );
}

export function GeneralCommunityScreen() {
  return <CommunityFeed scope="general" title="캠퍼스 라운지" description="학교와 탐험에 관한 이야기를 자유롭게 나눠요." />;
}

export function ThemeCommunityScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useDemo();
  const themeId = pathname.split("/").at(-1) ?? "";
  const theme = themes.find((item) => item.id === themeId) ?? themes[0];
  if (!canEnterTheme(theme.id, state.completed)) {
    return <div className="center-screen community-lock"><b>🔒</b><Tag>완료 인증 필요</Tag><h1>{theme.title}<br />비밀방이에요</h1><p>스포일러로부터 탐험 경험을 보호하기 위해 테마를 완료한 사용자만 입장할 수 있어요.</p><button className="primary" onClick={() => router.push(`/themes/${theme.id}`)}>이 테마 도전하기</button><button className="text-button" onClick={() => router.push("/community")}>다른 커뮤니티 보기</button></div>;
  }
  return <CommunityFeed scope={theme.id} title={`${theme.emoji} ${theme.title}`} description="이 테마를 완료한 탐사원만 볼 수 있는 비밀방이에요." themed />;
}

function CommunityFeed({ scope, title, description, themed = false }: { scope: string; title: string; description: string; themed?: boolean }) {
  const { state, update, notify } = useDemo();
  const [draft, setDraft] = useState("");
  const posts = [...state.communityPosts, ...communityPosts].filter((post) => post.scope === scope);
  function submit() {
    const post: CommunityPost = { id: `my-post-${Date.now()}`, scope, author: state.nickname, content: draft.trim(), likes: 0, createdAt: "방금 전" };
    update({ communityPosts: [post, ...state.communityPosts] });
    setDraft("");
    notify("게시글을 등록했어요");
  }
  return (
    <div className="screen community-feed">
      <section className={`community-room-head ${themed ? "themed" : ""}`}><div>{themed && <Tag tone="mint">✓ 완료한 탐사원 전용</Tag>}<h1>{title}</h1><p>{description}</p></div><span>{themed ? "🔐" : "☕"}</span></section>
      <section className="post-composer"><textarea rows={3} maxLength={220} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={themed ? "완료한 사람들과 이야기해 보세요." : "탐험대 모집이나 캠퍼스 이야기를 남겨 보세요."} /><div><small>{draft.length}/220</small><button className="small-primary" disabled={draft.trim().length < 5} onClick={submit}>등록</button></div></section>
      <div className="post-list">{posts.map((post) => <article key={post.id}><header><span>🧭</span><p><b>{post.author}</b><small>{post.createdAt}</small></p><button aria-label="게시글 메뉴">···</button></header><p>{post.content}</p><footer><button onClick={() => notify("공감했어요")}>♡ 공감 {post.likes}</button><button onClick={() => notify("댓글 기능은 다음 단계에서 연결돼요")}>말풍선 댓글</button></footer></article>)}</div>
    </div>
  );
}
