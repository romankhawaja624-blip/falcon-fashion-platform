import { Link } from 'react-router-dom';
import { CartItemRow } from '../../components/cart/CartItemRow';
import { OrderSummary } from '../../components/checkout/OrderSummary';
import { useCart } from '../../features/cart/CartContext';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { Truck, ArrowRight, ShoppingBag } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 1000;

export function CartPage() {
  const { items, itemCount, subtotal, clear } = useCart();

  // Filter cross-sell recommendations
  const cartSlugs = items.map((i) => i.product.slug);
  const crossSellProducts = products.filter((p) => !cartSlugs.includes(p.slug)).slice(0, 4);

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <main className="flow-page cart-page container" aria-labelledby="cart-title">
      <div className="flow-heading">
        <p className="eyebrow">Your Atelier Bag</p>
        <h1 id="cart-title" className="cart-page__title">
          Your bag
        </h1>
        <p className="cart-page__subtitle">
          {itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'} held for your consideration.`
            : 'Pieces held for your consideration.'}
        </p>
      </div>

      {items.length > 0 ? (
        <>
          {/* Free Delivery Progression Bar */}
          <div className="delivery-threshold-bar">
            <div className="delivery-threshold-bar__message">
              <Truck size={17} className="delivery-threshold-bar__icon" aria-hidden="true" />
              <span>
                {amountToFreeDelivery > 0
                  ? `Add $${amountToFreeDelivery.toLocaleString()} more to qualify for complimentary express delivery.`
                  : 'You have unlocked complimentary global express delivery.'}
              </span>
            </div>
            <div className="delivery-threshold-bar__track" aria-hidden="true">
              <div
                className="delivery-threshold-bar__progress"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              <div className="cart-items__list">
                {items.map((item) => (
                  <CartItemRow item={item} key={item.id} />
                ))}
              </div>
              <div className="cart-items__footer">
                <Button variant="secondary" onClick={clear} className="cart-items__clear-btn">
                  Clear Bag
                </Button>
              </div>
            </section>

            <aside className="cart-summary" aria-label="Order summary">
              <OrderSummary />
              <Link className="button button--primary cart-summary__checkout-btn" to="/checkout">
                Proceed to Checkout <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </aside>
          </div>

          <ProductRail
            title="Complete your collection"
            description="Complementary pieces handpicked for your bag."
            products={crossSellProducts}
          />
        </>
      ) : (
        <div className="empty-cart-state">
          <div className="empty-cart-state__icon-wrap">
            <ShoppingBag size={32} className="empty-cart-state__icon" aria-hidden="true" />
          </div>
          <p className="eyebrow">Atelier Wardrobe</p>
          <h2 className="empty-cart-state__title">Your shopping bag is empty</h2>
          <p className="empty-cart-state__desc">
            Explore our curated collections, archival pieces, and seasonal drops to begin composing your personal silhouette.
          </p>
          <Link className="button button--primary" to="/shop">
            Explore The Collection <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </main>
  );
}