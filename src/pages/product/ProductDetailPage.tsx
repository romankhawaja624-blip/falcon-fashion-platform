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
    <main className="product-detail container" aria-labelledby="product-title">
      {/* Editorial Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <Link to="/shop">Shop</Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <span className="breadcrumbs__current">{product.name}</span>
      </nav>

      <div className="product-detail__layout">
        {/* Gallery Visual Side */}
        <div className="product-detail__visual-col">
          <ProductGallery product={product} />
        </div>

        {/* Product Information & Purchase Column */}
        <section className="product-info" aria-labelledby="product-title">
          <div className="product-info__header">
            <div className="product-info__eyebrow-wrapper">
              <span className="eyebrow">{product.category}</span>
              <span className="product-info__edition">[ EDITION 2026 / ATELIER ]</span>
            </div>
            <h1 id="product-title" className="product-info__title">
              {product.name}
            </h1>
            <p className="product-info__price">
              {product.price}
            </p>
          </div>

          <p className="product-info__description">
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div className="product-info__stock" aria-live="polite">
            {stock > 5 ? (
              <span className="stock-badge stock-badge--available">
                <span className="stock-badge__dot" aria-hidden="true" />
                Available at Atelier ({stock} pieces remaining)
              </span>
            ) : stock > 0 ? (
              <span className="stock-badge stock-badge--low">
                <span className="stock-badge__dot" aria-hidden="true" />
                Archival Priority &mdash; Only {stock} remaining in this edition
              </span>
            ) : (
              <span className="stock-badge stock-badge--out">
                <span className="stock-badge__dot" aria-hidden="true" />
                Currently Out of Stock &mdash; Next Atelier Drop Pending
              </span>
            )}
          </div>

          {/* Size Selector */}
          {stock > 0 && product.sizes.length > 0 && (
            <fieldset className="size-selector">
              <legend className="size-selector__label">
                Select Size
                {selectedSize && <span className="size-selector__selected">&mdash; {selectedSize}</span>}
              </legend>
              <div className="size-selector__options" role="radiogroup">
                {product.sizes.map((size) => (
                  <button
                    className={`size-option ${selectedSize === size ? 'size-option--selected' : ''}`}
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Quantity Selector */}
          {stock > 0 && (
            <div className="quantity-selector">
              <span className="quantity-selector__label">Quantity</span>
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="quantity-stepper__btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <span className="quantity-stepper__value" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="quantity-stepper__btn"
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* CTA Actions */}
          <div className="product-info__actions">
            {stock > 0 ? (
              <Button className="product-info__cta" onClick={handleAddToBag}>
                Add to Bag &mdash; ${(product.priceValue * quantity).toLocaleString()}
              </Button>
            ) : (
              <Button className="product-info__cta product-info__cta--disabled" disabled>
                Sold Out &mdash; Commission Unavailable
              </Button>
            )}

            <button
              type="button"
              className={`product-info__wishlist-btn ${isSaved ? 'product-info__wishlist-btn--saved' : ''}`}
              onClick={handleWishlistToggle}
              aria-label={isSaved ? `Remove ${product.name} from saved` : `Save ${product.name} to wishlist`}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
          </div>

          {/* Delivery & Authentication Trust Panel */}
          <div className="product-trust-panel">
            <div className="product-trust-panel__item">
              <Truck size={16} aria-hidden="true" className="product-trust-panel__icon" />
              <span>Complimentary international express shipping</span>
            </div>
            <div className="product-trust-panel__item">
              <ShieldCheck size={16} aria-hidden="true" className="product-trust-panel__icon" />
              <span>Falcon authenticity certificate & archival packaging</span>
            </div>
          </div>

          {/* Accordion Sections */}
          {accordionSections.length > 0 && (
            <div className="product-accordions">
              {accordionSections.map((section) => (
                <div className="product-accordion" key={section.id}>
                  <button
                    className={`product-accordion__trigger ${openAccordion === section.id ? 'product-accordion__trigger--open' : ''}`}
                    type="button"
                    aria-expanded={openAccordion === section.id}
                    aria-controls={`accordion-panel-${section.id}`}
                    onClick={() => toggleAccordion(section.id)}
                  >
                    <span className="product-accordion__label">{section.label}</span>
                    <span className="product-accordion__indicator" aria-hidden="true">
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
        </section>
      </div>

      {/* Complete the Look Rail */}
      <ProductRail
        title="Complete the look"
        description="A considered edit to accompany this piece."
        products={relatedProducts.length > 0 ? relatedProducts : products.filter((item) => item.slug !== product.slug).slice(0, 4)}
      />

      {/* Recently Viewed Rail */}
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