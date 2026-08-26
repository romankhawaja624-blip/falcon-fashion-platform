import { Link, useParams } from 'react-router-dom';
import { useOrders } from '../../features/orders/OrderContext';

export function ConfirmationPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <main className="confirmation-page container" style={{ paddingBlock: '156px 120px', textAlign: 'center' }}>
        <p className="eyebrow">Order not found</p>
        <h1>Unable to load order details.</h1>
        <p style={{ margin: '24px auto', color: 'var(--color-text-muted)', maxWidth: '480px' }}>
          Please verify your order number or check your account dashboard.
        </p>
        <Link className="button button--primary" to="/shop">Return to shop</Link>
      </main>
    );
  }

  return (
    <main className="confirmation-page container" aria-labelledby="confirmation-title" style={{ paddingBlock: '156px 120px' }}>
      <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>Order received / {order.id}</p>
      <h1 id="confirmation-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(40px, 5.5vw, 72px)', margin: '16px 0' }}>
        Thank you for choosing your next piece.
      </h1>
      <p className="confirmation-page__intro" style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 48px' }}>
        Your order is being prepared by the atelier. A confirmation has been reserved for your records.
      </p>

      <div className="confirmation-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBlock: '48px', textAlign: 'start' }}>
        <section style={{ border: '1px solid var(--color-outline-muted)', padding: '32px', background: 'var(--color-surface-low)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, margin: '0 0 20px' }}>Next steps</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '24px', margin: '0 0 24px' }}>
            We'll send delivery updates to <strong>{order.contactEmail}</strong> as your order moves through the atelier.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link className="button button--primary" to={`/orders/${order.id}`}>
              Track your shipment
            </Link>
            <Link className="button button--secondary" to="/orders" style={{ textAlign: 'center' }}>
              View order history
            </Link>
          </div>
        </section>

        <section style={{ border: '1px solid var(--color-outline-muted)', padding: '32px', background: 'var(--color-surface-low)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, margin: '0 0 20px' }}>Summary</h2>
          
          <div style={{ display: 'grid', gap: '16px', margin: '0 0 24px', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '16px' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>
                  {item.productName} (Size {item.size}) <span style={{ color: 'var(--color-text-muted)' }}>× {item.quantity}</span>
                </span>
                <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  ${(item.priceValue * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Method</span>
              <span>{order.delivery.label}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Delivery</span>
              <span>{order.delivery.estimate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Destination</span>
              <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-outline-muted)', paddingTop: '12px', marginTop: '4px', fontSize: '18px', color: 'var(--color-text)' }}>
              <span>Total Paid</span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                ${order.total.toLocaleString()}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: '48px' }}>
        <Link className="text-link" to="/shop">Continue shopping &rarr;</Link>
      </div>
    </main>
  );
}