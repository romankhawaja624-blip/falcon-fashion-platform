import { useState } from 'react';
import { AiChatPanel } from '../../components/ai/AiChatPanel';
import { wardrobeItems } from '../../data/atelier';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { useAccount } from '../../features/account/AccountContext';
import { Sparkles, Crown, ShieldCheck, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StylistPage() {
  const { profile, membership } = useAccount();
  const [selectedWardrobeItem, setSelectedWardrobeItem] = useState<string | null>(null);

  return (
    <div className="ai-workspace container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Atelier Intelligence
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
              Falcon AI Stylist
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link className="button button--secondary" to="/stylist/builder" style={{ fontSize: '0.85rem' }}>
              Open Outfit Studio &rarr;
            </Link>
          </div>
        </div>
      </header>

      <div className="ai-workspace-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '1.5rem', width: '100%' }}>
        {/* Left Column: Style Profile */}
        <aside className="ai-context" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Style Profile</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
            {profile.name}&apos;s Edit
          </h2>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '1rem 0' }}>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)' }}>
              {profile.aesthetic}
            </span>
            <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)' }}>
              {profile.palette}
            </span>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Tailored for architectural silhouettes, biella virgin wool, and fluid silk charmeuse.
          </p>

          <div style={{ padding: '0.85rem', background: 'var(--color-surface-low, #1a1a1e)', borderRadius: '6px', border: '1px solid var(--color-outline-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-champagne)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              {membership === 'pro' ? <Crown size={12} /> : <ShieldCheck size={12} />}
              {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
              {membership === 'pro' ? 'Unlimited styling sessions active' : '3 daily styling sessions available'}
            </span>
          </div>
        </aside>

        {/* Center Column: AI Chat Panel */}
        <main style={{ width: '100%' }}>
          <AiChatPanel />
        </main>

        {/* Right Column: Wardrobe Context Picker */}
        <aside className="ai-wardrobe" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
            <Shirt size={16} style={{ color: 'var(--color-champagne)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Digital Wardrobe</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
            Select Anchor
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            Select a wardrobe piece to anchor your AI styling session.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {wardrobeItems.slice(0, 3).map((item) => (
              <div
                key={item.name}
                onClick={() => setSelectedWardrobeItem(item.name === selectedWardrobeItem ? null : item.name)}
                style={{
                  cursor: 'pointer',
                  border: selectedWardrobeItem === item.name ? '2px solid var(--color-champagne)' : '1px solid transparent',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <WardrobeCard {...item} />
              </div>
            ))}
          </div>

          <Link className="text-link" to="/atelier/wardrobe" style={{ display: 'inline-block', marginTop: '1.25rem', fontSize: '0.85rem' }}>
            View full wardrobe ({wardrobeItems.length}) &rarr;
          </Link>
        </aside>
      </div>
    </div>
  );
}