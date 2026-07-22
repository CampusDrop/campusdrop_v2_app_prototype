type HeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function Hero({ query, onQueryChange }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">오늘의 캠퍼스 드롭</p>
        <h1 id="hero-title">오늘 캠퍼스에서 무엇을 찾고 있나요?</h1>
        <p className="hero-description">
          우리 학교의 맛집, 스터디, 행사와 중고 소식을 가장 빠르게 발견하세요.
        </p>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">캠퍼스 소식 검색</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="장소, 모임, 키워드를 검색해보세요"
          />
          <button className="search-button" type="button">검색</button>
        </label>
      </div>
      <aside className="hero-aside" aria-label="오늘의 캠퍼스 현황">
        <p className="hero-stat">24개의 새 소식</p>
        <p className="hero-note">지금 학교 곳곳에서 새로운 드롭이 올라오고 있어요.</p>
        <div className="hero-dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      </aside>
    </section>
  );
}
