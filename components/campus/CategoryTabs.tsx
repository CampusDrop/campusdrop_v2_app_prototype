import { categories } from "@/data/drops";

type CategoryTabsProps = {
  active: string;
  onChange: (category: string) => void;
};

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="category-list" role="tablist" aria-label="카테고리">
      {categories.map((category) => (
        <button
          className="category-chip"
          data-active={active === category}
          key={category}
          onClick={() => onChange(category)}
          role="tab"
          aria-selected={active === category}
          type="button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
