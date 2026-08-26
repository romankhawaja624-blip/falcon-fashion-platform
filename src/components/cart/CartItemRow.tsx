import { Minus, Plus, X, Heart } from 'lucide-react';
import { useCart, type CartItem } from '../../features/cart/CartContext';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useToast } from '../../features/toast/ToastContext';
import { RemoteImage } from '../ui/RemoteImage';

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isSaved = isInWishlist(item.product.slug);

  const handleDecrease = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    const result = updateQuantity(item.id, item.quantity + 1);
    if (!result.success && result.message) {
      showToast(result.message, 'error');
    }
  };

  const handleMoveToWishlist = () => {
    if (!isSaved) {
      toggleWishlist(item.product.slug);
    }
    removeItem(item.id);
    showToast(`${item.product.name} moved to wishlist`, 'success');
  };

  return (
    <article className="cart-item" style={{ borderBottom: '1px solid var(--color-outline-muted)', paddingBlock: '24px' }}>
      <RemoteImage assetId={item.product.imageIds[0]} />
      <div className="cart-item__details">
        <p className="eyebrow" style={{ margin: 0 }}>{item.product.category}</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, margin: '8px 0' }}>
          {item.product.name}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Size {item.size}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
            <button type="button" aria-label="Decrease quantity" onClick={handleDecrease}>
              <Minus size={14} aria-hidden="true" />
            </button>
            <span aria-live="polite" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{item.quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={handleIncrease}>
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={handleMoveToWishlist}
            style={{ fontSize: '11px', textTransform: 'uppercase', background: 'none', border: 0, padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Heart size={12} fill={isSaved ? 'var(--color-champagne)' : 'none'} aria-hidden="true" />
            Save for later
          </button>
        </div>
      </div>
      <strong className="cart-item__price" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 400 }}>
        ${(item.product.priceValue * item.quantity).toLocaleString()}
      </strong>
      <button
        className="icon-button cart-item__remove"
        type="button"
        aria-label={`Remove ${item.product.name}`}
        onClick={() => {
          removeItem(item.id);
          showToast(`${item.product.name} removed from bag`, 'info');
        }}
      >
        <X size={17} aria-hidden="true" />
      </button>
    </article>
  );
}