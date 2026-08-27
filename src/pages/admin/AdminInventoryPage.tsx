import { useState } from 'react';
import { AdminMetric } from '../../components/admin/AdminMetric';
import { products, getProductStock, setProductStock } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { Search, Plus, Minus, Check, RefreshCw } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

export function AdminInventoryPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Healthy' | 'Low stock' | 'Out of stock'>('All');
  const [sortBy, setSortBy] = useState<'stock-asc' | 'stock-desc' | 'name'>('stock-asc');

  // Trigger state refresh when stock changes
  const [, setRefreshKey] = useState(0);

  const handleStockChange = (slug: string, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    setProductStock(slug, nextStock);
    setRefreshKey((k) => k + 1);
    showToast(`Stock for "${slug}" updated to ${nextStock} units`, 'info');
  };

  const handleStockInput = (slug: string, val: string) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setProductStock(slug, parsed);
      setRefreshKey((k) => k + 1);
    }
  };

  const productRows = products.map((p) => {
    const stock = getProductStock(p.slug);
    const status = stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'Healthy';
    return { ...p, stock, status };
  });

  const totalUnits = productRows.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = productRows.filter((p) => p.status === 'Low stock').length;
  const outOfStockCount = productRows.filter((p) => p.status === 'Out of stock').length;
  const healthyCount = productRows.filter((p) => p.status === 'Healthy').length;

  const filteredRows = productRows.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Healthy' && p.status === 'Healthy') ||
      (filter === 'Low stock' && p.status === 'Low stock') ||
      (filter === 'Out of stock' && p.status === 'Out of stock');

    return matchesSearch && matchesFilter;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortBy === 'stock-asc') return a.stock - b.stock;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Inventory Control
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Stock Intelligence
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Adjust units in real-time. Changes sync directly with store stock checks.
          </p>
        </div>
      </header>

      {/* Metrics Header */}
      <section className="admin-metrics admin-metrics--compact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <AdminMetric label="Total Available Units" value={totalUnits.toLocaleString()} detail={`Across ${products.length} SKUs`} />
        <AdminMetric label="Healthy Stock SKUs" value={String(healthyCount)} detail="Stock > 10 units" />
        <AdminMetric label="Low Stock SKUs" value={String(lowStockCount)} detail="1–10 units available" tone="blue" />
        <AdminMetric label="Out of Stock SKUs" value={String(outOfStockCount)} detail="Replenishment needed" />
      </section>

      {/* Toolbar & Filters */}
      <div className="admin-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            aria-label="Search inventory"
            placeholder="Search SKU, item name, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', height: '40px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
          />
        </div>

        {/* Filter Chips */}
        <div className="filter-group" role="group" aria-label="Inventory status filter" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(['All', 'Healthy', 'Low stock', 'Out of stock'] as const).map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${filter === opt ? 'filter-chip--active' : ''}`}
              type="button"
              onClick={() => setFilter(opt)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--color-outline-muted)',
                background: filter === opt ? 'var(--color-champagne, #d4af37)' : 'transparent',
                color: filter === opt ? '#000' : 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sort inventory"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="stock-asc">Sort: Lowest Stock First</option>
          <option value="stock-desc">Sort: Highest Stock First</option>
          <option value="name">Sort: Name (A-Z)</option>
        </select>
      </div>

      {/* Table with Inline Adjustment UI */}
      {sortedRows.length > 0 ? (
        <div className="admin-table-wrap" style={{ border: '1px solid var(--color-outline-muted)', borderRadius: '8px', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--color-surface, #141416)' }}>
            <thead style={{ background: 'var(--color-surface-low, #1c1c1f)', borderBottom: '1px solid var(--color-outline-muted)' }}>
              <tr>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Piece</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>SKU</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Category</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status Signal</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Current Units</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'right' }}>Stock Adjustment</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((p) => (
                <tr key={p.slug} style={{ borderBottom: '1px solid var(--color-outline-muted)' }}>
                  <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '44px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <RemoteImage assetId={p.imageIds[0]} alt={p.name} />
                    </div>
                    <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {p.slug}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{p.category}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: p.status === 'Out of stock' ? 'rgba(255,107,107,0.15)' : p.status === 'Low stock' ? 'rgba(212,175,55,0.15)' : 'rgba(40,167,69,0.15)',
                        color: p.status === 'Out of stock' ? '#ff6b6b' : p.status === 'Low stock' ? 'var(--color-champagne)' : '#28a745',
                        border: `1px solid ${p.status === 'Out of stock' ? '#ff6b6b' : p.status === 'Low stock' ? 'var(--color-champagne)' : '#28a745'}`,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.95rem' }}>
                    <strong>{p.stock}</strong> units
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleStockChange(p.slug, p.stock, -1)}
                        aria-label={`Decrease stock for ${p.name}`}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-outline-muted)',
                          background: 'var(--color-surface-low, #1c1c1f)',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => handleStockInput(p.slug, e.target.value)}
                        aria-label={`Set stock quantity for ${p.name}`}
                        style={{
                          width: '56px',
                          height: '28px',
                          textAlign: 'center',
                          background: 'var(--color-surface-low, #1c1c1f)',
                          border: '1px solid var(--color-outline-muted)',
                          borderRadius: '4px',
                          color: 'var(--color-text)',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.85rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleStockChange(p.slug, p.stock, 1)}
                        aria-label={`Increase stock for ${p.name}`}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-outline-muted)',
                          background: 'var(--color-surface-low, #1c1c1f)',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>No Stock Match</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0.5rem 0' }}>No inventory items found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No products match your current search query or stock signal filter.
          </p>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              setSearch('');
              setFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}