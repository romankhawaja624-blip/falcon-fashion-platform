import { Link } from 'react-router-dom';
import { useOrders } from '../../features/orders/OrderContext';

export function OrdersPage() {
  const { orders } = useOrders();

  return (
    <main className="flow-page orders-page container" aria-labelledby="orders-title" style={{ paddingBlock: '156px 120px' }}>
      <div className="flow-heading" style={{ borderBlockEnd: '1px solid var(--color-outline-muted)', paddingBlockEnd: '40px' }}>
        <p className="eyebrow">Your Account</p>
        <h1 id="orders-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(48px, 6vw, 80px)', margin: '0 0 16px', lineHeight: 1 }}>
          Your orders
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '520px', margin: 0 }}>
          Manage your commissions, track active shipments, and view past purchases.
        </p>
      </div>

      {orders.length > 0 ? (
        <div style={{ marginTop: '48px', display: 'grid', gap: '24px' }}>
          {orders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <article
                key={order.id}
                className="admin-panel"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'var(--color-surface-low)',
                  border: '1px solid var(--color-outline-muted)',
                  padding: '24px 32px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <span
                      className={`status-pill ${
                        order.status === 'delivered' ? 'status-pill--ready' : ''
                      }`}
                      style={{
                        display: 'inline-flex',
                        border: '1px solid var(--color-outline-muted)',
                        padding: '6px 12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: order.status === 'delivered' ? 'var(--color-champagne)' : 'var(--color-text-muted)',
                        borderColor: order.status === 'delivered' ? 'var(--color-champagne)' : 'var(--color-outline-muted)',
                      }}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 400 }}>
                      {order.id}
                    </strong>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, margin: '8px 0 4px' }}>
                    Placed on {formattedDate}
                  </h2>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} — Total Paid: <strong>${order.total.toLocaleString()}</strong>
                  </p>
                </div>
                <div>
                  <Link className="button button--secondary" to={`/orders/${order.id}`}>
                    Track Order &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div
          className="empty-cart"
          style={{
            display: 'flex',
            minHeight: '360px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            border: '1px solid var(--color-outline-muted)',
            marginTop: '48px',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <p className="eyebrow" style={{ margin: 0 }}>Atelier History</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, margin: 0 }}>
            No orders found.
          </h2>
          <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)' }}>
            Start building your collection and explore current edits.
          </p>
          <Link className="button button--primary" to="/shop">
            Explore pieces
          </Link>
        </div>
      )}
    </main>
  );
}
