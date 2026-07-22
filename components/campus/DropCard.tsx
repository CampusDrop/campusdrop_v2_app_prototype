import type { CSSProperties } from "react";
import type { CampusDrop } from "@/data/drops";

type DropCardProps = {
  drop: CampusDrop;
  saved: boolean;
  onToggleSave: (drop: CampusDrop) => void;
};

export function DropCard({ drop, saved, onToggleSave }: DropCardProps) {
  return (
    <article className="drop-card">
      <div className="card-visual" style={{ "--card-color": drop.color } as CSSProperties}>
        <span className="card-category">{drop.category}</span>
        <span aria-hidden="true">{drop.emoji}</span>
        <button
          className="save-button"
          data-saved={saved}
          onClick={() => onToggleSave(drop)}
          type="button"
          aria-label={`${drop.title} ${saved ? "저장 취소" : "저장"}`}
          aria-pressed={saved}
        >
          <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
        </button>
      </div>
      <div className="card-content">
        <p className="card-meta">{drop.location} · {drop.time}</p>
        <h3 className="card-title">{drop.title}</h3>
        <p className="card-description">{drop.description}</p>
      </div>
    </article>
  );
}
