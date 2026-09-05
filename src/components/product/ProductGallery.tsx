import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../data/products';
import { RemoteImage } from '../ui/RemoteImage';

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + product.imageIds.length) % product.imageIds.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % product.imageIds.length);
  };

  return (
    <div className="product-gallery">
      {/* Main Feature Visual */}
      <div className="product-gallery__main">
        <RemoteImage assetId={product.imageIds[activeIndex]} />
        <div className="product-gallery__badge" aria-hidden="true">
          <span>ATELIER EDITION / 0{activeIndex + 1}</span>
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="product-gallery__thumbs" role="tablist" aria-label={`${product.name} photography views`}>
        {product.imageIds.map((imageId, index) => (
          <button
            key={imageId}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`View silhouette angle ${index + 1}`}
            className={`product-gallery__thumb ${index === activeIndex ? 'product-gallery__thumb--active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <RemoteImage assetId={imageId} />
          </button>
        ))}
      </div>

      {/* Mobile Swipe / Arrow Controls */}
      <div className="product-gallery__mobile-controls" aria-label="Gallery navigation">
        <button
          type="button"
          className="product-gallery__nav-btn"
          aria-label="Previous silhouette angle"
          onClick={handlePrev}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <span className="product-gallery__counter" aria-live="polite">
          {activeIndex + 1} / {product.imageIds.length}
        </span>
        <button
          type="button"
          className="product-gallery__nav-btn"
          aria-label="Next silhouette angle"
          onClick={handleNext}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}