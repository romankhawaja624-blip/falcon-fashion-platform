import { Link } from 'react-router-dom';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductRail } from '../../components/product/ProductRail';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';
import { getProductStock, products } from '../../data/products';

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
      showToast(`Added ${addedCount} saved ${addedCount === 1 ? 'item' : 'items'} to your bag`, 'success');
    } else {
      showToast('Saved items are currently out of stock.', 'error');
    }
  };

  return (
    <main className="commerce-page wishlist-page">
      {/* Wishlist Header */}
      <section className="wishlist-header container" aria-labelledby="wishlist-title">
        <div className="wishlist-header__inner">
          <div className="wishlist-header__meta">
            <span className="eyebrow">Saved Selection</span>
            <span className="wishlist-header__edition">Private Archive</span>
          </div>
          <h1 id="wishlist-title" className="wishlist-header__title">
            Your Wishlist
          </h1>
          <p className="wishlist-header__description">
            Archived silhouettes, tailoring cuts, and rare textiles held for your future wardrobe curation.
          </p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="wishlist-content container" aria-label="Saved items collection">
        {wishlistItems.length > 0 ? (
          <div>
            {/* Wishlist Toolbar */}
            <div className="wishlist-toolbar">
              <div className="wishlist-toolbar__meta">
                <span className="wishlist-toolbar__count">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'saved silhouette' : 'saved silhouettes'}
                </span>
              </div>

              <div className="wishlist-toolbar__actions">
                <button
                  type="button"
                  className="button button--primary wishlist-toolbar__btn"
                  onClick={handleAddAllToCart}
                >
                  <ShoppingBag size={14} style={{ marginRight: '8px' }} aria-hidden="true" />
                  Add available to bag
                </button>
                <button
                  type="button"
                  className="button button--secondary wishlist-toolbar__btn"
                  onClick={clearWishlist}
                >
                  <Trash2 size={13} style={{ marginRight: '6px' }} aria-hidden="true" />
                  Clear list
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
              {wishlistItems.map((product) => (
                <ProductCard key={product.slug} product={product} variant="editorial" />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon-wrap">
              <Heart size={24} className="empty-state__icon" aria-hidden="true" />
            </div>
            <p className="eyebrow">Private Archive</p>
            <h2 className="empty-state__title">
              Your wishlist is currently empty.
            </h2>
            <p className="empty-state__description">
              Explore the atelier catalog and save pieces that resonate with your personal silhouette and style.
            </p>
            <div className="empty-state__actions">
              <Link className="button button--primary" to="/shop">
                Explore The Atelier Catalog
                <ArrowRight size={14} style={{ marginLeft: '8px' }} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Curated Recommendations */}
      <div className="container" style={{ marginTop: 'clamp(64px, 8vw, 100px)' }}>
        <ProductRail
          title="Curated for your aesthetic"
          description="Explore complementary silhouettes from the latest seasonal edition."
          products={products}
          variant="editorial"
        />
      </div>
    </main>
  );
}

