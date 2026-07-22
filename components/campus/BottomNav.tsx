const navItems = [
  { id: "홈", icon: "⌂" },
  { id: "탐색", icon: "⌕" },
  { id: "등록", icon: "+" },
  { id: "내 활동", icon: "♡" },
] as const;

type BottomNavProps = {
  active: string;
  onChange: (item: string) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {navItems.map((item) => (
        <button
          className="nav-button"
          data-active={active === item.id}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
          aria-current={active === item.id ? "page" : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span className="nav-label">{item.id}</span>
        </button>
      ))}
    </nav>
  );
}
