import { useState } from 'react';
import { AdminMetric } from '../../components/admin/AdminMetric';
import { AdminTable } from '../../components/admin/AdminTable';
import { adminProducts } from '../../data/admin';

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'stock', label: 'Available' },
  { key: 'status', label: 'Signal' },
  { key: 'category', label: 'Category' },
] as const;

export function AdminInventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Low stock' | 'Out of stock'>('All');

  const filteredRows = adminProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Low stock' && p.status === 'Low stock') ||
      (filter === 'Out of stock' && p.status === 'Out of stock');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Inventory management</p>
          <h1>Stock intelligence.</h1>
          <p>Keep the atelier ready for its next order.</p>
        </div>
      </header>
      <section className="admin-metrics admin-metrics--compact">
        <AdminMetric label="Total units" value="1,842" detail="Across 84 SKUs" />
        <AdminMetric label="Low stock" value="06" detail="Needs review" tone="blue" />
        <AdminMetric label="Out of stock" value="02" detail="Replenishment needed" />
      </section>
      <div className="admin-toolbar">
        <input
          aria-label="Search inventory"
          placeholder="Search SKU or product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group" role="group" aria-label="Inventory status filter">
          {['All', 'Low stock', 'Out of stock'].map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${filter === opt ? 'filter-chip--active' : ''}`}
              type="button"
              onClick={() => setFilter(opt as any)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {filteredRows.length > 0 ? (
        <AdminTable columns={columns as never} rows={filteredRows as never} />
      ) : (
        <p className="empty-state">No products match your criteria.</p>
      )}
    </div>
  );
}