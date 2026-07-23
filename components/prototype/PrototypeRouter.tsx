"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DemoState } from "@/lib/prototype/types";
import { useDemo } from "./DemoProvider";
import { AppShell } from "./AppShell";
import { SplashScreen, LanguageScreen, IntroScreen, AuthScreen } from "./screens/OnboardingStart";
import { VerificationChoiceScreen, EmailVerificationScreen, ImageVerificationScreen } from "./screens/VerificationScreens";
import { HobbiesScreen, ProfileSetupScreen, InterestsScreen } from "./screens/ProfileSetupScreens";
import { HomeScreen } from "./screens/HomeScreen";
import { ThemeDetailScreen, ThemeListScreen } from "./screens/ThemeScreens";
import { ReviewListScreen, ReviewWriteScreen } from "./screens/ReviewScreens";
import { CommunityHomeScreen, GeneralCommunityScreen, ThemeCommunityScreen } from "./screens/CommunityScreens";
import { ExpeditionListScreen } from "./screens/ExpeditionListScreen";
import { CreateExpeditionScreen, ExpeditionDetailScreen, InviteScreen } from "./screens/ExpeditionDetailScreens";
import { ChatScreen, MeetupScreen } from "./screens/ChatMeetupScreens";
import { GameReadyScreen, LocationMissionScreen } from "./screens/GameStartLocation";
import { ArMissionScreen, QuizMissionScreen, TeamClueScreen } from "./screens/GameArClueQuiz";
import { ResultScreen, RewardDetailScreen, RewardListScreen } from "./screens/ResultRewardScreens";
import { FriendListScreen, FriendRequestsScreen } from "./screens/FriendScreens";
import { FriendQrScanScreen } from "./screens/FriendQrScanScreen";
import { CompletedThemesScreen, LevelScreen, LicenseScreen, MyScreen } from "./screens/MyScreens";
import { ReportScreen, SettingsScreen } from "./screens/SettingsReportScreens";

export function PrototypeRouter() {
  const path = usePathname();
  const router = useRouter();
  const { state } = useDemo();
  const requiredRoute = getRequiredRoute(path, state);
  useEffect(() => { if (requiredRoute) router.replace(requiredRoute); }, [requiredRoute, router]);
  if (!state.hydrated || requiredRoute) return <AppShell><div className="center-screen"><div className="logo-orbit">D</div><p>입장 조건을 확인하는 중…</p></div></AppShell>;
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
  else if (path === "/profile/hobbies") screen = <HobbiesScreen />;
  else if (path === "/home") screen = <HomeScreen />;
  else if (path === "/themes") screen = <ThemeListScreen />;
  else if (/^\/themes\/[^/]+\/reviews\/new$/.test(path)) screen = <ReviewWriteScreen />;
  else if (/^\/themes\/[^/]+\/reviews$/.test(path)) screen = <ReviewListScreen />;
  else if (path.startsWith("/themes/")) screen = <ThemeDetailScreen />;
  else if (path === "/community") screen = <CommunityHomeScreen />;
  else if (path === "/community/general") screen = <GeneralCommunityScreen />;
  else if (path.startsWith("/community/themes/")) screen = <ThemeCommunityScreen />;
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
  else if (path === "/friends/scan") screen = <FriendQrScanScreen />;
  else if (path === "/my") screen = <MyScreen />;
  else if (path === "/my/completed") screen = <CompletedThemesScreen />;
  else if (path === "/my/level") screen = <LevelScreen />;
  else if (path === "/my/license") screen = <LicenseScreen />;
  else if (path === "/settings") screen = <SettingsScreen />;
  else if (path === "/report") screen = <ReportScreen />;
  return <AppShell>{screen}</AppShell>;
}

function getRequiredRoute(path: string, state: DemoState) {
  if (!state.hydrated || path === "/" || path.startsWith("/onboarding") || path === "/auth") return null;
  if (path.startsWith("/verification")) return state.authProvider ? null : "/auth";
  if (path.startsWith("/profile")) {
    if (!state.authProvider) return "/auth";
    if (!state.verified) return "/verification";
    if (path !== "/profile/setup" && !state.profileReady) return "/profile/setup";
    if (path === "/profile/hobbies" && state.interests.length < 3) return "/profile/interests";
    return null;
  }
  if (!state.authProvider) return "/auth";
  if (!state.verified) return "/verification";
  if (!state.profileReady) return "/profile/setup";
  if (state.interests.length < 3) return "/profile/interests";
  if (state.hobbies.length < 3) return "/profile/hobbies";
  if (state.onboarded) return null;
  return "/profile/hobbies";
}

function NotFoundScreen() {
  const router = useRouter();
  return <div className="center-screen"><b className="empty-icon">?</b><h1>화면을 찾을 수 없어요</h1><button className="primary" onClick={() => router.push("/home")}>홈으로</button></div>;
}
