"use client";

import { useMemo, useState } from "react";
import { drops, type CampusDrop } from "@/data/drops";
import { BottomNav } from "./BottomNav";
import { CategoryTabs } from "./CategoryTabs";
import { DropGrid } from "./DropGrid";
import { Header } from "./Header";
import { Hero } from "./Hero";

export function HomeShell() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeNav, setActiveNav] = useState("홈");
  const [query, setQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState("");

  const visibleDrops = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return drops.filter((drop) => {
      const matchesCategory =
        activeCategory === "전체" || drop.category === activeCategory;
      const searchTarget = `${drop.title} ${drop.description} ${drop.location}`.toLowerCase();
      return matchesCategory && searchTarget.includes(normalizedQuery);
    });
  }, [activeCategory, query]);

  function toggleSave(drop: CampusDrop) {
    const next = new Set(savedIds);
    const willSave = !next.has(drop.id);
    willSave ? next.add(drop.id) : next.delete(drop.id);
    setSavedIds(next);
    setToast(willSave ? "드롭을 저장했어요" : "저장을 취소했어요");
    window.setTimeout(() => setToast(""), 1600);
  }

  function changeNav(item: string) {
    setActiveNav(item);
    if (item !== "홈") {
      setToast(`${item} 화면은 다음 단계에서 연결됩니다`);
      window.setTimeout(() => setToast(""), 1600);
    }
  }

  return (
    <div className="site-shell">
      <Header />
      <main className="page-content">
        <Hero query={query} onQueryChange={setQuery} />
        <section className="discover-section" aria-labelledby="discover-title">
          <div className="section-heading">
            <h2 id="discover-title">지금 주목받는 드롭</h2>
            <p className="result-count">{visibleDrops.length}개의 소식</p>
          </div>
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          <DropGrid
            drops={visibleDrops}
            savedIds={savedIds}
            onToggleSave={toggleSave}
          />
        </section>
      </main>
      <BottomNav active={activeNav} onChange={changeNav} />
      <div className="toast" aria-live="polite" hidden={!toast}>{toast}</div>
    </div>
  );
}
