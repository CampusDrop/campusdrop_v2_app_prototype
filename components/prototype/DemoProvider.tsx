"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import type { DemoState } from "@/lib/prototype/types";

const STORAGE_KEY = "campusdrop-demo-v1";
const initialState: DemoState = {
  hydrated: false,
  onboarded: false,
  authProvider: null,
  verified: false,
  profileReady: false,
  language: "ko",
  nickname: "세종탐험가",
  interests: [],
  hobbies: [],
  license: false,
  joined: false,
  checkedIn: false,
  completed: false,
  level: 3,
  xp: 1240,
  coupon: "available",
  messages: ["안녕하세요! 금요일에 만나요 👋", "저는 10분 먼저 도착할게요!"],
  friends: ["캠퍼스루키"],
  reviews: [],
  communityPosts: [],
  demoView: "normal",
};

type DemoContextValue = {
  state: DemoState;
  toast: string;
  update: (patch: Partial<DemoState>) => void;
  reset: () => void;
  notify: (message: string) => void;
  completeGame: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);
const stateListeners = new Set<() => void>();
let clientState: DemoState | null = null;

function getServerState() {
  return initialState;
}

function getClientState() {
  if (typeof window === "undefined") return initialState;
  if (clientState) return clientState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    clientState = saved
      ? { ...initialState, ...JSON.parse(saved), hydrated: true }
      : { ...initialState, hydrated: true };
  } catch {
    clientState = { ...initialState, hydrated: true };
  }
  return clientState;
}

function subscribeToState(listener: () => void) {
  stateListeners.add(listener);
  function syncFromStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return;
    clientState = null;
    stateListeners.forEach((notify) => notify());
  }
  window.addEventListener("storage", syncFromStorage);
  return () => {
    stateListeners.delete(listener);
    window.removeEventListener("storage", syncFromStorage);
  };
}

function commitState(nextState: DemoState) {
  clientState = { ...nextState, hydrated: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clientState));
  } catch {
    // Continue with in-memory state when browser storage is unavailable.
  }
  stateListeners.forEach((listener) => listener());
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribeToState, getClientState, getServerState);
  const [toast, setToast] = useState("");

  function update(patch: Partial<DemoState>) {
    commitState({ ...getClientState(), ...patch });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  function reset() {
    commitState({ ...initialState, hydrated: true });
    notify("데모가 초기화됐어요");
  }

  function completeGame() {
    if (state.completed) return;
    update({ completed: true, level: 4, xp: 80, coupon: "available" });
  }

  return (
    <DemoContext.Provider value={{ state, toast, update, reset, notify, completeGame }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
