import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

const categories = ['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
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

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceValue - b.priceValue;
      if (sortBy === 'price-desc') return b.priceValue - a.priceValue;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // 'featured' retains curated catalog order
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <main className="commerce-page shop-page">
      {/* Editorial Header */}
      <section className="shop-header container" aria-labelledby="shop-title">
        <div className="shop-header__inner">
          <div className="shop-header__meta">
            <span className="eyebrow">The Digital Atelier</span>
            <span className="shop-header__edition">Collection Archive / 2026</span>
          </div>
          <h1 id="shop-title" className="shop-header__title">
            The Atelier Catalog
          </h1>
          <p className="shop-header__description">
            Sculptural silhouettes, architectural tailoring, and rare textile fabrications designed with enduring intention.
          </p>

          {/* Audience Collection Navigation */}
          <nav className="shop-audiences" aria-label="Audience collection navigation">
            <span className="shop-audiences__label">Editions:</span>
            <div className="shop-audiences__links">
              <Link to="/collections/women" className="shop-audiences__link">Women</Link>
              <span className="shop-audiences__sep" aria-hidden="true">/</span>
              <Link to="/collections/men" className="shop-audiences__link">Men</Link>
              <span className="shop-audiences__sep" aria-hidden="true">/</span>
              <Link to="/collections/youngAdults" className="shop-audiences__link">Young Adults</Link>
              <span className="shop-audiences__sep" aria-hidden="true">/</span>
              <Link to="/collections/kids" className="shop-audiences__link">Kids</Link>
              <span className="shop-audiences__sep" aria-hidden="true">/</span>
              <Link to="/collections/adults" className="shop-audiences__link">Adults</Link>
            </div>
          </nav>
        </div>
      </section>

      {/* Discovery Toolbar */}
      <section className="shop-controls container" aria-label="Catalog filters and sorting">
        <div className="shop-toolbar">
          {/* Category Chips */}
          <div className="shop-toolbar__categories" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Actions */}
          <div className="shop-toolbar__actions">
            <div className="shop-search-field">
              <label htmlFor="shop-search" className="sr-only">Search the atelier</label>
              <input
                id="shop-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search silhouettes..."
                className="shop-search-field__input"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="shop-search-field__clear"
                  aria-label="Clear search"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              ) : (
                <Search size={14} className="shop-search-field__icon" aria-hidden="true" />
              )}
            </div>

            <div className="shop-sort-wrap">
              <label htmlFor="shop-sort" className="sr-only">Sort products</label>
              <ArrowUpDown size={13} className="shop-sort-icon" aria-hidden="true" />
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="shop-sort-select"
                aria-label="Sort products by"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Bar / Status */}
        <div className="shop-status-bar">
          <div className="shop-status-bar__left">
            <span className="shop-status-bar__count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} available
            </span>
            {selectedCategory !== 'All' && (
              <span className="shop-status-bar__active-tag">
                Category: <strong>{selectedCategory}</strong>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="shop-status-bar__active-tag">
                Query: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="shop-status-bar__reset-btn"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Product Grid / Empty State */}
      <section className="shop-catalog container" aria-label="Product Catalog">
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} variant="editorial" />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <SlidersHorizontal size={24} className="empty-state__icon" aria-hidden="true" />
            </div>
            <p className="eyebrow">Zero Matches</p>
            <h2 className="empty-state__title">
              No pieces match your filter criteria.
            </h2>
            <p className="empty-state__description">
              Try adjusting your search terms, changing the category, or clearing your active filters to view the full atelier catalogue.
            </p>
            <div className="empty-state__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
              <Link to="/stylist" className="button button--primary">
                <Sparkles size={14} style={{ marginRight: '8px' }} aria-hidden="true" />
                Ask AI Stylist
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}