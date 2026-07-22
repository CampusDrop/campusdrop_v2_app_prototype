"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function currentPath() {
  const route = window.location.hash.slice(1) || "/";
  const pathname = route.split("?")[0];
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

const router = {
  push(path: string) { window.location.hash = path; },
  replace(path: string) { window.location.replace(`#${path}`); },
  back() { window.history.back(); },
};

export function usePathname() {
  return useSyncExternalStore(subscribe, currentPath, () => "/");
}

export function useRouter() {
  return router;
}
