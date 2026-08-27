import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('material');

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
    let addedCount = 0;
    for (let i = 0; i < quantity; i++) {
      const result = addItem(product, selectedSize || 'One Size');
      if (result.success === false) {
        showToast(result.message || 'Cannot add item to bag. Inventory limit reached.', 'error');
        break;
      }
      addedCount++;
    }
    if (addedCount > 0) {
      showToast(`${addedCount} × ${product.name} (${selectedSize || 'One Size'}) added to bag`, 'success');
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
    <main className="product-detail container" aria-labelledby="product-title" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </nav>

      <div className="product-detail__layout">
        <ProductGallery product={product} />
        <section className="product-info">
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {product.category}
          </p>
          <h1 id="product-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.5rem 0 1rem 0' }}>
            {product.name}
          </h1>
          <p className="product-info__price" style={{ fontSize: '1.5rem', fontWeight: 500, margin: '0 0 1rem 0' }}>
            {product.price}
          </p>
          <p className="product-info__description" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div style={{ marginBottom: '1.5rem' }}>
            {stock > 5 ? (
              <span style={{ fontSize: '0.85rem', color: '#4caf50', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ● In Stock ({stock} available at atelier)
              </span>
            ) : stock > 0 ? (
              <span style={{ fontSize: '0.85rem', color: '#ff9800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ● Low Stock — Only {stock} remaining in this edition
              </span>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#f44336', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                ● Currently Sold Out
              </span>
            )}
          </div>

          {/* Size Selector */}
          {stock > 0 && product.sizes.length > 0 && (
            <fieldset className="size-selector" style={{ marginBottom: '1.5rem', border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
              <legend style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Select Size
              </legend>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    className={selectedSize === size ? 'size-option size-option--selected' : 'size-option'}
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '8px 16px',
                      background: selectedSize === size ? 'var(--color-text, #fff)' : 'transparent',
                      color: selectedSize === size ? 'var(--color-background, #000)' : 'var(--color-text, #fff)',
                      border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.2))',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Quantity Selector */}
          {stock > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Quantity
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--color-outline-muted)', borderRadius: '4px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ padding: '8px 12px', background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 12px', fontSize: '0.9rem', minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  style={{ padding: '8px 12px', background: 'transparent', color: 'inherit', border: 'none', cursor: 'pointer' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', marginBottom: '2rem' }}>
            {stock > 0 ? (
              <Button className="product-info__cta" onClick={handleAddToBag} style={{ flex: 1 }}>
                Add to bag — ${(product.priceValue * quantity).toLocaleString()}
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={18} fill={isSaved ? 'var(--color-champagne)' : 'none'} aria-hidden="true" />
            </button>
          </div>

          {/* Delivery & Security info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'var(--color-surface, #141416)', borderRadius: '6px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <Truck size={16} />
              <span>Complimentary global express shipping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={16} />
              <span>Falcon authenticity & archival packaging</span>
            </div>
          </div>

          {/* Accordion Sections */}
          {accordionSections.length > 0 && (
            <div className="product-accordions">
              {accordionSections.map((section) => (
                <div className="product-accordion" key={section.id} style={{ borderBottom: '1px solid var(--color-outline-muted)' }}>
                  <button
                    className={`product-accordion__trigger${openAccordion === section.id ? ' product-accordion__trigger--open' : ''}`}
                    type="button"
                    aria-expanded={openAccordion === section.id}
                    aria-controls={`accordion-panel-${section.id}`}
                    onClick={() => toggleAccordion(section.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem 0',
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
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
                      style={{ paddingBottom: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}
                    >
                      {section.content && <p>{section.content}</p>}
                      {section.list && (
                        <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
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