export type Language = "ko" | "en" | "zh" | "ja";
export type DemoView = "normal" | "loading" | "empty" | "error" | "offline" | "denied";
export type CouponStatus = "available" | "used" | "expired";
export type AuthProvider = "kakao" | "google" | "apple";
export type ArtifactRarity = "일반" | "고급" | "희귀" | "영웅" | "전설";

export type HiddenArtifact = {
  id: string;
  themeId: string;
  name: string;
  emoji: string;
  rarity: ArtifactRarity;
  lore: string;
};

export type ThemeReview = {
  id: string;
  themeId: string;
  author: string;
  rating: number;
  content: string;
  spoiler: boolean;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  scope: "general" | string;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
};

export type Theme = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  difficulty: string;
  duration: string;
  capacity: string;
  schedule: string;
  locked?: boolean;
};

export type Expedition = {
  id: string;
  themeId: string;
  title: string;
  date: string;
  cafe: string;
  members: number;
  capacity: number;
  interests: string[];
  full?: boolean;
};

export type DemoState = {
  hydrated: boolean;
  onboarded: boolean;
  authProvider: AuthProvider | null;
  verified: boolean;
  profileReady: boolean;
  language: Language;
  nickname: string;
  interests: string[];
  hobbies: string[];
  license: boolean;
  joined: boolean;
  checkedIn: boolean;
  completed: boolean;
  level: number;
  xp: number;
  coupon: CouponStatus;
  messages: string[];
  friends: string[];
  reviews: ThemeReview[];
  communityPosts: CommunityPost[];
  artifactIds: string[];
  dailyCompletedDate: string | null;
  dailyStreak: number;
  mainThemeRuns: number;
  demoView: DemoView;
};
