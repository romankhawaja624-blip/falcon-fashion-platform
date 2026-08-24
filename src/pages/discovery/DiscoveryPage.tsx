import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';

export function DiscoveryPage() {
  return (
    <main className="discovery-page">
      <section className="discovery-hero container" aria-labelledby="discovery-title">
        <div className="discovery-hero__copy"><p className="eyebrow">The global atelier</p><h1 id="discovery-title">Discover fashion with intention.</h1><p>Explore considered silhouettes, expressive eveningwear, and a wardrobe shaped around your point of view.</p><Link className="button button--primary" to="/shop">Enter the atelier shop</Link></div>
        <div className="discovery-hero__visual" aria-hidden="true"><span>FALCON / EDIT 01</span><strong>FORM<br />FOLLOWS<br />FEELING.</strong></div>
      </section>
      <section className="discovery-grid container" aria-labelledby="discover-edits-title"><div className="discovery-grid__heading"><p className="eyebrow">Explore the edit</p><h2 id="discover-edits-title">A wardrobe in motion.</h2></div><Link className="discovery-tile discovery-tile--dark" to="/collections/women"><span>01 / Women</span><strong>Quiet<br />structure.</strong></Link><Link className="discovery-tile discovery-tile--blue" to="/stylist"><span>02 / AI styling</span><strong>Made<br />personal.</strong></Link><AiEntryCard /></section>
      <div className="container"><ProductRail title="The considered edit" description="Pieces selected for a precise, enduring wardrobe." products={products} variant="editorial" /></div>
    </main>
  );
}