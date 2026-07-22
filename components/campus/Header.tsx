export function Header() {
  return (
    <header className="site-header">
      <div className="brand" aria-label="CampusDrop 홈">
        <span className="brand-mark" aria-hidden="true">D</span>
        <span>CampusDrop</span>
      </div>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="알림">
          <span aria-hidden="true">●</span>
        </button>
        <button className="avatar" type="button" aria-label="내 프로필">
          CD
        </button>
      </div>
    </header>
  );
}
