import { ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isPageVisible } from '../../data/pageRegistry';

const footerAudienceLinks = [
  { label: "Women's Collection", to: '/collections/women' },
  { label: "Men's Collection", to: '/collections/men' },
  { label: "Kids & Children", to: '/collections/kids' },
  { label: "Young Adults", to: '/collections/youngAdults' },
  { label: "Adults Edition", to: '/collections/adults' },
];

export function PublicFooter() {
  const [currency, setCurrency] = useState('USD ($)');
  const [region, setRegion] = useState('Global (EN)');

  const visibleAudienceLinks = footerAudienceLinks.filter((link) => isPageVisible(link.to));

  return (
    <footer className="public-footer" aria-label="Site footer">
      <div className="container public-footer__inner">
        {/* Brand & Editorial Column */}
        <div className="public-footer__brand">
          <Link className="wordmark" to="/" aria-label="Falcon home">
            Falcon
          </Link>
          <p className="public-footer__tagline">
            Where editorial fashion meets intelligent personal style. Precision garments, digital wardrobe curation, and AI-first tailoring.
          </p>
          <div className="public-footer__badges" aria-label="Trust and security indicators">
            <span className="privacy-badge">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Encrypted Session</span>
            </span>
            <span className="privacy-badge privacy-badge--ai">
              <Sparkles size={14} aria-hidden="true" />
              <span>Private AI Stylist</span>
            </span>
          </div>
        </div>

        {/* Navigation Columns */}
        <nav className="public-footer__col" aria-labelledby="footer-shop-title">
          <p className="public-footer__heading" id="footer-shop-title">Collections</p>
          <ul className="public-footer__list">
            {visibleAudienceLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li><Link to="/shop">Complete Catalog</Link></li>
            <li><Link to="/discover">Curated Drops</Link></li>
          </ul>
        </nav>

        <nav className="public-footer__col" aria-labelledby="footer-ai-title">
          <p className="public-footer__heading" id="footer-ai-title">Intelligence</p>
          <ul className="public-footer__list">
            <li><Link to="/assistant">Falcon AI Stylist</Link></li>
            <li><Link to="/stylist/builder">Outfit Studio</Link></li>
            <li><Link to="/atelier/wardrobe">Digital Wardrobe</Link></li>
            <li><Link to="/atelier/intelligence">Style Journey</Link></li>
            <li><Link to="/search">Global Search</Link></li>
          </ul>
        </nav>

        <nav className="public-footer__col" aria-labelledby="footer-support-title">
          <p className="public-footer__heading" id="footer-support-title">Client Services</p>
          <ul className="public-footer__list">
            <li><Link to="/help">Help & Concierge</Link></li>
            <li><Link to="/orders">Order History & Tracking</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
            <li><Link to="/cart">Shopping Bag</Link></li>
            <li><Link to="/legal">Privacy & Policies</Link></li>
          </ul>
        </nav>

        {/* Global Selectors */}
        <div className="public-footer__col public-footer__col--controls">
          <p className="public-footer__heading">Global Atelier</p>
          <div className="public-footer__selectors">
            <label className="public-footer__select-label" htmlFor="footer-region-select">
              <Globe size={14} aria-hidden="true" />
              <span className="sr-only">Region and language</span>
              <select
                id="footer-region-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Select Region and Language"
              >
                <option value="Global (EN)">Global (English)</option>
                <option value="North America (EN)">North America (EN)</option>
                <option value="Europe (FR)">Europe (Français)</option>
                <option value="Middle East (AR)">Middle East (العربية)</option>
              </select>
            </label>

            <label className="public-footer__select-label" htmlFor="footer-currency-select">
              <span className="sr-only">Currency</span>
              <select
                id="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Select Currency"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
                <option value="AED (د.إ)">AED (د.إ)</option>
              </select>
            </label>
          </div>
          <p className="public-footer__legal-note">
            Complimentary international delivery and carbon-neutral packaging across all regions.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="public-footer__bottom">
        <div className="container public-footer__bottom-inner">
          <p className="public-footer__copyright">
            &copy; {new Date().getFullYear()} FALCON Atelier Inc. All rights reserved.
          </p>
          <div className="public-footer__legal-links">
            <Link to="/legal">Privacy Statement</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/legal">Terms of Service</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/legal">Accessibility Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
