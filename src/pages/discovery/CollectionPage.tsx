import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { ProductCard } from '../../components/product/ProductCard';
import { products } from '../../data/products';

export function CollectionPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const filteredProducts = useMemo(() => products.filter((product) => category === 'All' || product.category === category).sort((left, right) => sort === 'price-low' ? left.priceValue - right.priceValue : right.priceValue - left.priceValue), [category, sort]);
  return (
    <main className="collection-page">
      <section className="collection-hero container" aria-labelledby="collection-title"><p className="eyebrow">Collection / 01</p><h1 id="collection-title">Women&apos;s collection</h1><p>Architectural layers and fluid evening silhouettes for a considered wardrobe.</p></section>
      <section className="collection-toolbar container" aria-label="Collection controls"><div className="filter-group" role="group" aria-label="Filter by category">{['All', 'Outerwear', 'Tailoring', 'Eveningwear', 'Knitwear', 'Accessories'].map((option) => <button className={category === option ? 'filter-chip filter-chip--active' : 'filter-chip'} key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)}>{option}</button>)}</div><label className="sort-control">Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></section>
      <section className="collection-content container"><div className="collection-results"><p className="eyebrow">{filteredProducts.length} pieces</p><div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div>{filteredProducts.length === 0 && <p className="empty-results">No pieces match this edit.</p>}</div><AiEntryCard /></section>
      <p className="collection-footer container"><Link to="/stylist">Ask Falcon to style this collection <span aria-hidden="true">-&gt;</span></Link></p>
    </main>
  );
}