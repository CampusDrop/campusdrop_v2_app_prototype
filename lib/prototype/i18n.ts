import type { Language } from "./types";

const copy = {
  ko: { continue: "계속", skip: "건너뛰기", home: "홈", themes: "테마", expeditions: "탐험대", friends: "친구", my: "MY", greeting: "세종탐험가님, 오늘도 떠나볼까요?", start: "세종대 학생으로 시작하기" },
  en: { continue: "Continue", skip: "Skip", home: "Home", themes: "Themes", expeditions: "Squads", friends: "Friends", my: "MY", greeting: "Ready for today’s campus adventure?", start: "Start as a Sejong student" },
  zh: { continue: "继续", skip: "跳过", home: "首页", themes: "主题", expeditions: "探险队", friends: "朋友", my: "我的", greeting: "今天也要开始校园探险吗？", start: "以世宗大学学生身份开始" },
  ja: { continue: "続ける", skip: "スキップ", home: "ホーム", themes: "テーマ", expeditions: "探検隊", friends: "友達", my: "MY", greeting: "今日もキャンパスを冒険しよう！", start: "世宗大学の学生として始める" },
} as const;

export type CopyKey = keyof typeof copy.ko;
export function translate(language: Language, key: CopyKey) {
  return copy[language][key];
}

export const languageOptions = [
  { id: "ko" as const, label: "한국어", sample: "계속" },
  { id: "en" as const, label: "English", sample: "Continue" },
  { id: "zh" as const, label: "中文", sample: "继续" },
  { id: "ja" as const, label: "日本語", sample: "続ける" },
];
