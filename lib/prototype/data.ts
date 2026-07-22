import type { Expedition, Theme } from "./types";

export const themes: Theme[] = [
  {
    id: "missing-key",
    title: "사라진 총장의 열쇠",
    subtitle: "캠퍼스 곳곳에 흩어진 단서를 찾아라",
    description: "오래된 총장실에서 사라진 열쇠를 찾기 위해 GPS와 암호 단서를 해결하는 입문 테마예요.",
    emoji: "🔑",
    color: "#ffd8c9",
    difficulty: "쉬움",
    duration: "60분",
    capacity: "4명",
    schedule: "매일 10:00–20:00",
  },
  {
    id: "red-moon-library",
    title: "붉은 달의 도서관",
    subtitle: "자정에만 나타나는 금지된 서가",
    description: "AR 오브젝트와 팀원별 단서를 조합해 도서관의 비밀을 밝히는 심야 협동 테마예요.",
    emoji: "🌙",
    color: "#dcd7ff",
    difficulty: "어려움",
    duration: "80분",
    capacity: "4명",
    schedule: "금·토 22:00–01:00",
    locked: true,
  },
  {
    id: "hidden-classroom",
    title: "시간표에 없는 강의실",
    subtitle: "존재하지 않는 404호의 초대장",
    description: "캠퍼스의 숨은 공간을 이동하며 GPS, AR, 숫자 암호를 연달아 해결하는 테마예요.",
    emoji: "🏫",
    color: "#d4f1e7",
    difficulty: "보통",
    duration: "75분",
    capacity: "3명",
    schedule: "매일 14:00–22:00",
  },
];

export const expeditions: Expedition[] = [
  {
    id: "key-friday",
    themeId: "missing-key",
    title: "금요일 열쇠 원정대",
    date: "7월 24일 금요일 · 오후 6:30",
    cafe: "제주몰빵 세종대점",
    members: 3,
    capacity: 4,
    interests: ["카페", "게임", "사진"],
  },
  {
    id: "classroom-weekend",
    themeId: "hidden-classroom",
    title: "주말 404 탐험대",
    date: "7월 25일 토요일 · 오후 4:00",
    cafe: "제주몰빵 세종대점",
    members: 2,
    capacity: 3,
    interests: ["여행", "추리", "사진"],
  },
  {
    id: "closing-demo",
    themeId: "missing-key",
    title: "동시 합류 오류 시연대",
    date: "오늘 · 오후 7:00",
    cafe: "제주몰빵 세종대점",
    members: 3,
    capacity: 4,
    interests: ["게임"],
    full: true,
  },
];

export const teamMembers = [
  { name: "미로냥", avatar: "🐈", completed: 4, interest: "게임" },
  { name: "사진곰", avatar: "🐻", completed: 7, interest: "사진" },
  { name: "카페콩", avatar: "🫘", completed: 2, interest: "카페" },
];

export type PreferenceOption = { id: string; label: string; image: string };

export const interestOptions: PreferenceOption[] = [
  { id: "cafe", label: "맛집·카페", image: "/onboarding/cafe.webp" },
  { id: "game", label: "게임", image: "/onboarding/game.webp" },
  { id: "movie", label: "영화·드라마", image: "/onboarding/movie.webp" },
  { id: "music", label: "음악", image: "/onboarding/music.webp" },
  { id: "sports", label: "스포츠", image: "/onboarding/sports.webp" },
  { id: "travel", label: "여행", image: "/onboarding/travel.webp" },
  { id: "photo", label: "사진", image: "/onboarding/photo.webp" },
  { id: "books", label: "독서", image: "/onboarding/books.webp" },
  { id: "friends", label: "친구·모임", image: "/onboarding/friends.webp" },
  { id: "study", label: "공부·진로", image: "/onboarding/study.webp" },
  { id: "fashion", label: "패션", image: "/onboarding/fashion.webp" },
  { id: "pet", label: "반려동물", image: "/onboarding/pet.webp" },
];

export const hobbyOptions: PreferenceOption[] = [
  { id: "running", label: "러닝", image: "/onboarding/running.webp" },
  { id: "hiking", label: "등산", image: "/onboarding/hiking.webp" },
  { id: "cooking", label: "요리", image: "/onboarding/cooking.webp" },
  { id: "baking", label: "베이킹", image: "/onboarding/baking.webp" },
  { id: "drawing", label: "그림", image: "/onboarding/drawing.webp" },
  { id: "dance", label: "댄스", image: "/onboarding/dance.webp" },
  { id: "instrument", label: "악기", image: "/onboarding/instrument.webp" },
  { id: "boardgame", label: "보드게임", image: "/onboarding/boardgame.webp" },
  { id: "camping", label: "캠핑", image: "/onboarding/camping.webp" },
  { id: "cycling", label: "자전거", image: "/onboarding/cycling.webp" },
  { id: "plants", label: "식물 키우기", image: "/onboarding/plants.webp" },
  { id: "craft", label: "공예", image: "/onboarding/craft.webp" },
];
