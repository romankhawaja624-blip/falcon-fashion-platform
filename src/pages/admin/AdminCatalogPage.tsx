import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTable } from '../../components/admin/AdminTable';
import { adminProducts } from '../../data/admin';

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
  { key: 'price', label: 'Price' },
] as const;

export function AdminCatalogPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Low stock' | 'In stock'>('All');

  const filteredProducts = adminProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Low stock' && p.status === 'Low stock') ||
      (filter === 'In stock' && p.status === 'In stock');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Catalog management</p>
          <h1>Product catalog.</h1>
          <p>Manage the pieces presented across the digital atelier.</p>
        </div>
        <Link className="button button--primary" to="/admin/products/new">
          Add product
        </Link>
      </header>
      <div className="admin-toolbar">
        <input
          aria-label="Search products"
          placeholder="Search catalog by SKU, name, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group" role="group" aria-label="Catalog status filter">
          {['All', 'In stock', 'Low stock'].map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${filter === opt ? 'filter-chip--active' : ''}`}
              type="button"
              onClick={() => setFilter(opt as any)}
            >
              {opt === 'All' ? 'All products' : opt}
            </button>
          ))}
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <AdminTable columns={columns as never} rows={filteredProducts as never} />
      ) : (
        <p className="empty-state" style={{ color: 'var(--color-text-muted)', marginTop: '24px' }}>
          No catalog items match your search.
        </p>
      )}
    </div>
  );
}