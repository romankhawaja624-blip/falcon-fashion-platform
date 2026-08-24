import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

export function ShopPage() {
  return (
    <main className="commerce-page">
      <section className="commerce-intro container" aria-labelledby="shop-title">
        <p className="eyebrow">The digital atelier</p>
        <h1 id="shop-title">The Atelier Shop</h1>
        <label className="search-field" htmlFor="shop-search">
          <span className="sr-only">Search the atelier</span>
          <input id="shop-search" type="search" placeholder="What are you looking for?" />
          <Search size={19} aria-hidden="true" />
        </label>
        <nav className="commerce-categories" aria-label="Shop categories">
          <Link to="/collections/women">Women</Link><Link to="/shop">Men</Link><Link to="/shop">Accessories</Link>
        </nav>
      </section>
      <section className="product-section container" aria-labelledby="featured-title">
        <div className="section-heading"><p className="eyebrow">Selected pieces</p><h2 id="featured-title">Defined by silhouette.</h2></div>
        <div className="product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
      </section>
    </main>
  );
}