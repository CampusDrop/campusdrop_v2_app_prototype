export type DropCategory = "맛집" | "스터디" | "행사" | "중고";

export type CampusDrop = {
  id: number;
  category: DropCategory;
  title: string;
  description: string;
  location: string;
  time: string;
  emoji: string;
  color: string;
};

export const drops: CampusDrop[] = [
  {
    id: 1,
    category: "맛집",
    title: "공대 앞 천원 아메리카노",
    description: "학생증을 보여주면 오늘 하루 아메리카노가 천 원이에요.",
    location: "공학관 정문",
    time: "12분 전",
    emoji: "☕",
    color: "#FFE1C5",
  },
  {
    id: 2,
    category: "스터디",
    title: "중앙도서관 알고리즘 스터디",
    description: "매주 화요일 저녁, 코딩 테스트를 함께 준비할 두 분을 찾아요.",
    location: "중앙도서관 3층",
    time: "35분 전",
    emoji: "💻",
    color: "#DDF3ED",
  },
  {
    id: 3,
    category: "행사",
    title: "축제 플리마켓 셀러 모집",
    description: "직접 만든 굿즈와 소품을 소개할 캠퍼스 셀러를 모집합니다.",
    location: "학생회관 앞",
    time: "1시간 전",
    emoji: "🎪",
    color: "#FFF0B8",
  },
  {
    id: 4,
    category: "중고",
    title: "경영학 원론 교재 나눔",
    description: "필기 없는 깨끗한 교재입니다. 필요한 분께 무료로 드려요.",
    location: "인문관 로비",
    time: "2시간 전",
    emoji: "📚",
    color: "#E7E0FF",
  },
  {
    id: 5,
    category: "맛집",
    title: "기숙사 앞 붕어빵 오픈",
    description: "팥과 슈크림 반반 세트가 새로 나왔어요. 밤 10시까지 운영합니다.",
    location: "동문 기숙사",
    time: "3시간 전",
    emoji: "🐟",
    color: "#FFDCD2",
  },
  {
    id: 6,
    category: "스터디",
    title: "금요일 영어 회화 한 자리",
    description: "가벼운 주제로 한 시간 동안 영어로 이야기하는 모임이에요.",
    location: "카페 라운지",
    time: "오늘",
    emoji: "💬",
    color: "#D7EEFF",
  },
];

export const categories = ["전체", "맛집", "스터디", "행사", "중고"] as const;
