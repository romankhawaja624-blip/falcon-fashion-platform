import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { useCheckout } from '../../features/checkout/CheckoutContext';
import { RemoteImage } from '../ui/RemoteImage';
import { Sparkles } from 'lucide-react';

export function OrderSummary({ compact = false }: { compact?: boolean }) {
  const { items, subtotal } = useCart();
  const { selectedDelivery } = useCheckout();
  const location = useLocation();

  const isCheckout = location.pathname.startsWith('/checkout');
  const shippingCost = isCheckout ? selectedDelivery.price : (subtotal === 0 || subtotal >= 1500 ? 0 : 25);
  const total = subtotal + shippingCost;
  const amountToFreeShipping = 1500 - subtotal;

  return (
    <aside className={`order-summary ${compact ? 'order-summary--compact' : ''}`} aria-labelledby="summary-title">
      <div className="order-summary__heading">
        <h2 id="summary-title">Order summary</h2>
        <span>{items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
      </div>

      {!isCheckout && subtotal > 0 && amountToFreeShipping > 0 && (
        <div
          className="promo-banner"
          style={{
            marginBlock: '16px',
            padding: '12px',
            background: 'color-mix(in srgb, var(--color-champagne) 10%, var(--color-surface))',
            border: '1px solid color-mix(in srgb, var(--color-champagne) 25%, transparent)',
            borderRadius: 'var(--radius-control)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-champagne)',
          }}
        >
          <Sparkles size={14} style={{ flexShrink: 0 }} aria-hidden="true" />
          <span>Add <strong>${amountToFreeShipping.toLocaleString()}</strong> more for complimentary delivery.</span>
        </div>
      )}

      <div className="order-summary__items">
        {items.map((item) => (
          <div className="order-summary__item" key={item.id}>
            <RemoteImage assetId={item.product.imageIds[0]} />
            <div>
              <p>{item.product.name}</p>
              <span>Size {item.size} / Qty {item.quantity}</span>
            </div>
            <strong>${(item.product.priceValue * item.quantity).toLocaleString()}</strong>
          </div>
        ))}
      </div>
      <div className="order-summary__totals">
        <p>
          <span>Subtotal</span>
          <strong>${subtotal.toLocaleString()}</strong>
        </p>
        <p>
          <span>Shipping</span>
          <strong>{shippingCost ? `$${shippingCost}` : 'Complimentary'}</strong>
        </p>
        {isCheckout && (
          <p style={{ margin: '10px 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            <span>Delivery Method</span>
            <span>{selectedDelivery.label}</span>
          </p>
        )}
        <p className="order-summary__total">
          <span>Total</span>
          <strong>${total.toLocaleString()}</strong>
        </p>
      </div>
      {!compact && <Link className="text-link" to="/shop">Continue shopping</Link>}
    </aside>
  );
}