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

export const DAILY_CHEST_LIMIT = 3;
export const RESTORATION_ARTIFACT_DROP_RATE = 0.06;
export const regularArtifacts = hiddenArtifacts.slice(0, 4);
export const restorationArtifact = hiddenArtifacts[4];

const juneArtifacts: HiddenArtifact[] = [
  { id: "crimson-bookmark", themeId: "red-moon-library", name: "붉은 실 책갈피", emoji: "🧵", rarity: "일반", lore: "금지된 서가의 책 사이에서 발견된 붉은 실 한 가닥." },
  { id: "night-reader-card", themeId: "red-moon-library", name: "야간 열람증", emoji: "🎫", rarity: "고급", lore: "자정 이후에만 글자가 나타나는 오래된 열람증." },
  { id: "silver-moon-lens", themeId: "red-moon-library", name: "은빛 월광 렌즈", emoji: "🔍", rarity: "희귀", lore: "달빛을 통과시키면 숨겨진 문장이 보이는 작은 렌즈." },
  { id: "keeper-bell", themeId: "red-moon-library", name: "서고지기의 종", emoji: "🔔", rarity: "영웅", lore: "울리지 않아도 주변의 책장이 미세하게 흔들리는 은빛 종." },
  { id: "eclipse-catalog", themeId: "red-moon-library", name: "월식의 금서 목록", emoji: "📕", rarity: "전설", lore: "기록에서 지워진 책들의 이름이 적힌 유일한 목록." },
];

const mayArtifacts: HiddenArtifact[] = [
  { id: "torn-timetable", themeId: "hidden-classroom", name: "찢어진 시간표", emoji: "📄", rarity: "일반", lore: "404호 수업만 잉크가 번져 알아볼 수 없는 시간표 조각." },
  { id: "chalk-fragment", themeId: "hidden-classroom", name: "멈춘 분필 조각", emoji: "🖍️", rarity: "고급", lore: "칠판에 닿지 않아도 숫자 하나를 반복해서 그리는 분필." },
  { id: "room-404-plate", themeId: "hidden-classroom", name: "404호 문패", emoji: "🔢", rarity: "희귀", lore: "어느 건물의 도면에도 존재하지 않는 강의실 문패." },
  { id: "stopped-class-clock", themeId: "hidden-classroom", name: "멈춘 강의실 시계", emoji: "🕰️", rarity: "영웅", lore: "수업이 끝난 적 없는 어느 오후를 계속 가리키는 시계." },
  { id: "invisible-invitation", themeId: "hidden-classroom", name: "보이지 않는 초대장", emoji: "✉️", rarity: "전설", lore: "초대받은 사람에게만 404호의 위치가 나타나는 봉인된 편지." },
];

export const artifactCollections = [
  {
    id: "2026-07",
    monthLabel: "7월",
    yearLabel: "2026 · JULY",
    themeId: "missing-key",
    themeTitle: "사라진 총장의 열쇠",
    themeEmoji: "🔑",
    status: "current" as const,
    artifacts: hiddenArtifacts,
  },
  {
    id: "2026-06",
    monthLabel: "6월",
    yearLabel: "2026 · JUNE",
    themeId: "red-moon-library",
    themeTitle: "붉은 달의 도서관",
    themeEmoji: "🌙",
    status: "archived" as const,
    artifacts: juneArtifacts,
  },
  {
    id: "2026-05",
    monthLabel: "5월",
    yearLabel: "2026 · MAY",
    themeId: "hidden-classroom",
    themeTitle: "시간표에 없는 강의실",
    themeEmoji: "🏫",
    status: "archived" as const,
    artifacts: mayArtifacts,
  },
];

export const demoArchivedArtifactIds = [
  "crimson-bookmark",
  "silver-moon-lens",
  "keeper-bell",
  "torn-timetable",
  "room-404-plate",
];

export function getKoreanDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getDailyChestReward(
  ownedArtifactIds: string[],
  chestIndex: number,
  date = new Date(),
  rollValue?: number,
) {
  const ownsRestorationArtifact = ownedArtifactIds.includes(restorationArtifact.id);
  const ownsEveryRegularArtifact = regularArtifacts.every((artifact) => ownedArtifactIds.includes(artifact.id));
  const canRollRestorationArtifact = chestIndex === 0 && (rollValue ?? Math.random()) < RESTORATION_ARTIFACT_DROP_RATE;

  if (!ownsRestorationArtifact && (ownsEveryRegularArtifact || canRollRestorationArtifact)) {
    return restorationArtifact;
  }

  const dateKey = getKoreanDateKey(date);
  const day = Number(dateKey.slice(-2));
  return regularArtifacts[(day + chestIndex) % regularArtifacts.length];
}
