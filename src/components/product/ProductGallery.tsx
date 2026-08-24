import { useState } from 'react';
import type { Product } from '../../data/products';
import { RemoteImage } from '../ui/RemoteImage';

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="product-gallery">
      <div className="product-gallery__main"><RemoteImage assetId={product.imageIds[activeIndex]} /></div>
      <div className="product-gallery__thumbs" aria-label={`${product.name} gallery`}>
        {product.imageIds.map((imageId, index) => <button className={index === activeIndex ? 'product-gallery__thumb product-gallery__thumb--active' : 'product-gallery__thumb'} key={imageId} type="button" aria-label={`View product image ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}><RemoteImage assetId={imageId} /></button>)}
      </div>
      <div className="product-gallery__mobile-controls"><button type="button" aria-label="Previous product image" onClick={() => setActiveIndex((activeIndex - 1 + product.imageIds.length) % product.imageIds.length)}>&larr;</button><span>{activeIndex + 1} / {product.imageIds.length}</span><button type="button" aria-label="Next product image" onClick={() => setActiveIndex((activeIndex + 1) % product.imageIds.length)}>&rarr;</button></div>
    </div>
  );
}