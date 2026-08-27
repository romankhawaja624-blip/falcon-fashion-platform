import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { MetricWidget } from '../../components/atelier/MetricWidget';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { useOrders } from '../../features/orders/OrderContext';
import { useAccount } from '../../features/account/AccountContext';
import { Crown, ShieldCheck, Award, Coins } from 'lucide-react';

export function DashboardPage() {
  const { orders } = useOrders();
  const { profile, membership, xp, coins, level } = useAccount();

  // Find the latest order that is not delivered yet (in transit)
  const activeOrder = orders.find((o) => o.status !== 'delivered');
  const latestOrder = activeOrder || orders[0];

  const renderActiveOrderWidget = () => {
    if (activeOrder) {
      const itemsCount = activeOrder.items.reduce((sum, item) => sum + item.quantity, 0);
      const firstItem = activeOrder.items[0];
      const statusLabel = activeOrder.status.replace(/_/g, ' ');

      // Determine progress bar width
      let progressWidth = '20%';
      if (activeOrder.status === 'confirmed') progressWidth = '40%';
      else if (activeOrder.status === 'preparing') progressWidth = '60%';
      else if (activeOrder.status === 'shipped') progressWidth = '80%';
      else if (activeOrder.status === 'out_for_delivery') progressWidth = '95%';

      return (
        <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px', borderRadius: '8px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Active Order</p>
          <h2 style={{ margin: '48px 0 8px', fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 400 }}>
            {statusLabel}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
            {firstItem?.productName} {itemsCount > 1 ? `+ ${itemsCount - 1} more` : ''}
          </p>
          <div className="progress-line" style={{ height: '4px', marginTop: '24px', background: 'var(--color-surface-highest)' }}>
            <span style={{ display: 'block', width: progressWidth, height: '100%', background: 'var(--color-champagne)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <small style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase' }}>
              Est: {activeOrder.delivery.estimate}
            </small>
            <Link className="text-link" to={`/orders/${activeOrder.id}`} style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Track &rarr;
            </Link>
          </div>
        </article>
      );
    }

    if (latestOrder) {
      // Show link to the latest order (which is delivered)
      return (
        <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px', borderRadius: '8px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Past Order</p>
          <h2 style={{ margin: '48px 0 8px', fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 400 }}>
            Delivered
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
            Order {latestOrder.id}
          </p>
          <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link className="text-link" to={`/orders/${latestOrder.id}`} style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              View details &rarr;
            </Link>
            <Link className="text-link" to="/orders" style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              All orders
            </Link>
          </div>
        </article>
      );
    }

    // No orders yet
    return (
      <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px', borderRadius: '8px' }}>
        <p className="eyebrow" style={{ margin: 0 }}>Active Order</p>
        <h2 style={{ margin: '48px 0 8px', fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 400 }}>
          No orders yet
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
          Your atelier is empty.
        </p>
        <div style={{ marginTop: '36px' }}>
          <Link className="text-link" to="/shop" style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Start shopping &rarr;
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div className="atelier-page dashboard-page" style={{ paddingBottom: '3rem' }}>
      <header className="atelier-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', margin: 0 }}>My Atelier</span>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid var(--color-champagne)',
              color: 'var(--color-champagne)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textTransform: 'uppercase',
            }}>
              {membership === 'pro' ? <Crown size={12} /> : <ShieldCheck size={12} />}
              {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: 0 }}>
            Welcome back,<br />{profile.name}.
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link className="button button--secondary" to="/atelier/settings">
            Account Settings &rarr;
          </Link>
        </div>
      </header>

      <section className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {renderActiveOrderWidget()}
        
        <Link to="/atelier/wardrobe" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MetricWidget label="Digital Wardrobe" value="42" detail="Items Cataloged" />
        </Link>
        
        <Link to="/atelier/intelligence" style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="metric-widget" style={{ border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p className="eyebrow" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} style={{ color: 'var(--color-champagne)' }} /> Style Journey
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '16px 0 4px', fontWeight: 400 }}>
                {xp.toLocaleString()} XP
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {level} • {coins} Coins available
              </p>
            </div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--color-champagne)', marginTop: '16px' }}>
              View rewards &rarr;
            </span>
          </article>
        </Link>

        <AiEntryCard />
      </section>

      <div className="dashboard-rail">
        <ProductRail title="Your considered edit" description="Selected from your wardrobe and style profile." products={products} />
      </div>
    </div>
  );
}