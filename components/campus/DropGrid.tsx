import type { CampusDrop } from "@/data/drops";
import { DropCard } from "./DropCard";

type DropGridProps = {
  drops: CampusDrop[];
  savedIds: Set<number>;
  onToggleSave: (drop: CampusDrop) => void;
};

export function DropGrid({ drops, savedIds, onToggleSave }: DropGridProps) {
  if (drops.length === 0) {
    return (
      <div className="drop-grid">
        <div className="empty-state">
          <h3>아직 발견된 드롭이 없어요</h3>
          <p className="card-description">다른 검색어나 카테고리를 선택해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drop-grid">
      {drops.map((drop) => (
        <DropCard
          drop={drop}
          key={drop.id}
          saved={savedIds.has(drop.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
