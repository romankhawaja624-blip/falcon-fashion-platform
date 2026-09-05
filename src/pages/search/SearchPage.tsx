import { Search, Sparkles, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { searchProducts } from '../../features/search/searchProducts';

const categoryOptions = ['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'];

const suggestedQueries = [
  'Obsidian Coat',
  'Silk Gown',
  'Virgin Wool',
  'Tailored Trousers',
  'Cashmere',
  'Architectural',
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const results = useMemo(() => searchProducts(products, query, category), [query, category]);

  const handleSelectSuggested = (item: string) => {
    setQuery(item);
  };

  const handleClear = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <main className="commerce-page search-page">
      {/* Search Header */}
      <section className="search-header container" aria-labelledby="search-title">
        <div className="search-header__inner">
          <div className="search-header__meta">
            <span className="eyebrow">Digital Archive Search</span>
            <span className="search-header__edition">Falcon Atelier / 2026</span>
          </div>
          <h1 id="search-title" className="search-header__title">
            Find your next form.
          </h1>
          <p className="search-header__description">
            Search across silhouettes, rare textile fabrications, tailoring cuts, and styling occasions.
          </p>

          {/* Luxury Search Input Bar */}
          <div className="search-input-box" role="search">
            <label className="sr-only" htmlFor="global-search">Search Falcon Atelier</label>
            <div className="search-input-box__field">
              <Search size={18} className="search-input-box__search-icon" aria-hidden="true" />
              <input
                id="global-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by silhouette, material, category, or keyword..."
                className="search-input-box__input"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="search-input-box__clear"
                  aria-label="Clear search input"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Curated Suggested Searches */}
          <div className="search-suggestions" aria-label="Suggested search terms">
            <span className="search-suggestions__label">Curated:</span>
            <div className="search-suggestions__list">
              {suggestedQueries.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleSelectSuggested(suggested)}
                  className={`search-suggestions__btn ${query.toLowerCase() === suggested.toLowerCase() ? 'search-suggestions__btn--active' : ''}`}
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Falcon AI Stylist Bridge */}
          <div className="search-ai-bridge">
            <Link to="/stylist" className="search-ai-bridge__link">
              <Sparkles size={15} className="search-ai-bridge__icon" aria-hidden="true" />
              <span>Describe your desired look or silhouette to Falcon AI</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Results & Filter Toolbar */}
      <section className="search-results container" aria-live="polite">
        <div className="search-results__toolbar">
          <div className="filter-group" role="group" aria-label="Filter search results by category">
            {categoryOptions.map((option) => (
              <button
                className={`filter-chip ${category === option ? 'filter-chip--active' : ''}`}
                key={option}
                type="button"
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="search-results__meta">
            <span className="result-count">
              {results.length} {results.length === 1 ? 'silhouette identified' : 'silhouettes identified'}
            </span>
            {(query || category !== 'All') && (
              <button
                type="button"
                onClick={handleClear}
                className="search-results__clear-btn"
              >
                Reset Search
              </button>
            )}
          </div>
        </div>

        {/* Results Grid / Zero Match State */}
        {results.length > 0 ? (
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} variant="editorial" />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <SlidersHorizontal size={24} className="empty-state__icon" aria-hidden="true" />
            </div>
            <p className="eyebrow">Archive Search</p>
            <h2 className="empty-state__title">
              {query ? `No pieces found for \u201C${query}\u201D` : 'No pieces match the selected category'}
            </h2>
            <p className="empty-state__description">
              Try adjusting your search terms, exploring our curated keywords above, or consulting the Falcon AI Stylist for bespoke silhouette recommendations.
            </p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={handleClear}
              >
                Clear Search Query
              </button>
              <Link className="button button--primary" to="/stylist">
                <Sparkles size={14} style={{ marginRight: '8px' }} aria-hidden="true" />
                Consult Falcon AI
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Continue Exploring Product Rail */}
      <div className="container" style={{ marginTop: 'clamp(64px, 8vw, 100px)' }}>
        <ProductRail
          title="Archive highlights"
          description="Curated pieces from our latest capsule collection."
          products={products}
          variant="editorial"
        />
      </div>
    </main>
  );
}