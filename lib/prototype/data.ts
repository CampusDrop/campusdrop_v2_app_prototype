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

export const interestOptions = [
  "음식·카페", "게임", "영화·드라마", "음악", "운동", "여행", "사진", "독서", "언어교환", "공부·진로",
];
