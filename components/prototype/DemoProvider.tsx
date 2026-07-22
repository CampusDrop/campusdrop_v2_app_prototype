"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { DemoState } from "@/lib/prototype/types";

const STORAGE_KEY = "campusdrop-demo-v1";
const initialState: DemoState = {
  hydrated: false,
  onboarded: false,
  verified: false,
  language: "ko",
  nickname: "세종탐험가",
  interests: [],
  license: true,
  joined: false,
  checkedIn: false,
  completed: false,
  level: 3,
  xp: 1240,
  coupon: "available",
  messages: ["안녕하세요! 금요일에 만나요 👋", "저는 10분 먼저 도착할게요!"],
  friends: ["캠퍼스루키"],
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

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setState(saved ? { ...initialState, ...JSON.parse(saved), hydrated: true } : { ...initialState, hydrated: true });
  }, []);

  useEffect(() => {
    if (state.hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function update(patch: Partial<DemoState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  function reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ ...initialState, hydrated: true });
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
