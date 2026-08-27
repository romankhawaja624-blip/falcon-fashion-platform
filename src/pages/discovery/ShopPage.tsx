import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

const categories = ['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'];

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="commerce-page">
      <section className="commerce-intro container" aria-labelledby="shop-title">
        <p className="eyebrow">The digital atelier</p>
        <h1 id="shop-title">The Atelier Shop</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 0 1.5rem 0' }}>
          Explore defined silhouettes, architectural tailoring, and rare textile fabrications.
        </p>

        <label className="search-field" htmlFor="shop-search" style={{ maxWidth: '540px' }}>
          <span className="sr-only">Search the atelier</span>
          <input
            id="shop-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, fabric, or category..."
          />
          <Search size={19} aria-hidden="true" />
        </label>

        <div className="category-filter-chips" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '1.5rem 0 1rem 0' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={selectedCategory === cat ? 'button button--primary' : 'button button--secondary'}
              style={{ fontSize: '12px', padding: '6px 14px', minHeight: '32px', borderRadius: '16px' }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <nav className="commerce-categories" aria-label="Audience collection navigation" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '1rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>
            Collections:
          </span>
          <Link to="/collections/women">Women</Link>
          <Link to="/collections/men">Men</Link>
          <Link to="/collections/kids">Kids</Link>
          <Link to="/collections/youngAdults">Young Adults</Link>
          <Link to="/collections/adults">Adults</Link>
        </nav>
      </section>

      <section className="product-section container" aria-labelledby="featured-title">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
          <div>
            <p className="eyebrow">Selected pieces</p>
            <h2 id="featured-title">Defined by silhouette</h2>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="empty-state"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--color-outline-muted)',
              borderRadius: '8px',
              margin: '20px 0',
            }}
          >
            <p className="eyebrow">No Silhouettes Found</p>
            <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '8px 0 16px' }}>
              No pieces match your filter criteria.
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Try adjusting your search terms or clearing category filters.
            </p>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}