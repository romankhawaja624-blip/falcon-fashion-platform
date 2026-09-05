import { useState } from 'react';
import { AiChatPanel } from '../../components/ai/AiChatPanel';
import { wardrobeItems } from '../../data/atelier';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { useAccount } from '../../features/account/AccountContext';
import { Sparkles, Crown, ShieldCheck, Shirt, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StylistPage() {
  const { profile, membership } = useAccount();
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState<string | null>(null);

  return (
    <div className="atelier-page container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Editorial Header */}
      <header className="atelier-page-heading" style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: 0 }}>
                ATELIER INTELLIGENCE
              </span>
              <span style={{ color: 'var(--color-outline-muted)' }}>/</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                CLIENTELING COGNITION
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 400, margin: '0.25rem 0', letterSpacing: '-0.02em' }}>
              Falcon AI Stylist
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '560px', lineHeight: 1.6 }}>
              Interactive aesthetic synthesis tailored to your silhouette preferences, palette harmony, and catalog archives.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link className="button button--secondary" to="/stylist/builder" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
              <SlidersHorizontal size={14} /> Outfit Studio
            </Link>
          </div>
        </div>
      </header>

      {/* 3-Column Responsive AI Workspace */}
      <div className="ai-workspace-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr minmax(240px, 280px)', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Client Profile & Preferences */}
        <aside className="ai-context" style={{ background: 'var(--color-surface-low, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.75rem', borderRadius: '4px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne, #C2A878)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>CLIENT PROFILE</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.4rem', fontWeight: 400, margin: '0 0 0.75rem 0' }}>
            {profile.name}&apos;s Edit
          </h2>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '1rem 0' }}>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '2px', background: 'var(--color-surface-high)', border: '1px solid var(--color-outline-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {profile.aesthetic}
            </span>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '2px', background: 'var(--color-surface-high)', border: '1px solid var(--color-outline-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {profile.palette}
            </span>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Tailored for architectural silhouettes, biella virgin wool, and fluid silk charmeuse.
          </p>

          <div style={{ padding: '1rem', background: 'var(--color-surface-high, #1a1a1e)', borderRadius: '4px', border: '1px solid var(--color-outline-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-champagne)', textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
              {membership === 'pro' ? <Crown size={13} /> : <ShieldCheck size={13} />}
              {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', lineHeight: 1.4 }}>
              {membership === 'pro' ? 'Unlimited clienteling consultations active' : '3 daily styling sessions available'}
            </span>
          </div>
        </aside>

        {/* Center Column: AI Chat Panel */}
        <main style={{ width: '100%', minWidth: 0 }}>
          <AiChatPanel />
        </main>

        {/* Right Column: Wardrobe Context Anchor Picker */}
        <aside className="ai-wardrobe" style={{ background: 'var(--color-surface-low, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.75rem', borderRadius: '4px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Shirt size={16} style={{ color: 'var(--color-champagne, #C2A878)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>DIGITAL WARDROBE</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.4rem', fontWeight: 400, margin: '0 0 0.5rem 0' }}>
            Anchor Garment
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Select an owned piece to anchor your AI styling session.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {wardrobeItems.slice(0, 3).map((item) => {
              const isSelected = selectedWardrobeItem === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedWardrobeItem(isSelected ? null : item.name)}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--color-champagne, #C2A878)' : '1px solid var(--color-outline-muted)',
                    boxShadow: isSelected ? '0 0 12px rgba(194, 168, 120, 0.2)' : 'none',
                    borderRadius: '4px',
                    transition: 'all 0.25s ease',
                    background: isSelected ? 'var(--color-surface-high)' : 'transparent',
                  }}
                >
                  <WardrobeCard {...item} />
                </div>
              );
            })}
          </div>

          <Link className="text-link" to="/atelier/wardrobe" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '1.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
            View full wardrobe ({wardrobeItems.length}) <ArrowRight size={12} />
          </Link>
        </aside>
      </div>
    </div>
  );
}