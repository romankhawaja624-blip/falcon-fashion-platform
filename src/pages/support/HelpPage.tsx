import { Search, MessageSquare, Package, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: Package,
    title: 'Orders & Delivery',
    description: 'Complimentary global shipping, discreet packaging, and carrier tracking updates.',
  },
  {
    icon: Sparkles,
    title: 'AI Styling & Sizing',
    description: 'How Falcon AI crafts custom looks and adapts to your personal measurements.',
  },
  {
    icon: RotateCcw,
    title: 'Returns & Exchanges',
    description: '30-day complimentary returns for unblemished atelier garments.',
  },
  {
    icon: ShieldCheck,
    title: 'Atelier Membership',
    description: 'Digital wardrobe intelligence, private previews, and tier privileges.',
  },
];

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="support-page container" aria-labelledby="help-title">
      <header className="support-heading">
        <div>
          <p className="eyebrow">Falcon Client Services</p>
          <h1 id="help-title">Care, considered.</h1>
          <p>Assistance with your atelier pieces, delivery questions, and AI styling sessions.</p>
        </div>
      </header>

      <section style={{ marginBlock: '48px', maxWidth: '640px' }} aria-label="Search help center">
        <label className="search-field search-field--large" htmlFor="help-search">
          <span className="sr-only">Search help articles</span>
          <input
            id="help-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions on orders, sizing, AI stylist..."
          />
          <Search size={20} aria-hidden="true" />
        </label>
      </section>

      <section style={{ marginBlock: '48px' }} aria-labelledby="active-cases-title">
        <div className="section-heading" style={{ marginBottom: '24px' }}>
          <p className="eyebrow">Your cases</p>
          <h2 id="active-cases-title" style={{ fontSize: '28px' }}>Active inquiries</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <article className="admin-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="status-pill status-pill--ready" style={{ marginBottom: '8px' }}>Open / SUP-2084</span>
              <h2 style={{ fontSize: '20px', margin: '4px 0' }}>Payment confirmation</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>Last update: 24 Aug 2026</p>
            </div>
            <Link className="button button--secondary" to="/support/ticket/SUP-2084">
              View ticket &rarr;
            </Link>
          </article>
        </div>
      </section>

      <section style={{ marginBlock: '64px' }} aria-labelledby="support-topics-title">
        <div className="section-heading" style={{ marginBottom: '32px' }}>
          <p className="eyebrow">Knowledge directory</p>
          <h2 id="support-topics-title">Frequently addressed topics</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <article key={category.title} className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', border: '1px solid var(--color-outline-muted)', borderRadius: 'var(--radius-control)', display: 'inline-flex' }}>
                    <Icon size={18} color="var(--color-champagne)" aria-hidden="true" />
                  </div>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>{category.title}</h2>
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '22px' }}>
                  {category.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-panel" style={{ marginBlock: '48px', background: 'var(--color-surface-low)', padding: '36px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div>
            <p className="eyebrow">Direct concierge</p>
            <h2 style={{ fontSize: '32px', margin: '4px 0 8px' }}>Need dedicated assistance?</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Our atelier specialists are available 7 days a week for personalized inquiries.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link className="button button--primary" to="/stylist">
              <MessageSquare size={16} style={{ marginRight: '8px' }} aria-hidden="true" /> Consult Falcon AI
            </Link>
            <Link className="button button--secondary" to="/shop">
              Return to shop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
