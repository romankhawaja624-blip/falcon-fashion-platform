// FALCON Redesigned Homepage Hero Section
// Editorial luxury fashion campaign composition, quiet luxury, high-fashion imagery, & precise typography.

import { Link } from 'react-router-dom';

export function FalconHero() {
  return (
    <section className="hero container" aria-label="Falcon Campaign Hero">
      <div className="hero__copy">
        {/* Editorial Eyebrow & Season Identifier */}
        <div className="hero__eyebrow-wrapper">
          <span className="eyebrow">AUTUMN / WINTER 2026</span>
          <span className="hero__editorial-tag-inline">[ 01 / EDITORIAL LOOKBOOK ]</span>
        </div>

        {/* Main Headline */}
        <h1 id="hero-title">
          The future of<br />
          fashion, tailored<br />
          to you.
        </h1>

        {/* Supporting Editorial Description */}
        <p className="hero__description">
          Discover sculptural tailoring, archival silhouettes, and a digital wardrobe experience shaped around your personal point of view.
        </p>

        {/* Action Group */}
        <div className="hero__actions">
          <Link className="button button--primary" to="/shop">
            Shop the Collection
          </Link>
          <Link className="button button--secondary" to="/discover">
            Explore Falcon
          </Link>
        </div>

        {/* Editorial Footnote Detail */}
        <div className="hero__meta-footer" aria-hidden="true">
          <span>PARIS &middot; TOKYO &middot; LAHORE</span>
          <span className="hero__meta-divider">&mdash;</span>
          <span>ARCHITECTURAL TAILORING</span>
          <span className="hero__meta-divider">&mdash;</span>
          <span>EDITION 2026.01</span>
        </div>
      </div>

      {/* Editorial Campaign Visual Container */}
      <div className="hero__visual">
        <div className="hero__visual-inner">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85"
            alt="FALCON Autumn Winter 2026 Editorial Fashion Campaign featuring structured dark wool tailoring"
            className="hero__campaign-image"
            loading="eager"
          />
          <div className="hero__visual-scrim" aria-hidden="true" />
          {/* Subtle Campaign Overlay Tag */}
          <div className="hero__visual-tag" aria-hidden="true">
            <span className="hero__visual-tag-label">CAMPAIGN / FW26</span>
            <span className="hero__visual-tag-detail">SILHOUETTE 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}