import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { RemoteImage } from '../ui/RemoteImage';

export function ProductCard({ product, variant = 'standard' }: { product: Product; variant?: 'standard' | 'editorial' | 'compact' }) {
  return (
    <article className={`product-card product-card--${variant}`}>
      <Link className="product-card__image" to={`/product/${product.slug}`}>
        <RemoteImage assetId={product.imageIds[0]} />
      </Link>
      <div className="product-card__details">
        <div>
          <p className="product-card__category">{product.category}</p>
          <h2><Link to={`/product/${product.slug}`}>{product.name}</Link></h2>
        </div>
        <p className="product-card__price">{product.price}</p>
      </div>
    </article>
  );
}