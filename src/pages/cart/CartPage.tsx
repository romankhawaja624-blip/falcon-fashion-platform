import { Link } from 'react-router-dom';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { OrderSummary } from '../../components/checkout/OrderSummary';
import { useCart } from '../../features/cart/CartContext';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';

export function CartPage() {
  const { items, itemCount, clear } = useCart();

  // Filter cross-sell recommendations
  const cartSlugs = items.map((i) => i.product.slug);
  const crossSellProducts = products.filter((p) => !cartSlugs.includes(p.slug)).slice(0, 4);

  return (
    <main className="flow-page cart-page container" aria-labelledby="cart-title" style={{ paddingBlock: '156px 120px' }}>
      <div className="flow-heading">
        <p className="eyebrow">Your atelier</p>
        <h1 id="cart-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(48px, 6vw, 80px)', margin: '0 0 16px', lineHeight: 1 }}>
          Your cart
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '520px', margin: 0 }}>
          {itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'} held for your consideration.`
            : 'Pieces held for your consideration.'}
        </p>
      </div>

      {items.length ? (
        <>
          <div className="cart-layout" style={{ marginTop: '48px' }}>
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
              <Link className="button button--primary" to="/checkout" style={{ width: '100%', marginTop: '16px', textAlign: 'center' }}>
                Secure checkout
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
        <div className="empty-cart">
          <p className="eyebrow">Nothing selected</p>
          <h2>Your cart is waiting.</h2>
          <p>Return to the atelier when a piece speaks to you.</p>
          <Link className="button button--secondary" to="/shop">
            Continue shopping
          </Link>
        </div>
      )}
    </main>
  );
}