import { Link } from 'react-router-dom';
import { AdminMetric } from '../../components/admin/AdminMetric';
import { products, getProductStock } from '../../data/products';
import { useOrders } from '../../features/orders/OrderContext';
import { useState, useEffect } from 'react';
import { Package, Users, HelpCircle, Shield, ShoppingBag, PlusCircle, ArrowRight } from 'lucide-react';

export function AdminOverviewPage() {
  const { orders } = useOrders();
  const [ticketCount, setTicketCount] = useState(3);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('falcon_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTicketCount(parsed.filter((t: { status: string }) => t.status !== 'Resolved').length);
        }
      }
    } catch {
      // keep fallback
    }
  }, []);

  const totalRealRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const displayRevenue = `$${(284500 + totalRealRevenue).toLocaleString()}`;
  const totalOrdersCount = 1284 + orders.length;

  const lowStockProducts = products.filter((p) => {
    const stock = getProductStock(p.slug);
    return stock > 0 && stock <= 10;
  });

  const outOfStockProducts = products.filter((p) => getProductStock(p.slug) === 0);

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Operations & Executive Intelligence
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Atelier Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Real-time status across products, orders, inventory, and client service.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="button button--primary" to="/admin/products/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={16} /> Add new piece
          </Link>
          <Link className="button button--secondary" to="/admin/products">
            View catalog
          </Link>
        </div>
      </header>

      {/* Commerce & Operational Metrics */}
      <section className="admin-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <AdminMetric label="Net Revenue" value={displayRevenue} detail={`+18.4% this month (${orders.length} new)`} tone="blue" />
        <AdminMetric label="Total Orders" value={totalOrdersCount.toLocaleString()} detail={`${orders.length} placed via store`} />
        <AdminMetric label="Active Catalog" value={String(products.length)} detail="100% indexed in registry" />
        <AdminMetric label="Atelier Members" value="8,492" detail="1,240 Pro tier" />
        <AdminMetric label="Open Support" value={String(ticketCount)} detail={ticketCount > 0 ? 'Action required' : 'All resolved'} tone={ticketCount > 0 ? 'blue' : undefined} />
      </section>

      {/* Quick Navigation Panel */}
      <section style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', marginBottom: '0.5rem' }}>Quick Actions</p>
        <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0 0 1rem 0' }}>Operational Navigation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <Link to="/admin/products/new" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <PlusCircle size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Add Product</span>
          </Link>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <Package size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Product Catalog</span>
          </Link>
          <Link to="/admin/inventory" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ShoppingBag size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Stock Inventory</span>
          </Link>
          <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <Users size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Customer Roster</span>
          </Link>
          <Link to="/admin/orders/FX-1048" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ShoppingBag size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Order Processing</span>
          </Link>
          <Link to="/admin/support" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <HelpCircle size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Support Desk</span>
          </Link>
          <Link to="/admin/legal" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
            <Shield size={16} style={{ color: 'var(--color-champagne)' }} />
            <span>Legal & Regional</span>
          </Link>
        </div>
      </section>

      {/* Grid overview */}
      <section className="admin-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <article className="admin-panel admin-chart" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div className="admin-panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>Revenue Pulse</p>
              <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>30-Day Trajectory</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Live Analytics</span>
          </div>
          <div className="chart-bars" aria-label="Revenue trend" style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', paddingBottom: '8px', borderBottom: '1px solid var(--color-outline-muted)' }}>
            <span style={{ height: '38%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.4, borderRadius: '2px' }} />
            <span style={{ height: '52%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.5, borderRadius: '2px' }} />
            <span style={{ height: '45%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.45, borderRadius: '2px' }} />
            <span style={{ height: '68%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.65, borderRadius: '2px' }} />
            <span style={{ height: '62%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.6, borderRadius: '2px' }} />
            <span style={{ height: '84%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.85, borderRadius: '2px' }} />
            <span style={{ height: '72%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 0.7, borderRadius: '2px' }} />
            <span style={{ height: '96%', flex: 1, background: 'var(--color-champagne, #d4af37)', opacity: 1, borderRadius: '2px' }} />
          </div>
        </article>

        <article className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div className="admin-panel-heading" style={{ marginBottom: '1rem' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Operational Alerts</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>Immediate Attention</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'grid', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', fontSize: '0.9rem' }}>
              <span>Low stock products</span>
              <strong style={{ color: lowStockProducts.length > 0 ? 'var(--color-champagne)' : 'inherit' }}>{lowStockProducts.length}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', fontSize: '0.9rem' }}>
              <span>Out of stock products</span>
              <strong style={{ color: outOfStockProducts.length > 0 ? '#ff6b6b' : 'inherit' }}>{outOfStockProducts.length}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', fontSize: '0.9rem' }}>
              <span>Open support tickets</span>
              <strong>{ticketCount}</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', fontSize: '0.9rem' }}>
              <span>Recent store orders</span>
              <strong>{orders.length}</strong>
            </li>
          </ul>
          <Link className="text-link" to="/admin/inventory" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
            Review stock signals <ArrowRight size={14} />
          </Link>
        </article>
      </section>

      {/* Catalog Health Overview */}
      <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
        <div className="admin-panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>Catalog Health</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>Inventory Signals</h2>
          </div>
          <Link className="text-link" to="/admin/products" style={{ fontSize: '0.9rem' }}>
            Manage full catalog &rarr;
          </Link>
        </div>
        <div className="admin-signal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {products.slice(0, 6).map((product) => {
            const stock = getProductStock(product.slug);
            const statusLabel = stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'Healthy';
            return (
              <div key={product.slug} style={{ padding: '1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px' }}>
                <span className="eyebrow" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>{product.category}</span>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.5rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{product.name}</strong>
                <small style={{ color: stock === 0 ? '#ff6b6b' : stock <= 10 ? 'var(--color-champagne)' : 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                  {stock} units / {statusLabel}
                </small>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}