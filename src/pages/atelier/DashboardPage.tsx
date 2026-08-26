import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { MetricWidget } from '../../components/atelier/MetricWidget';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { useOrders } from '../../features/orders/OrderContext';

export function DashboardPage() {
  const { orders } = useOrders();

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
        <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Active order</p>
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
        <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Past order</p>
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
      <article className="active-order-widget" style={{ minHeight: '210px', border: '1px solid var(--color-outline-muted)', background: 'var(--color-surface-low)', padding: '24px' }}>
        <p className="eyebrow" style={{ margin: 0 }}>Active order</p>
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
    <div className="atelier-page dashboard-page">
      <header className="atelier-page-heading">
        <div>
          <p className="eyebrow">My Atelier</p>
          <h1>Welcome back,<br />Alex.</h1>
        </div>
        <Link className="text-link" to="/atelier/settings">Settings &rarr;</Link>
      </header>
      <section className="dashboard-grid">
        {renderActiveOrderWidget()}
        <MetricWidget label="Wardrobe" value="42" detail="Items" />
        <MetricWidget label="Style score" value="72" detail="Intelligence level" tone="blue" />
        <AiEntryCard />
      </section>
      <div className="dashboard-rail">
        <ProductRail title="Your considered edit" description="Selected from your wardrobe and style profile." products={products} />
      </div>
    </div>
  );
}