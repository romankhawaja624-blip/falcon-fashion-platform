import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { MetricWidget } from '../../components/atelier/MetricWidget';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { useOrders } from '../../features/orders/OrderContext';
import { useAccount } from '../../features/account/AccountContext';
import { Crown, ShieldCheck, Award, ArrowRight, Package } from 'lucide-react';

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
        <article className="active-order-widget" style={{ minHeight: '220px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low, #141416)', padding: '1.75rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="eyebrow" style={{ margin: 0 }}>ACTIVE COMMISSION</p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-champagne, #C2A878)', textTransform: 'uppercase' }}>
                LIVE DISPATCH
              </span>
            </div>
            <h2 style={{ margin: '1.25rem 0 0.5rem', fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.75rem', fontWeight: 400, textTransform: 'capitalize' }}>
              {statusLabel}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
              {firstItem?.productName} {itemsCount > 1 ? `+ ${itemsCount - 1} more` : ''}
            </p>
          </div>
          <div>
            <div className="progress-line" style={{ height: '3px', marginTop: '1.25rem', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <span style={{ display: 'block', width: progressWidth, height: '100%', background: 'var(--color-champagne, #C2A878)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <small style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase' }}>
                Est: {activeOrder.delivery.estimate}
              </small>
              <Link className="text-link" to={`/orders/${activeOrder.id}`} style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Track <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </article>
      );
    }

    if (latestOrder) {
      return (
        <article className="active-order-widget" style={{ minHeight: '220px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low, #141416)', padding: '1.75rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>LATEST COMMISSION</p>
            <h2 style={{ margin: '1.25rem 0 0.5rem', fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.75rem', fontWeight: 400 }}>
              Delivered
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
              Order #{latestOrder.id}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link className="text-link" to={`/orders/${latestOrder.id}`} style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Details <ArrowRight size={10} />
            </Link>
            <Link className="text-link" to="/orders" style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              All Orders
            </Link>
          </div>
        </article>
      );
    }

    // No orders yet
    return (
      <article className="active-order-widget" style={{ minHeight: '220px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low, #141416)', padding: '1.75rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>COMMISSIONS</p>
          <h2 style={{ margin: '1.25rem 0 0.5rem', fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.75rem', fontWeight: 400 }}>
            No Orders Yet
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
            Your atelier archive is empty.
          </p>
        </div>
        <div>
          <Link className="text-link" to="/shop" style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Start shopping <ArrowRight size={10} />
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div className="atelier-page dashboard-page" style={{ paddingBottom: '4rem' }}>
      <header className="atelier-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: 0 }}>MY ATELIER</span>
            <span style={{ color: 'var(--color-outline-muted)' }}>/</span>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '2px',
              border: '1px solid var(--color-champagne)',
              color: 'var(--color-champagne)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}>
              {membership === 'pro' ? <Crown size={12} /> : <ShieldCheck size={12} />}
              {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 400, margin: '0.25rem 0', letterSpacing: '-0.02em' }}>
            Welcome back,<br />{profile.name}.
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link className="button button--secondary" to="/atelier/settings">
            Account Settings &rarr;
          </Link>
        </div>
      </header>

      <section className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {renderActiveOrderWidget()}
        
        <Link to="/atelier/wardrobe" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MetricWidget label="Digital Wardrobe" value="42" detail="Garments Cataloged" />
        </Link>
        
        <Link to="/atelier/intelligence" style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="metric-widget" style={{ border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low, #141416)', padding: '1.75rem', borderRadius: '4px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p className="eyebrow" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} style={{ color: 'var(--color-champagne)' }} /> STYLE JOURNEY
              </p>
              <h3 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2rem', margin: '1.25rem 0 0.25rem', fontWeight: 400 }}>
                {xp.toLocaleString()} XP
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {level} • {coins} Coins Available
              </p>
            </div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--color-champagne)', marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              View Rewards <ArrowRight size={10} />
            </span>
          </article>
        </Link>

        <AiEntryCard />
      </section>

      <div className="dashboard-rail">
        <ProductRail title="Your considered edit" description="Curated tailored silhouettes selected from your wardrobe and style profile." products={products} />
      </div>
    </div>
  );
}