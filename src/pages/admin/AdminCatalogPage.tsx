import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products, getProductStock } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { PlusCircle, ExternalLink, Edit3, Search, SlidersHorizontal } from 'lucide-react';

export function AdminCatalogPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'In stock' | 'Low stock' | 'Out of stock'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'price-desc' | 'price-asc' | 'stock-asc'>('name');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const stock = getProductStock(p.slug);
    const status = stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'In stock';

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'In stock' && status === 'In stock') ||
      (stockFilter === 'Low stock' && status === 'Low stock') ||
      (stockFilter === 'Out of stock' && status === 'Out of stock');

    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-desc') return b.priceValue - a.priceValue;
    if (sortBy === 'price-asc') return a.priceValue - b.priceValue;
    if (sortBy === 'stock-asc') return getProductStock(a.slug) - getProductStock(b.slug);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Catalog Management
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Product Catalog ({sortedProducts.length} pieces)
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Manage silhouettes, prices, and availability across the digital atelier.
          </p>
        </div>
        <Link className="button button--primary" to="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <PlusCircle size={16} /> Add product
        </Link>
      </header>

      {/* Toolbar & Filters */}
      <div className="admin-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            aria-label="Search products"
            placeholder="Search catalog by name, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', height: '40px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
          />
        </div>

        {/* Category Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--color-text-muted)' }} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter Chips */}
        <div className="filter-group" role="group" aria-label="Stock status filter" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['All', 'In stock', 'Low stock', 'Out of stock'] as const).map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${stockFilter === opt ? 'filter-chip--active' : ''}`}
              type="button"
              onClick={() => setStockFilter(opt)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--color-outline-muted)',
                background: stockFilter === opt ? 'var(--color-champagne, #d4af37)' : 'transparent',
                color: stockFilter === opt ? '#000' : 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sort catalog"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="name">Sort: Name (A-Z)</option>
          <option value="price-desc">Sort: Price (High to Low)</option>
          <option value="price-asc">Sort: Price (Low to High)</option>
          <option value="stock-asc">Sort: Stock (Lowest First)</option>
        </select>
      </div>

      {/* Catalog Table */}
      {sortedProducts.length > 0 ? (
        <div className="admin-table-wrap" style={{ border: '1px solid var(--color-outline-muted)', borderRadius: '8px', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--color-surface, #141416)' }}>
            <thead style={{ background: 'var(--color-surface-low, #1c1c1f)', borderBottom: '1px solid var(--color-outline-muted)' }}>
              <tr>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Item</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>SKU / Slug</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Category</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Price</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Stock</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((p) => {
                const stock = getProductStock(p.slug);
                const status = stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'In stock';
                return (
                  <tr key={p.slug} style={{ borderBottom: '1px solid var(--color-outline-muted)' }}>
                    <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '48px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                        <RemoteImage assetId={p.imageIds[0]} alt={p.name} />
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{p.name}</strong>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {p.slug}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{p.category}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.9rem' }}>{p.price}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                      <strong>{stock}</strong> units
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          background: stock === 0 ? 'rgba(255,107,107,0.15)' : stock <= 10 ? 'rgba(212,175,55,0.15)' : 'rgba(40,167,69,0.15)',
                          color: stock === 0 ? '#ff6b6b' : stock <= 10 ? 'var(--color-champagne)' : '#28a745',
                          border: `1px solid ${stock === 0 ? '#ff6b6b' : stock <= 10 ? 'var(--color-champagne)' : '#28a745'}`,
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <Link
                          to={`/product/${p.slug}`}
                          title="View on Storefront"
                          style={{ color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}
                        >
                          <ExternalLink size={14} /> View PDP
                        </Link>
                        <Link
                          to={`/admin/products/new?edit=${p.slug}`}
                          title="Edit Product"
                          style={{ color: 'var(--color-champagne)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}
                        >
                          <Edit3 size={14} /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>Zero matches</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0.5rem 0' }}>No catalog items match your criteria</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try resetting your search query or filter selection.
          </p>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setStockFilter('All');
            }}
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}