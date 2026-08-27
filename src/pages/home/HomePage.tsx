import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FalconHero } from '../../components/home/FalconHero';
import { ProductRail } from '../../components/product/ProductRail';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { MetricWidget } from '../../components/atelier/MetricWidget';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { products } from '../../data/products';
import { wardrobeItems } from '../../data/atelier';
import { isPageVisible } from '../../data/pageRegistry';

export function HomePage() {
  const audiences = [
    { id: 'women', label: 'Women', tag: 'Curated Silhouettes', path: '/collections/women' },
    { id: 'men', label: 'Men', tag: 'Architectural Tailoring', path: '/collections/men' },
    { id: 'kids', label: 'Kids', tag: 'Atelier Essentials', path: '/collections/kids' },
    { id: 'youngAdults', label: 'Young Adults', tag: 'Contemporary Edit', path: '/collections/youngAdults' },
    { id: 'adults', label: 'Adults', tag: 'Archival Luxury', path: '/collections/adults' },
  ].filter((aud) => isPageVisible(aud.path));

  return (
    <main className="home-page">
      {/* 1. Hero Section */}
      <FalconHero />

      {/* 2. Audience Collections Discovery */}
      {audiences.length > 0 && (
        <section className="container" style={{ marginTop: '80px' }} aria-labelledby="audience-discovery-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Audience Edit</p>
              <h2 id="audience-discovery-title">Explore Collections</h2>
            </div>
            <Link className="text-link" to="/discover">
              Discover all collections <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '32px' }}>
            {audiences.map((aud) => (
              <Link
                key={aud.id}
                to={aud.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px',
                  minHeight: '200px',
                  background: 'var(--color-surface, #141416)',
                  border: '1px solid var(--color-outline-muted)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color var(--motion-standard), transform var(--motion-standard)',
                }}
              >
                <span className="eyebrow" style={{ margin: 0, fontSize: '11px' }}>{aud.tag}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--color-text)', margin: '0 0 8px 0' }}>
                    {aud.label}
                  </h3>
                  <span className="text-link" style={{ fontSize: '11px' }}>
                    Explore collection &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Selected Pieces / Product Rail */}
      <div className="container" style={{ marginTop: '80px' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected pieces</p>
            <h2 id="selected-pieces-title">Defined by silhouette.</h2>
          </div>
          <Link className="text-link" to="/shop">
            View complete catalog <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <ProductRail
          title="The considered edit"
          description="Sculptural outerwear and fluid eveningwear shaped with architectural precision."
          products={products}
          variant="editorial"
        />
      </div>

      {/* 4. Editorial & Craftsmanship Section */}
      <section className="home-editorial container" aria-labelledby="editorial-craft-title">
        <div className="home-editorial__visual">
          <RemoteImage assetId="obsidian-wool-coat-collar" alt="Close craftsmanship detail of the Obsidian Wool Coat collar" />
          <span className="home-editorial__tag">Craft & Material / 01</span>
        </div>
        <div className="home-editorial__content">
          <p className="eyebrow">The Atelier Philosophy</p>
          <h2 id="editorial-craft-title">Form follows feeling.</h2>
          <p className="home-editorial__lead">
            Falcon bridges the tactile mastery of heritage tailoring with generative spatial precision. Every garment is conceived as an architectural object—sculptural in repose, fluid in motion.
          </p>
          <div className="home-editorial__pillars">
            <div className="home-editorial__pillar">
              <strong>01 / Biella Obsidian Wool</strong>
              <p>Dense, structured virgin wool woven in northern Italy for enduring thermal structure and quiet weight.</p>
            </div>
            <div className="home-editorial__pillar">
              <strong>02 / Fluid Weave Silk</strong>
              <p>Heavyweight natural mulberry silk tailored to respond effortlessly to body movement and light.</p>
            </div>
            <div className="home-editorial__pillar">
              <strong>03 / Algorithmic Grading</strong>
              <p>Zero-waste proportional drafting ensuring balanced silhouette proportions across every body size.</p>
            </div>
          </div>
          <Link className="text-link" to="/discover">
            Explore our craftsmanship <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 5. Falcon AI Stylist Section */}
      <section className="home-ai-section container" aria-labelledby="ai-stylist-title">
        <div className="home-ai-section__inner">
          <div className="home-ai-section__content">
            <p className="eyebrow">Falcon Intelligence</p>
            <h2 id="ai-stylist-title">Personal styling, rewritten.</h2>
            <p>
              Describe an occasion, a mood, or an anchor piece. Falcon AI synthesizes texture, geometry, and your personal digital wardrobe to compose cohesive editorial silhouettes.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link className="button button--primary" to="/assistant">
                <Sparkles size={16} style={{ marginRight: '8px' }} aria-hidden="true" />
                Open AI Stylist
              </Link>
              <Link className="button button--secondary" to="/stylist/builder">
                Outfit Studio
              </Link>
            </div>
          </div>

          <div className="home-ai-section__cards" aria-label="Curated style prompts">
            <Link className="home-ai-card" to="/assistant">
              <div>
                <span>Occasion / 01</span>
                <strong>Minimal evening in Milan</strong>
              </div>
              <ArrowRight size={18} color="var(--color-champagne)" aria-hidden="true" />
            </Link>
            <Link className="home-ai-card" to="/assistant">
              <div>
                <span>Aesthetic / 02</span>
                <strong>Architectural layer for gallery opening</strong>
              </div>
              <ArrowRight size={18} color="var(--color-champagne)" aria-hidden="true" />
            </Link>
            <Link className="home-ai-card" to="/assistant">
              <div>
                <span>Wardrobe / 03</span>
                <strong>Elevate black obsidian pieces</strong>
              </div>
              <ArrowRight size={18} color="var(--color-champagne)" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Digital Atelier / Wardrobe Preview */}
      <section className="home-atelier-preview container" aria-labelledby="atelier-preview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Digital Wardrobe</p>
            <h2 id="atelier-preview-title">Your wardrobe in motion.</h2>
          </div>
          <Link className="text-link" to="/atelier">
            Enter your atelier <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="home-atelier-preview__grid">
          <div className="home-atelier-preview__metrics">
            <MetricWidget label="Digital Wardrobe" value="42" detail="Curated pieces" />
            <MetricWidget label="Style Score" value="72" detail="Intelligence level 04" tone="blue" />
          </div>
          <div className="home-atelier-preview__cards">
            {wardrobeItems.slice(0, 3).map((item) => (
              <WardrobeCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing Editorial Statement / Manifesto */}
      <section className="home-manifesto container" aria-labelledby="manifesto-title">
        <p className="eyebrow">The Future of Fashion</p>
        <h2 id="manifesto-title">High fashion, personalized by intelligence.</h2>
        <p>
          Step into a digital atelier where human craftsmanship and artificial intelligence unite to shape a timeless wardrobe.
        </p>
        <div className="home-manifesto__actions">
          <Link className="button button--primary" to="/assistant">
            Begin AI Styling
          </Link>
          <Link className="button button--secondary" to="/shop">
            Explore The Collection
          </Link>
        </div>
      </section>
    </main>
  );
}