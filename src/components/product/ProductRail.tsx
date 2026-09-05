import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { ProductCard } from './ProductCard';

export function ProductRail({
  title = 'Selected for the season.',
  description = 'A considered selection of silhouettes designed for the rhythm of modern life.',
  products,
  variant = 'editorial',
}: {
  title?: string;
  description?: string;
  products: Product[];
  variant?: 'standard' | 'editorial' | 'compact';
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    if (!railRef.current) return;
    // Scroll approximately 1 full screen / 4 cards on desktop
    const scrollDistance = railRef.current.clientWidth * 0.85;
    railRef.current.scrollBy({ left: direction * scrollDistance, behavior: 'smooth' });
  };

  return (
    <section className="product-rail" aria-labelledby="seasonal-edit-title">
      {/* Editorial Section Header */}
      <div className="product-rail__heading">
        <div className="product-rail__heading-info">
          <div className="product-rail__eyebrow-wrapper">
            <span className="eyebrow">CURATED SELECTION</span>
            <span className="product-rail__meta-indicator">[ 02 / SEASONAL EDIT ]</span>
          </div>
          <h2 id="seasonal-edit-title" className="product-rail__title">
            {title}
          </h2>
          {description && <p className="product-rail__lead">{description}</p>}
        </div>

        {/* Action and Navigation Controls */}
        <div className="product-rail__controls-wrap">
          <Link className="product-rail__view-all" to="/shop">
            <span>VIEW ALL COLLECTION</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <div className="product-rail__controls" aria-label="Product rail navigation">
            <button
              type="button"
              className="product-rail__control-btn"
              aria-label="Previous products"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="product-rail__control-btn"
              aria-label="Next products"
              onClick={() => move(1)}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating 4-Across Product Track */}
      <div className="product-rail__track" ref={railRef} tabIndex={0} aria-label="Seasonal products carousel">
        {products.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            variant={variant}
            isFalconEdit={index === 0}
          />
        ))}
      </div>
    </section>
  );
}