import { Link } from 'react-router-dom';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ProductCard } from '../../components/product/ProductCard';
import { Button } from '../../components/ui/Button';
import { ShoppingBag } from 'lucide-react';
import { getProductStock } from '../../data/products';

export function WishlistPage() {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlistItems.forEach((product) => {
      const stock = getProductStock(product.slug);
      if (stock > 0) {
        const res = addItem(product, product.sizes[0] || 'One Size');
        if (res.success !== false) {
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      showToast(`Added ${addedCount} saved ${addedCount === 1 ? 'item' : 'items'} to your cart`, 'success');
    } else {
      showToast('Saved items are currently out of stock.', 'error');
    }
  };

  return (
    <main className="flow-page wishlist-page container" aria-labelledby="wishlist-title" style={{ paddingBlock: '120px 80px' }}>
      <div className="flow-heading">
        <p className="eyebrow">Saved Pieces</p>
        <h1 id="wishlist-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 64px)', margin: '0 0 16px', lineHeight: 1 }}>
          Your wishlist
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '520px', margin: 0 }}>
          Archived silhouettes held for your future consideration.
        </p>
      </div>

      {wishlistItems.length > 0 ? (
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', textTransform: 'uppercase' }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'saved piece' : 'saved pieces'}
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="primary" onClick={handleAddAllToCart} style={{ fontSize: '12px', minHeight: '36px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                <ShoppingBag size={14} /> Add all available to bag
              </Button>
              <Button variant="secondary" onClick={clearWishlist} style={{ fontSize: '12px', minHeight: '36px' }}>
                Clear wishlist
              </Button>
            </div>
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
            borderRadius: '8px',
          }}
        >
          <p className="eyebrow" style={{ margin: 0 }}>Saved Selection</p>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '36px', fontWeight: 400, margin: 0 }}>
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
