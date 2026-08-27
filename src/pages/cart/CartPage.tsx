import { Link } from 'react-router-dom';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { OrderSummary } from '../../components/checkout/OrderSummary';
import { useCart } from '../../features/cart/CartContext';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { Truck } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 1000;

export function CartPage() {
  const { items, itemCount, subtotal, clear } = useCart();

  // Filter cross-sell recommendations
  const cartSlugs = items.map((i) => i.product.slug);
  const crossSellProducts = products.filter((p) => !cartSlugs.includes(p.slug)).slice(0, 4);

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <main className="flow-page cart-page container" aria-labelledby="cart-title" style={{ paddingBlock: '120px 80px' }}>
      <div className="flow-heading">
        <p className="eyebrow">Your atelier</p>
        <h1 id="cart-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 64px)', margin: '0 0 16px', lineHeight: 1 }}>
          Your cart
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '520px', margin: 0 }}>
          {itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'} held for your consideration.`
            : 'Pieces held for your consideration.'}
        </p>
      </div>

      {items.length > 0 ? (
        <>
          {/* Free Delivery Bar */}
          <div style={{
            background: 'var(--color-surface, #141416)',
            border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            margin: '2rem 0 1rem 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Truck size={18} style={{ color: 'var(--color-champagne, #d4af37)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text, #fff)' }}>
                {amountToFreeDelivery > 0
                  ? `Add $${amountToFreeDelivery.toLocaleString()} more to qualify for complimentary express delivery.`
                  : 'You have unlocked complimentary global express delivery!'}
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-champagne, #d4af37)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div className="cart-layout" style={{ marginTop: '2rem' }}>
            <section className="cart-items" aria-label="Cart items">
              {items.map((item) => (
                <CartItemRow item={item} key={item.id} />
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <Button variant="secondary" onClick={clear} style={{ fontSize: '12px', minHeight: '40px' }}>
                  Clear cart
                </Button>
              </div>
            </section>

            <div className="cart-summary">
              <OrderSummary />
              <Link className="button button--primary" to="/checkout" style={{ width: '100%', marginTop: '16px', textAlign: 'center', display: 'block' }}>
                Proceed to secure checkout &rarr;
              </Link>
            </div>
          </div>

          <ProductRail
            title="Complete your collection"
            description="Complementary pieces handpicked for your bag."
            products={crossSellProducts}
          />
        </>
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
            borderRadius: '8px',
          }}
        >
          <p className="eyebrow" style={{ margin: 0 }}>Nothing Selected</p>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '36px', fontWeight: 400, margin: 0 }}>
            Your shopping cart is empty.
          </h2>
          <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)' }}>
            Return to the atelier catalog when a piece speaks to you.
          </p>
          <Link className="button button--primary" to="/shop">
            Explore the shop
          </Link>
        </div>
      )}
    </main>
  );
}