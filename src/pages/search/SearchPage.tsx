import { Search, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { searchProducts } from '../../features/search/searchProducts';

const categoryOptions = ['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const results = useMemo(() => searchProducts(products, query, category), [query, category]);

  return (
    <main className="search-page commerce-page">
      <section className="search-page__intro container" aria-labelledby="search-title" style={{ paddingTop: '2rem' }}>
        <p className="eyebrow">Global search</p>
        <h1 id="search-title">Find your next form.</h1>

        <div style={{ position: 'relative', maxWidth: '640px' }}>
          <label className="search-field search-field--large" htmlFor="global-search" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span className="sr-only">Search Falcon</span>
            <input
              id="global-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by piece, mood, material, or silhouette..."
              style={{ paddingRight: '40px' }}
            />
            <Search size={20} aria-hidden="true" style={{ position: 'absolute', right: '16px' }} />
          </label>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '48px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Link className="ai-search-link" to="/stylist" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} aria-hidden="true" /> Describe your ideal style to Falcon AI
        </Link>
      </section>

      <section className="search-results container" aria-live="polite" style={{ paddingBottom: '4rem' }}>
        <div className="search-results__toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
          <div className="filter-group" role="group" aria-label="Filter search results" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categoryOptions.map((option) => (
              <button
                className={category === option ? 'filter-chip filter-chip--active' : 'filter-chip'}
                key={option}
                type="button"
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-outline-muted)',
                  background: category === option ? 'var(--color-text, #fff)' : 'transparent',
                  color: category === option ? 'var(--color-background, #000)' : 'var(--color-text, #fff)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="result-count" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="product-grid">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} variant="compact" />
            ))}
          </div>
        ) : (
          <div
            className="search-empty"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--color-outline-muted)',
              borderRadius: '8px',
            }}
          >
            <p className="eyebrow">No Exact Match</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '8px 0 16px' }}>
              Try describing the feeling instead.
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              We couldn't find any pieces matching &ldquo;{query}&rdquo;.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
              >
                Clear Search
              </button>
              <Link className="button button--primary" to="/stylist">
                Consult Falcon AI
              </Link>
            </div>
          </div>
        )}
      </section>

      {results.length > 0 && (
        <div className="container">
          <ProductRail title="Continue exploring" products={products} />
        </div>
      )}
    </main>
  );
}