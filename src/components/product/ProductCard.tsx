import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Check } from 'lucide-react';
import { getProductStock, type Product } from '../../data/products';
import { RemoteImage } from '../ui/RemoteImage';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';

export function ProductCard({
  product,
  variant = 'editorial',
  isFalconEdit = false,
}: {
  product: Product;
  variant?: 'standard' | 'editorial' | 'compact';
  isFalconEdit?: boolean;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showSizes, setShowSizes] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const saved = isInWishlist(product.slug);
  const stock = getProductStock(product.slug);
  const isOutOfStock = stock <= 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.slug);
    if (added) {
      showToast(`${product.name} saved to wishlist`, 'success');
    } else {
      showToast(`${product.name} removed from wishlist`, 'info');
    }
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (product.sizes.length <= 1) {
      const size = product.sizes[0] || 'One Size';
      const res = addItem(product, size);
      if (res.success !== false) {
        showToast(`${product.name} added to your bag`, 'success');
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      } else {
        showToast(res.message ?? 'Could not add to bag', 'error');
      }
    } else {
      setShowSizes((prev) => !prev);
    }
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addItem(product, size);
    if (res.success !== false) {
      showToast(`${product.name} (${size}) added to your bag`, 'success');
      setJustAdded(true);
      setShowSizes(false);
      setTimeout(() => setJustAdded(false), 2000);
    } else {
      showToast(res.message ?? 'Could not add to bag', 'error');
    }
  };

  return (
    <article
      className={`product-card product-card--${variant}`}
      onMouseLeave={() => setShowSizes(false)}
    >
      <div className="product-card__image-wrap">
        <Link className="product-card__image" to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <RemoteImage assetId={product.imageIds[0]} alt={`${product.name} campaign photography`} />
        </Link>

        {/* Restrained Editorial Indicator */}
        {isFalconEdit && (
          <div className="product-card__badge" aria-label="The Falcon Edit">
            <span>THE FALCON EDIT</span>
          </div>
        )}

        {/* Minimal Wishlist Button */}
        <button
          type="button"
          className={`wishlist-card-btn ${saved ? 'wishlist-card-btn--active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart size={14} fill={saved ? 'var(--color-champagne, #C2A878)' : 'none'} aria-hidden="true" />
        </button>

        {/* Quiet Quick Add Floating Action */}
        <div className="product-card__quick-add-wrap" aria-label="Quick purchase actions">
          {isOutOfStock ? (
            <div className="product-card__sold-out-pill" aria-label="Out of stock">
              <span>SOLD OUT</span>
            </div>
          ) : justAdded ? (
            <div className="product-card__added-pill" aria-label="Item added to bag">
              <Check size={13} aria-hidden="true" />
              <span>ADDED TO BAG</span>
            </div>
          ) : showSizes ? (
            <div className="product-card__size-selector" aria-label="Select size">
              <span className="product-card__size-prompt">SELECT SIZE:</span>
              <div className="product-card__size-list">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="product-card__size-btn"
                    onClick={(e) => handleSizeSelect(e, size)}
                    aria-label={`Size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="product-card__quick-add-btn"
              onClick={handleQuickAddClick}
              aria-label={`Quick add ${product.name} to bag`}
            >
              <Plus size={13} aria-hidden="true" />
              <span>QUICK ADD</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Product Details */}
      <div className="product-card__details">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__title">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">{product.price}</p>
      </div>
    </article>
  );
}