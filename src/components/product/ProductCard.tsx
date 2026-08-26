import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../data/products';
import { RemoteImage } from '../ui/RemoteImage';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useToast } from '../../features/toast/ToastContext';

export function ProductCard({
  product,
  variant = 'standard',
}: {
  product: Product;
  variant?: 'standard' | 'editorial' | 'compact';
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const saved = isInWishlist(product.slug);

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

  return (
    <article className={`product-card product-card--${variant}`}>
      <div className="product-card__image-wrap" style={{ position: 'relative' }}>
        <Link className="product-card__image" to={`/product/${product.slug}`}>
          <RemoteImage assetId={product.imageIds[0]} />
        </Link>
        <button
          type="button"
          className={`wishlist-card-btn ${saved ? 'wishlist-card-btn--active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
            background: 'color-mix(in srgb, var(--color-background) 70%, transparent)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--color-outline-muted)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: saved ? 'var(--color-champagne)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
        >
          <Heart size={16} fill={saved ? 'var(--color-champagne)' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <div className="product-card__details">
        <div>
          <p className="product-card__category">{product.category}</p>
          <h2>
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h2>
        </div>
        <p className="product-card__price">{product.price}</p>
      </div>
    </article>
  );
}