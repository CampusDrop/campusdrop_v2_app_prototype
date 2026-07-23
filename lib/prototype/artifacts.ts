import type { HiddenArtifact } from "./types";

export const currentMonthlyTheme = {
  month: "2026-07",
  label: "7월 메인 테마",
  themeId: "missing-key",
};

export const hiddenArtifacts: HiddenArtifact[] = [
  {
    id: "worn-key-tag",
    themeId: "missing-key",
    name: "닳은 열쇠표",
    emoji: "🏷️",
    rarity: "일반",
    lore: "오래전 학생회관 열쇠 꾸러미에 달려 있던 작은 표식.",
  },
  {
    id: "bronze-office-pin",
    themeId: "missing-key",
    name: "청동 집무실 핀",
    emoji: "📌",
    rarity: "고급",
    lore: "총장실 서랍 안쪽에서 떨어져 나온 듯한 청동 장식.",
  },
  {
    id: "blue-seal-fragment",
    themeId: "missing-key",
    name: "푸른 봉인의 조각",
    emoji: "🔷",
    rarity: "희귀",
    lore: "빛에 비추면 보이지 않던 학교 문장이 떠오르는 파편.",
  },
  {
    id: "eclipse-glass-key",
    themeId: "missing-key",
    name: "월식의 유리 열쇠",
    emoji: "🗝️",
    rarity: "영웅",
    lore: "어두운 곳에서만 희미한 은빛을 내는 정체불명의 열쇠.",
  },
  {
    id: "founders-golden-seal",
    themeId: "missing-key",
    name: "초대 총장의 황금 인장",
    emoji: "🔱",
    rarity: "전설",
    lore: "학교의 첫 기록과 함께 봉인되었다고 전해지는 황금 인장.",
  },
];

export function getKoreanDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodayArtifact(date = new Date()) {
  const dateKey = getKoreanDateKey(date);
  const day = Number(dateKey.slice(-2));
  return hiddenArtifacts[day % hiddenArtifacts.length];
}
