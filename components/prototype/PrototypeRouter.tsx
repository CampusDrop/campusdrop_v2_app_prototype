"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "./AppShell";
import { SplashScreen, LanguageScreen, IntroScreen, AuthScreen } from "./screens/OnboardingStart";
import { VerificationChoiceScreen, EmailVerificationScreen, ImageVerificationScreen } from "./screens/VerificationScreens";
import { ProfileSetupScreen, InterestsScreen } from "./screens/ProfileSetupScreens";
import { HomeScreen } from "./screens/HomeScreen";
import { ThemeDetailScreen, ThemeListScreen } from "./screens/ThemeScreens";
import { ExpeditionListScreen } from "./screens/ExpeditionListScreen";
import { CreateExpeditionScreen, ExpeditionDetailScreen, InviteScreen } from "./screens/ExpeditionDetailScreens";
import { ChatScreen, MeetupScreen } from "./screens/ChatMeetupScreens";
import { GameReadyScreen, LocationMissionScreen } from "./screens/GameStartLocation";
import { ArMissionScreen, QuizMissionScreen, TeamClueScreen } from "./screens/GameArClueQuiz";
import { ResultScreen, RewardDetailScreen, RewardListScreen } from "./screens/ResultRewardScreens";
import { FriendListScreen, FriendRequestsScreen } from "./screens/FriendScreens";
import { CompletedThemesScreen, LevelScreen, LicenseScreen, MyScreen } from "./screens/MyScreens";
import { ReportScreen, SettingsScreen } from "./screens/SettingsReportScreens";

export function PrototypeRouter() {
  const path = usePathname();
  let screen = <NotFoundScreen />;
  if (path === "/") screen = <SplashScreen />;
  else if (path === "/onboarding/language") screen = <LanguageScreen />;
  else if (path === "/onboarding/intro") screen = <IntroScreen />;
  else if (path === "/auth") screen = <AuthScreen />;
  else if (path === "/verification") screen = <VerificationChoiceScreen />;
  else if (path === "/verification/email") screen = <EmailVerificationScreen />;
  else if (path === "/verification/image") screen = <ImageVerificationScreen />;
  else if (path === "/profile/setup") screen = <ProfileSetupScreen />;
  else if (path === "/profile/interests") screen = <InterestsScreen />;
  else if (path === "/home") screen = <HomeScreen />;
  else if (path === "/themes") screen = <ThemeListScreen />;
  else if (path.startsWith("/themes/")) screen = <ThemeDetailScreen />;
  else if (path === "/expeditions") screen = <ExpeditionListScreen />;
  else if (path === "/expeditions/new") screen = <CreateExpeditionScreen />;
  else if (path.endsWith("/invite")) screen = <InviteScreen />;
  else if (path.endsWith("/chat")) screen = <ChatScreen />;
  else if (path.endsWith("/meetup")) screen = <MeetupScreen />;
  else if (path.startsWith("/expeditions/")) screen = <ExpeditionDetailScreen />;
  else if (/^\/play\/[^/]+$/.test(path)) screen = <GameReadyScreen />;
  else if (path.endsWith("/location")) screen = <LocationMissionScreen />;
  else if (path.endsWith("/ar")) screen = <ArMissionScreen />;
  else if (path.endsWith("/team-clue")) screen = <TeamClueScreen />;
  else if (path.endsWith("/quiz")) screen = <QuizMissionScreen />;
  else if (path.endsWith("/result")) screen = <ResultScreen />;
  else if (path === "/rewards") screen = <RewardListScreen />;
  else if (path.startsWith("/rewards/")) screen = <RewardDetailScreen />;
  else if (path === "/friends") screen = <FriendListScreen />;
  else if (path === "/friends/requests") screen = <FriendRequestsScreen />;
  else if (path === "/my") screen = <MyScreen />;
  else if (path === "/my/completed") screen = <CompletedThemesScreen />;
  else if (path === "/my/level") screen = <LevelScreen />;
  else if (path === "/my/license") screen = <LicenseScreen />;
  else if (path === "/settings") screen = <SettingsScreen />;
  else if (path === "/report") screen = <ReportScreen />;
  return <AppShell>{screen}</AppShell>;
}

function NotFoundScreen() {
  const router = useRouter();
  return <div className="center-screen"><b className="empty-icon">?</b><h1>화면을 찾을 수 없어요</h1><button className="primary" onClick={() => router.push("/home")}>홈으로</button></div>;
}
