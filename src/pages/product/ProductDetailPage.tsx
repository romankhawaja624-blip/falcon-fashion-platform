import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../../data/products';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { useCart } from '../../features/cart/CartContext';

export function ProductDetailPage() {
  const { slug = 'obsidian-wool-coat' } = useParams();
  const product = getProduct(slug);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { addItem } = useCart();

  const toggleAccordion = (id: string) => setOpenAccordion((current) => (current === id ? null : id));

  /* Build related-products from pairsWith slugs, then fall back to category peers */
  const relatedProducts = product.pairsWith
    ? product.pairsWith.map((s) => products.find((p) => p.slug === s)).filter(Boolean).slice(0, 4) as typeof products
    : products.filter((item) => item.slug !== product.slug).slice(0, 4);

  /* Accordion sections assembled from product metadata */
  const accordionSections = [
    product.material ? { id: 'material', label: 'Material & Composition', content: product.material } : null,
    product.fit ? { id: 'fit', label: 'Fit & Sizing', content: product.fit } : null,
    product.details?.length ? { id: 'details', label: 'Product Details', list: product.details } : null,
    product.care?.length ? { id: 'care', label: 'Care Instructions', list: product.care } : null,
  ].filter(Boolean) as Array<{ id: string; label: string; content?: string; list?: string[] }>;

  return (
    <main className="product-detail container" aria-labelledby="product-title">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/shop">Shop</Link><span aria-hidden="true">/</span><span>{product.category}</span></nav>
      <div className="product-detail__layout">
        <ProductGallery product={product} />
        <section className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-info__price">{product.price}</p>
          <p className="product-info__description">{product.description}</p>
          <fieldset className="size-selector"><legend>Size</legend><div>{product.sizes.map((size) => <button className={selectedSize === size ? 'size-option size-option--selected' : 'size-option'} key={size} type="button" aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></fieldset>
          <Button className="product-info__cta" onClick={() => addItem(product, selectedSize)}>Add to bag</Button>
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
                    <span className="product-accordion__icon" aria-hidden="true">{openAccordion === section.id ? '−' : '+'}</span>
                  </button>
                  {openAccordion === section.id && (
                    <div className="product-accordion__panel" id={`accordion-panel-${section.id}`} role="region" aria-labelledby={`accordion-trigger-${section.id}`}>
                      {section.content && <p>{section.content}</p>}
                      {section.list && (
                        <ul>
                          {section.list.map((item) => <li key={item}>{item}</li>)}
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
      <ProductRail title="Complete the look" description="A considered edit to accompany this piece." products={relatedProducts.length > 0 ? relatedProducts : products.filter((item) => item.slug !== product.slug).slice(0, 4)} />
    </main>
  );
}