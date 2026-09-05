import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowRight } from 'lucide-react';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { ProductCard } from '../../components/product/ProductCard';
import { products } from '../../data/products';

const categories = ['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'];

export function CollectionPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  const filteredProducts = useMemo(() => {
    const list = products.filter(
      (product) => category === 'All' || product.category.toLowerCase() === category.toLowerCase()
    );
    return list.sort((left, right) => {
      if (sort === 'price-low') return left.priceValue - right.priceValue;
      if (sort === 'price-high') return right.priceValue - left.priceValue;
      return 0;
    });
  }, [category, sort]);

  return (
    <main className="commerce-page collection-page">
      {/* Editorial Header */}
      <section className="shop-header container" aria-labelledby="collection-title">
        <div className="shop-header__inner">
          <div className="shop-header__meta">
            <span className="eyebrow">Collection / 01</span>
            <span className="shop-header__edition">Falcon Atelier / 2026</span>
          </div>
          <h1 id="collection-title" className="shop-header__title">
            Women&apos;s Collection
          </h1>
          <p className="shop-header__description">
            Architectural layers, sculptural tailoring, and fluid evening silhouettes designed for a considered wardrobe.
          </p>
        </div>
      </section>

      {/* Discovery Controls */}
      <section className="shop-controls container" aria-label="Collection controls">
        <div className="shop-toolbar">
          <div className="shop-toolbar__categories" role="group" aria-label="Filter by category">
            {categories.map((option) => (
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

          <div className="shop-sort-wrap">
            <label htmlFor="collection-sort" className="sr-only">Sort products</label>
            <ArrowUpDown size={13} className="shop-sort-icon" aria-hidden="true" />
            <select
              id="collection-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="shop-sort-select"
              aria-label="Sort collection by"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="shop-status-bar">
          <span className="shop-status-bar__count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
          </span>
          {category !== 'All' && (
            <span className="shop-status-bar__active-tag">
              Category: <strong>{category}</strong>
            </span>
          )}
        </div>
      </section>

      {/* Product Grid & Highlights */}
      <section className="container" style={{ marginTop: 'var(--space-6, 24px)' }}>
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} variant="editorial" />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Collection</p>
            <h2 className="empty-state__title">No pieces match this edit</h2>
            <p className="empty-state__description">
              Try selecting a different category to view available archive pieces.
            </p>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setCategory('All')}
            >
              Reset Category Filter
            </button>
          </div>
        )}

        <div style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
          <AiEntryCard />
        </div>
      </section>

      <p className="collection-footer container" style={{ marginTop: '48px', textAlign: 'center' }}>
        <Link to="/stylist" className="button button--secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>Ask Falcon to style this collection</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </p>
    </main>
  );
}