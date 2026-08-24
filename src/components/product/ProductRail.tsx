import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { Product } from '../../data/products';
import { ProductCard } from './ProductCard';

export function ProductRail({ title, description, products, variant = 'compact' }: { title: string; description?: string; products: Product[]; variant?: 'standard' | 'editorial' | 'compact' }) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  return (
    <section className="product-rail" aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>
      <div className="product-rail__heading"><div><p className="eyebrow">Selected edit</p><h2 id={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>{title}</h2>{description && <p>{description}</p>}</div><div className="product-rail__controls"><button type="button" aria-label="Previous products" onClick={() => move(-1)}><ChevronLeft size={18} aria-hidden="true" /></button><button type="button" aria-label="Next products" onClick={() => move(1)}><ChevronRight size={18} aria-hidden="true" /></button></div></div>
      <div className="product-rail__track" ref={railRef} tabIndex={0}>{products.map((product) => <ProductCard key={product.slug} product={product} variant={variant} />)}</div>
    </section>
  );
}