"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { themeReviews, themes } from "@/lib/prototype/data";
import type { ThemeReview } from "@/lib/prototype/types";
import { useDemo } from "../DemoProvider";
import { Tag } from "../ui";

function useCurrentTheme() {
  const pathname = usePathname();
  const themeId = pathname.split("/")[2];
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}

export function ReviewListScreen() {
  const theme = useCurrentTheme();
  const router = useRouter();
  const { state } = useDemo();
  const [revealed, setRevealed] = useState<string[]>([]);
  const reviews = [...state.reviews, ...themeReviews].filter((review) => review.themeId === theme.id);
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return (
    <div className="screen review-screen">
      <section className="review-summary">
        <div><span>{theme.emoji}</span><p><small>{theme.title}</small><b>{average.toFixed(1)}</b><i>{"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}</i></p></div>
        <small>{reviews.length}명의 탐사원이 남긴 스포일러 보호 리뷰</small>
        {state.completed && theme.id === "missing-key" && <button className="primary" onClick={() => router.push(`/themes/${theme.id}/reviews/new`)}>{state.reviews.some((review) => review.themeId === theme.id) ? "내 리뷰 수정하기" : "리뷰 남기기"}</button>}
      </section>
      <div className="review-list">
        {reviews.map((review) => {
          const hidden = review.spoiler && !revealed.includes(review.id);
          return <article className="review-card" key={review.id}><header><span>🧭</span><p><b>{review.author}</b><small>{review.createdAt}</small></p><strong aria-label={`별점 ${review.rating}점`}>{"★".repeat(review.rating)}</strong></header><p data-hidden={hidden}>{hidden ? "이 리뷰에는 테마의 스포일러가 포함되어 있어요." : review.content}</p>{hidden && <button onClick={() => setRevealed((items) => [...items, review.id])}>내용 보기</button>}{review.spoiler && <Tag>스포일러 포함</Tag>}</article>;
        })}
      </div>
    </div>
  );
}

export function ReviewWriteScreen() {
  const theme = useCurrentTheme();
  const router = useRouter();
  const { state, update, notify } = useDemo();
  const previous = state.reviews.find((review) => review.themeId === theme.id);
  const [rating, setRating] = useState(previous?.rating ?? 0);
  const [content, setContent] = useState(previous?.content ?? "");
  const [spoiler, setSpoiler] = useState(previous?.spoiler ?? false);
  if (!state.completed || theme.id !== "missing-key") {
    return <div className="center-screen locked-review"><b>🔒</b><h1>완료한 테마만<br />리뷰할 수 있어요</h1><p>직접 플레이한 탐사원의 경험만 모으고 있어요.</p><button className="primary" onClick={() => router.push(`/themes/${theme.id}`)}>테마 보러 가기</button></div>;
  }
  function submit() {
    const review: ThemeReview = { id: previous?.id ?? `my-review-${Date.now()}`, themeId: theme.id, author: state.nickname, rating, content: content.trim(), spoiler, createdAt: "방금 전" };
    update({ reviews: [...state.reviews.filter((item) => item.themeId !== theme.id), review] });
    notify(previous ? "리뷰를 수정했어요" : "리뷰를 등록했어요");
    router.replace(`/themes/${theme.id}/reviews`);
  }
  return (
    <section className="form-screen review-form">
      <div className="review-theme-chip"><span>{theme.emoji}</span><p><small>완료한 테마</small><b>{theme.title}</b></p></div>
      <div><p className="step-label">나의 만족도</p><h1>이번 탐험은<br />어땠나요?</h1></div>
      <fieldset className="rating-picker"><legend>별점 선택</legend><div>{[1, 2, 3, 4, 5].map((score) => <button type="button" key={score} data-selected={score <= rating} aria-label={`${score}점`} onClick={() => setRating(score)}>★</button>)}</div><small>{rating ? `${rating}점 · ${rating >= 4 ? "추천해요!" : "솔직한 경험을 들려주세요"}` : "별점을 선택해 주세요"}</small></fieldset>
      <label>리뷰<textarea rows={6} maxLength={300} value={content} onChange={(event) => setContent(event.target.value)} placeholder="난이도, 협동 경험, 동선에 대해 알려 주세요." /><small>{content.length}/300</small></label>
      <label className="spoiler-check"><input type="checkbox" checked={spoiler} onChange={(event) => setSpoiler(event.target.checked)} /><span><b>스포일러가 포함돼 있어요</b><small>다른 탐사원에게 가려서 보여 줄게요.</small></span></label>
      <div className="notice-card">리뷰에는 정답이나 정확한 단서 위치를 직접 적지 않는 것을 권장해요.</div>
      <button className="primary bottom-action" disabled={!rating || content.trim().length < 10} onClick={submit}>리뷰 등록하기</button>
    </section>
  );
}
