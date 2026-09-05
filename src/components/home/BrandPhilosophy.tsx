// FALCON Brand Philosophy Section
// Premium light luxury editorial composition, restrained typography, and architectural fashion imagery.

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BrandPhilosophy() {
  return (
    <section className="brand-philosophy container" aria-labelledby="brand-philosophy-title">
      <div className="brand-philosophy__layout">
        {/* Editorial Copy Block */}
        <div className="brand-philosophy__content">
          <div className="brand-philosophy__eyebrow-wrapper">
            <span className="eyebrow">THE FALCON PHILOSOPHY</span>
            <span className="brand-philosophy__meta-indicator">[ 01 / EDITORIAL MANIFESTO ]</span>
          </div>

          <h2 id="brand-philosophy-title" className="brand-philosophy__statement">
            Clothing should adapt to the individual&nbsp;—
            <span className="brand-philosophy__statement-break"> not the other way around.</span>
          </h2>

          <div className="brand-philosophy__narrative">
            <p>
              We believe style is an architectural dialogue between the wearer and form. True luxury does not dictate
              how you dress; it listens to how you move, live, and define your presence.
            </p>
            <p>
              By pairing heritage tailoring with quiet spatial intelligence, Falcon constructs garments tailored to
              the subtleties of human individuality. Technology here does not replace the artisan—it refines the
              personal silhouette.
            </p>
          </div>

          <div className="brand-philosophy__action">
            <Link className="text-link" to="/discover">
              Explore our philosophy <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="brand-philosophy__meta-footer" aria-hidden="true">
            <span>EST. FOR THE INDIVIDUAL</span>
            <span className="brand-philosophy__meta-divider">&mdash;</span>
            <span>INTENTIONAL TAILORING</span>
          </div>
        </div>

        {/* Architectural Editorial Visual */}
        <div className="brand-philosophy__visual-frame">
          <div className="brand-philosophy__visual-mat">
            <div className="brand-philosophy__image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                alt="FALCON architectural tailoring campaign featuring structured neutral wool coat in a minimalist gallery space"
                className="brand-philosophy__image"
                loading="lazy"
              />
              <div className="brand-philosophy__visual-tag" aria-hidden="true">
                <span>ATELIER PERSPECTIVE / 01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
