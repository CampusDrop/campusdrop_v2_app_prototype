export type Language = "ko" | "en" | "zh" | "ja";
export type DemoView = "normal" | "loading" | "empty" | "error" | "offline" | "denied";
export type CouponStatus = "available" | "used" | "expired";

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
  verified: boolean;
  language: Language;
  nickname: string;
  interests: string[];
  license: boolean;
  joined: boolean;
  checkedIn: boolean;
  completed: boolean;
  level: number;
  xp: number;
  coupon: CouponStatus;
  messages: string[];
  friends: string[];
  demoView: DemoView;
};
