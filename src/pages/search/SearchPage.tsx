import { Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { searchProducts } from '../../features/search/searchProducts';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const results = useMemo(() => searchProducts(products, query, category), [query, category]);
  return (
    <main className="search-page commerce-page"><section className="search-page__intro container" aria-labelledby="search-title"><p className="eyebrow">Global search</p><h1 id="search-title">Find your next form.</h1><label className="search-field search-field--large" htmlFor="global-search"><span className="sr-only">Search Falcon</span><input id="global-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by piece, mood, or silhouette" /><Search size={20} aria-hidden="true" /></label><Link className="ai-search-link" to="/stylist"><Sparkles size={16} aria-hidden="true" /> Describe it to Falcon AI</Link></section><section className="search-results container" aria-live="polite"><div className="search-results__toolbar"><div className="filter-group" role="group" aria-label="Filter search results">{['All', 'Outerwear', 'Eveningwear'].map((option) => <button className={category === option ? 'filter-chip filter-chip--active' : 'filter-chip'} key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)}>{option}</button>)}</div><span className="result-count">{results.length} results</span></div>{results.length ? <div className="product-grid">{results.map((product) => <ProductCard key={product.slug} product={product} variant="compact" />)}</div> : <div className="search-empty"><p className="eyebrow">No exact match</p><h2>Try describing the feeling instead.</h2><Link className="button button--secondary" to="/stylist">Open Falcon AI</Link></div>}</section>{results.length > 0 && <div className="container"><ProductRail title="Continue exploring" products={products} /></div>}</main>
  );
}