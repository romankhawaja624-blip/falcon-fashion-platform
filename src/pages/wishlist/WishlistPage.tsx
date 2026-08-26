import { Link } from 'react-router-dom';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';

export function WishlistPage() {
  const { wishlistItems, clearWishlist } = useWishlist();

  return (
    <main className="flow-page wishlist-page container" aria-labelledby="wishlist-title" style={{ paddingBlock: '156px 120px' }}>
      <div className="flow-heading">
        <p className="eyebrow">Saved Pieces</p>
        <h1 id="wishlist-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(48px, 6vw, 80px)', margin: '0 0 16px', lineHeight: 1 }}>
          Your wishlist
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '520px', margin: 0 }}>
          Archived silhouettes for future consideration.
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'saved piece' : 'saved pieces'}
            </span>
            <Button variant="secondary" onClick={clearWishlist} style={{ fontSize: '11px', minHeight: '36px' }}>
              Clear wishlist
            </Button>
          </div>

          <div className="product-grid">
            {wishlistItems.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
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
          <p className="eyebrow" style={{ margin: 0 }}>Saved Selection</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400, margin: 0 }}>
            Your wishlist is empty.
          </h2>
          <p style={{ margin: '0 0 12px', color: 'var(--color-text-muted)' }}>
            Explore the catalog and save pieces that resonate with your personal style.
          </p>
          <Link className="button button--primary" to="/shop">
            Explore catalog
          </Link>
        </div>
      )}
    </main>
  );
}
