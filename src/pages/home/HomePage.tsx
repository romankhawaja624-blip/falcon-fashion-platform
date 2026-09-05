import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FalconHero } from '../../components/home/FalconHero';
import { BrandPhilosophy } from '../../components/home/BrandPhilosophy';
import { ProductRail } from '../../components/product/ProductRail';
import { MetricWidget } from '../../components/atelier/MetricWidget';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { products } from '../../data/products';
import { wardrobeItems } from '../../data/atelier';
import { isPageVisible } from '../../data/pageRegistry';

export function HomePage() {
  const audiences = [
    {
      id: 'women',
      label: "Women's Collection",
      tag: '01 / WOMENSWEAR',
      subtitle: 'Curated silhouettes & outerwear',
      path: '/collections/women',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      featured: true,
    },
    {
      id: 'men',
      label: "Men's Collection",
      tag: '02 / MENSWEAR',
      subtitle: 'Architectural tailoring & coats',
      path: '/collections/men',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
      featured: true,
    },
    {
      id: 'youngAdults',
      label: 'Young Adults',
      tag: '03 / YOUNG ADULTS',
      subtitle: 'Contemporary essentials & edits',
      path: '/collections/youngAdults',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
      featured: false,
    },
    {
      id: 'kids',
      label: 'Childrenswear',
      tag: '04 / CHILDRENSWEAR',
      subtitle: 'Refined atelier essentials',
      path: '/collections/kids',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=85',
      featured: false,
    },
    {
      id: 'adults',
      label: 'Archival Adults',
      tag: '05 / ARCHIVAL EDITION',
      subtitle: 'Timeless luxury & bespoke cuts',
      path: '/collections/adults',
      image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85',
      featured: false,
    },
  ].filter((aud) => isPageVisible(aud.path));

  return (
    <main className="home-page">
      {/* 1. Hero Section */}
      <FalconHero />

      {/* 2. Audience Collections Editorial Gateway */}
      {audiences.length > 0 && (
        <section className="home-collections container" aria-labelledby="audience-discovery-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Curated Wardrobes</p>
              <h2 id="audience-discovery-title">Explore Collections</h2>
            </div>
            <Link className="text-link" to="/discover">
              View All Collections <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-collections__grid">
            {audiences.map((aud) => (
              <Link
                key={aud.id}
                to={aud.path}
                className={`collection-card ${aud.featured ? 'collection-card--featured' : 'collection-card--standard'}`}
              >
                <div className="collection-card__image-wrap">
                  <img
                    src={aud.image}
                    alt={`FALCON ${aud.label} Campaign Photography`}
                    className="collection-card__image"
                    loading="lazy"
                  />
                  <div className="collection-card__overlay" aria-hidden="true" />
                </div>
                <div className="collection-card__header">
                  <span className="collection-card__tag">{aud.tag}</span>
                </div>
                <div className="collection-card__footer">
                  <h3 className="collection-card__title">{aud.label}</h3>
                  <p className="collection-card__subtitle">{aud.subtitle}</p>
                  <span className="collection-card__action">
                    Explore Collection <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Selected Pieces / Product Rail */}
      <div className="container">
        <ProductRail
          title="Selected for the season."
          description="A considered selection of silhouettes designed for the rhythm of modern life."
          products={products}
          variant="editorial"
        />
      </div>

      {/* 4. Brand Philosophy Editorial Statement */}
      <BrandPhilosophy />

      {/* 5. Falcon AI Stylist Section */}
      <section className="home-ai-section container" aria-labelledby="ai-stylist-title">
        <div className="home-ai-section__inner">
          <div className="home-ai-section__content">
            <div className="home-ai-section__eyebrow-wrapper">
              <p className="eyebrow">Falcon Intelligence</p>
              <span className="home-ai-section__edition">[ ATELIER ENGINE V2.4 ]</span>
            </div>
            <h2 id="ai-stylist-title">Personal styling, rewritten.</h2>
            <p>
              Describe an occasion, a mood, or an anchor piece. Falcon AI synthesizes texture, geometry, and your personal digital wardrobe to compose cohesive editorial silhouettes.
            </p>
            <div className="home-ai-section__actions">
              <Link className="button button--primary" to="/assistant">
                <Sparkles size={16} aria-hidden="true" />
                Open AI Stylist
              </Link>
              <Link className="button button--secondary" to="/stylist/builder">
                Outfit Studio
              </Link>
            </div>
          </div>

          <div className="home-ai-section__cards" aria-label="Curated style prompts">
            <Link className="home-ai-card" to="/assistant">
              <div className="home-ai-card__top">
                <span className="home-ai-card__tag">Occasion / 01</span>
                <span className="home-ai-card__meta">EVENING SILHOUETTE</span>
              </div>
              <strong className="home-ai-card__title">Minimal evening in Milan</strong>
              <p className="home-ai-card__desc">Architectural wool tailoring paired with quiet silk underlayers.</p>
              <div className="home-ai-card__footer">
                <span>Synthesize Look</span>
                <ArrowRight size={16} aria-hidden="true" />
              </div>
            </Link>
            <Link className="home-ai-card" to="/assistant">
              <div className="home-ai-card__top">
                <span className="home-ai-card__tag">Aesthetic / 02</span>
                <span className="home-ai-card__meta">SPATIAL FORM</span>
              </div>
              <strong className="home-ai-card__title">Architectural layer for gallery opening</strong>
              <p className="home-ai-card__desc">Structured outerwear composed with tactile contrast and neutral drape.</p>
              <div className="home-ai-card__footer">
                <span>Synthesize Look</span>
                <ArrowRight size={16} aria-hidden="true" />
              </div>
            </Link>
            <Link className="home-ai-card" to="/assistant">
              <div className="home-ai-card__top">
                <span className="home-ai-card__tag">Wardrobe / 03</span>
                <span className="home-ai-card__meta">PALETTE ELEVATION</span>
              </div>
              <strong className="home-ai-card__title">Elevate black obsidian pieces</strong>
              <p className="home-ai-card__desc">Harmonize monochrome staples with champagne hardware accents.</p>
              <div className="home-ai-card__footer">
                <span>Synthesize Look</span>
                <ArrowRight size={16} aria-hidden="true" />
              </div>
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
        <div className="home-manifesto__inner">
          <div className="home-manifesto__eyebrow-wrapper">
            <p className="eyebrow">THE FALCON MANIFESTO</p>
            <span className="home-manifesto__tag">[ 03 / ATELIER CLOSING ]</span>
          </div>
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
          <div className="home-manifesto__footnote" aria-hidden="true">
            <span>FALCON ATELIER INTERNATIONALE</span>
            <span className="home-manifesto__divider">&mdash;</span>
            <span>DESIGNED FOR PERSISTENCE</span>
          </div>
        </div>
      </section>
    </main>
  );
}