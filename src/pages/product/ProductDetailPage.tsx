import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getProduct, getProductStock, products } from '../../data/products';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { useCart } from '../../features/cart/CartContext';
import { useWishlist } from '../../features/wishlist/WishlistContext';
import { useRecentlyViewed } from '../../features/recently-viewed/RecentlyViewedContext';
import { useToast } from '../../features/toast/ToastContext';

export function ProductDetailPage() {
  const { slug = 'obsidian-wool-coat' } = useParams();
  const product = getProduct(slug);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { trackView, recentProducts } = useRecentlyViewed();
  const { showToast } = useToast();

  const stock = getProductStock(product.slug);
  const isSaved = isInWishlist(product.slug);

  useEffect(() => {
    if (product.slug) {
      trackView(product.slug);
    }
  }, [product.slug, trackView]);

  const toggleAccordion = (id: string) =>
    setOpenAccordion((current) => (current === id ? null : id));

  const handleAddToBag = () => {
    if (!selectedSize && product.sizes.length > 0) {
      showToast('Please select a size.', 'error');
      return;
    }
    const result = addItem(product, selectedSize || 'One Size');
    if (result.success === false) {
      showToast(result.message || 'Cannot add item to bag.', 'error');
    } else {
      showToast(`${product.name} (Size ${selectedSize || 'One Size'}) added to bag`, 'success');
    }
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product.slug);
    if (added) {
      showToast(`${product.name} saved to wishlist`, 'success');
    } else {
      showToast(`${product.name} removed from wishlist`, 'info');
    }
  };

  /* Build related-products from pairsWith slugs, then fall back to category peers */
  const relatedProducts = product.pairsWith
    ? (product.pairsWith
        .map((s) => products.find((p) => p.slug === s))
        .filter(Boolean)
        .slice(0, 4) as typeof products)
    : products.filter((item) => item.slug !== product.slug).slice(0, 4);

  /* Recently viewed products excluding current product */
  const otherRecentProducts = recentProducts.filter((p) => p.slug !== product.slug);

  /* Accordion sections assembled from product metadata */
  const accordionSections = [
    product.material ? { id: 'material', label: 'Material & Composition', content: product.material } : null,
    product.fit ? { id: 'fit', label: 'Fit & Sizing', content: product.fit } : null,
    product.details?.length ? { id: 'details', label: 'Product Details', list: product.details } : null,
    product.care?.length ? { id: 'care', label: 'Care Instructions', list: product.care } : null,
  ].filter(Boolean) as Array<{ id: string; label: string; content?: string; list?: string[] }>;

  return (
    <main className="product-detail container" aria-labelledby="product-title">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span>{product.category}</span>
      </nav>
      <div className="product-detail__layout">
        <ProductGallery product={product} />
        <section className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-info__price">{product.price}</p>
          <p className="product-info__description">{product.description}</p>

          {stock > 0 && product.sizes.length > 0 && (
            <fieldset className="size-selector">
              <legend>Size</legend>
              <div>
                {product.sizes.map((size) => (
                  <button
                    className={selectedSize === size ? 'size-option size-option--selected' : 'size-option'}
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {stock > 0 ? (
              <Button className="product-info__cta" onClick={handleAddToBag} style={{ flex: 1 }}>
                Add to bag
              </Button>
            ) : (
              <Button
                className="product-info__cta"
                disabled
                style={{
                  flex: 1,
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  background: 'var(--color-outline-muted)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Out of stock
              </Button>
            )}

            <button
              type="button"
              className={`button button--secondary ${isSaved ? 'button--saved' : ''}`}
              onClick={handleWishlistToggle}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              style={{
                width: '48px',
                padding: 0,
                minWidth: '48px',
                color: isSaved ? 'var(--color-champagne)' : 'var(--color-text)',
                borderColor: isSaved ? 'var(--color-champagne)' : 'var(--color-outline-muted)',
              }}
            >
              <Heart size={18} fill={isSaved ? 'var(--color-champagne)' : 'none'} aria-hidden="true" />
            </button>
          </div>

          <p className="product-info__note">Complimentary delivery and atelier packaging.</p>

          {/* Accordion Sections */}
          {accordionSections.length > 0 && (
            <div className="product-accordions">
              {accordionSections.map((section) => (
                <div className="product-accordion" key={section.id}>
                  <button
                    className={`product-accordion__trigger${openAccordion === section.id ? ' product-accordion__trigger--open' : ''}`}
                    type="button"
                    aria-expanded={openAccordion === section.id}
                    aria-controls={`accordion-panel-${section.id}`}
                    onClick={() => toggleAccordion(section.id)}
                  >
                    <span>{section.label}</span>
                    <span className="product-accordion__icon" aria-hidden="true">
                      {openAccordion === section.id ? '−' : '+'}
                    </span>
                  </button>
                  {openAccordion === section.id && (
                    <div
                      className="product-accordion__panel"
                      id={`accordion-panel-${section.id}`}
                      role="region"
                      aria-labelledby={`accordion-trigger-${section.id}`}
                    >
                      {section.content && <p>{section.content}</p>}
                      {section.list && (
                        <ul>
                          {section.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Atelier packaging note */}
          <div className="product-info__atelier-note">
            <p className="eyebrow">Atelier Packaging</p>
            <p>Presented in the FALCON archival box with tissue wrap, care card, and authenticity seal.</p>
          </div>
        </section>
      </div>

      <ProductRail
        title="Complete the look"
        description="A considered edit to accompany this piece."
        products={relatedProducts.length > 0 ? relatedProducts : products.filter((item) => item.slug !== product.slug).slice(0, 4)}
      />

      {otherRecentProducts.length > 0 && (
        <ProductRail
          title="Recently viewed"
          description="Silhouettes held in your browsing history."
          products={otherRecentProducts}
        />
      )}
    </main>
  );
}