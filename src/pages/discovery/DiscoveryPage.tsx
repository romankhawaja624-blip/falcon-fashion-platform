import { Link } from 'react-router-dom';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { isPageVisible } from '../../data/pageRegistry';

const audienceTiles = [
  { label: '01 / Women', title: 'Quiet\nstructure.', to: '/collections/women', className: 'discovery-tile--dark' },
  { label: '02 / Men', title: 'Precision\ntailoring.', to: '/collections/men', className: 'discovery-tile--dark' },
  { label: '03 / Young Adults', title: 'Modern\nessentials.', to: '/collections/youngAdults', className: 'discovery-tile--dark' },
  { label: '04 / Kids', title: 'Playful\nelegance.', to: '/collections/kids', className: 'discovery-tile--dark' },
  { label: '05 / Adults', title: 'Refined\nedition.', to: '/collections/adults', className: 'discovery-tile--dark' },
];

export function DiscoveryPage() {
  const visibleTiles = audienceTiles.filter((tile) => isPageVisible(tile.to));

  return (
    <main className="discovery-page">
      <section className="discovery-hero container" aria-labelledby="discovery-title">
        <div className="discovery-hero__copy">
          <p className="eyebrow">The global atelier</p>
          <h1 id="discovery-title">Discover fashion with intention.</h1>
          <p>Explore considered silhouettes, expressive eveningwear, and a wardrobe shaped around your point of view.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            <Link className="button button--primary" to="/shop">
              Enter the atelier shop
            </Link>
            <Link className="button button--secondary" to="/stylist">
              Consult AI Stylist
            </Link>
          </div>
        </div>
        <div className="discovery-hero__visual" aria-hidden="true">
          <span>FALCON / EDIT 01</span>
          <strong>FORM<br />FOLLOWS<br />FEELING.</strong>
        </div>
      </section>

      <section className="discovery-grid container" aria-labelledby="discover-edits-title">
        <div className="discovery-grid__heading">
          <p className="eyebrow">Explore the edit</p>
          <h2 id="discover-edits-title">A wardrobe in motion.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', width: '100%', marginBottom: '24px' }}>
          {visibleTiles.map((tile) => (
            <Link key={tile.to} className={`discovery-tile ${tile.className}`} to={tile.to}>
              <span>{tile.label}</span>
              <strong style={{ whiteSpace: 'pre-line' }}>{tile.title}</strong>
            </Link>
          ))}

          <Link className="discovery-tile discovery-tile--blue" to="/stylist">
            <span>AI styling</span>
            <strong>Made<br />personal.</strong>
          </Link>
        </div>

        <AiEntryCard />
      </section>

      <div className="container">
        <ProductRail
          title="The considered edit"
          description="Pieces selected for a precise, enduring wardrobe."
          products={products}
          variant="editorial"
        />
      </div>
    </main>
  );
}