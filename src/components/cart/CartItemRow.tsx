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
    <article className="cart-item">
      <div className="cart-item__image">
        <RemoteImage assetId={item.product.imageIds[0]} />
      </div>
      <div className="cart-item__details">
        <p className="eyebrow">{item.product.category}</p>
        <h3 className="cart-item__title">
          {item.product.name}
        </h3>
        <p className="cart-item__size">
          Size {item.size}
        </p>
        <div className="cart-item__controls">
          <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={handleDecrease}
              className="quantity-control__btn"
            >
              <Minus size={13} aria-hidden="true" />
            </button>
            <span aria-live="polite" className="quantity-control__val">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={handleIncrease}
              className="quantity-control__btn"
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="cart-item__save-btn"
            onClick={handleMoveToWishlist}
          >
            <Heart size={12} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
            <span>Save for later</span>
          </button>
        </div>
      </div>
      <strong className="cart-item__price">
        ${(item.product.priceValue * item.quantity).toLocaleString()}
      </strong>
      <button
        className="cart-item__remove"
        type="button"
        aria-label={`Remove ${item.product.name}`}
        onClick={() => {
          removeItem(item.id);
          showToast(`${item.product.name} removed from bag`, 'info');
        }}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </article>
  );
}