import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, FREE_DAILY_LIMIT, FREE_MONTHLY_LIMIT } from '../../features/account/AccountContext';
import { useToast } from '../../features/toast/ToastContext';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Sparkles, Check, Crown } from 'lucide-react';

export function SettingsPage() {
  const {
    membership,
    profile,
    updateProfile,
    upgradeMembership,
    downgradeMembership,
    dailyAiCount,
    monthlyAiCount,
  } = useAccount();

  const { showToast } = useToast();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [aesthetic, setAesthetic] = useState(profile.aesthetic);
  const [palette, setPalette] = useState(profile.palette);
  const [outerwearSize, setOuterwearSize] = useState(profile.outerwearSize);
  const [tailoringSize, setTailoringSize] = useState(profile.tailoringSize);
  const [footwearSize, setFootwearSize] = useState(profile.footwearSize);
  const [currency, setCurrency] = useState(profile.currency);
  const [region, setRegion] = useState(profile.region);
  const [aiLearning, setAiLearning] = useState(profile.aiLearning);

  // Notification toggles
  const [orderNotifs, setOrderNotifs] = useState(profile.notifications.orders);
  const [promoNotifs, setPromoNotifs] = useState(profile.notifications.promotions);
  const [stylingNotifs, setStylingNotifs] = useState(profile.notifications.styling);
  const [conciergeNotifs, setConciergeNotifs] = useState(profile.notifications.concierge);

  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({
      name,
      email,
      aesthetic,
      palette,
      outerwearSize,
      tailoringSize,
      footwearSize,
      currency,
      region,
      aiLearning,
      notifications: {
        orders: orderNotifs,
        promotions: promoNotifs,
        styling: stylingNotifs,
        concierge: conciergeNotifs,
      },
    });
    setSaved(true);
    showToast('Atelier settings & profile updated successfully.', 'success');
    setTimeout(() => setSaved(false), 4000);
  };

  const handleMembershipToggle = () => {
    if (membership === 'free') {
      upgradeMembership();
      showToast('Welcome to Falcon Pro Membership! Unlimited AI Clienteling unlocked.', 'success');
    } else {
      downgradeMembership();
      showToast('Switched to Free Atelier Tier.', 'info');
    }
  };

  return (
    <div className="atelier-page settings-page" style={{ paddingBottom: '4rem' }}>
      <header className="atelier-page-heading" style={{ marginBottom: '2.5rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Atelier / Preferences
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.5rem 0' }}>
            Settings & Profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
            Fine-tune your personal style parameters, measurements, notification preferences, and membership tier.
          </p>
        </div>
        <Link className="text-link" to="/atelier" style={{ fontSize: '0.9rem' }}>
          &larr; Back to dashboard
        </Link>
      </header>

      {saved && (
        <div style={{ padding: '1rem', background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50', borderRadius: '6px', color: '#4caf50', marginBottom: '2rem' }}>
          ✓ Preferences saved to your local atelier profile.
        </div>
      )}

      {/* Membership Plan Section */}
      <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne)', textTransform: 'uppercase' }}>Membership Tier</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '0.25rem 0' }}>
              {membership === 'pro' ? 'Falcon Pro Atelier' : 'Free Atelier Member'}
            </h2>
          </div>
          <span className={`status-pill ${membership === 'pro' ? 'status-pill--ready' : ''}`} style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--color-champagne)',
            color: 'var(--color-champagne)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {membership === 'pro' ? <Crown size={14} /> : <ShieldCheck size={14} />}
            {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface-low, #1a1a1e)', padding: '1.25rem', borderRadius: '6px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Free Tier Allowances</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              <li>3 AI messages / day (Used today: {dailyAiCount}/3)</li>
              <li>50 AI messages / month (Used this month: {monthlyAiCount}/50)</li>
              <li>Standard catalog & order tracking</li>
            </ul>
          </div>

          <div style={{ background: 'var(--color-surface-low, #1a1a1e)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--color-champagne, #d4af37)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-champagne)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Crown size={16} /> Falcon Pro Benefits
            </h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              <li>Unlimited Falcon AI Clienteling & Styling</li>
              <li>Priority Wardrobe Curation & Capsule Builder</li>
              <li>2× XP Rewards & 48h Drop Early Access</li>
              <li>Complimentary Express Global Shipping</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button type="button" onClick={handleMembershipToggle} variant={membership === 'free' ? 'primary' : 'secondary'}>
            {membership === 'free' ? 'Upgrade to Falcon Pro' : 'Downgrade to Free Tier'}
          </Button>
        </div>
      </section>

      {/* Form Settings */}
      <form className="settings-form" onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
        {/* Identity */}
        <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            01 / Member Profile & Identity
          </h2>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Full Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
            </label>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Email Address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
            </label>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Atelier Member ID</span>
              <input value={profile.atelierId} disabled style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-outline-muted)', color: 'var(--color-text-muted)', borderRadius: '4px', cursor: 'not-allowed' }} />
            </label>
          </div>
        </section>

        {/* Style Parameters */}
        <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            02 / Aesthetic Direction
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>Primary Aesthetic</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Quiet structure', 'Fluid ease', 'Avant-garde edge'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '20px',
                      border: '1px solid var(--color-outline-muted)',
                      background: aesthetic === opt ? 'var(--color-text, #fff)' : 'transparent',
                      color: aesthetic === opt ? 'var(--color-background, #000)' : 'var(--color-text, #fff)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                    onClick={() => setAesthetic(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>Signature Palette</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Monochrome', 'Champagne & Ink', 'Mineral Slate', 'Earth & Stone'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '20px',
                      border: '1px solid var(--color-outline-muted)',
                      background: palette === opt ? 'var(--color-text, #fff)' : 'transparent',
                      color: palette === opt ? 'var(--color-background, #000)' : 'var(--color-text, #fff)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                    onClick={() => setPalette(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sizing Specifications */}
        <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            03 / Sizing Specifications
          </h2>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Outerwear Size</span>
              <input value={outerwearSize} onChange={(e) => setOuterwearSize(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
            </label>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Tailoring & Blazer</span>
              <input value={tailoringSize} onChange={(e) => setTailoringSize(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
            </label>
            <label className="form-field">
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Footwear</span>
              <input value={footwearSize} onChange={(e) => setFootwearSize(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
            </label>
          </div>
        </section>

        {/* Notifications & Currency */}
        <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            04 / Notifications & Regional Controls
          </h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={orderNotifs} onChange={(e) => setOrderNotifs(e.target.checked)} />
                <span>Order Status Notifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={stylingNotifs} onChange={(e) => setStylingNotifs(e.target.checked)} />
                <span>AI Styling Recommendations</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={promoNotifs} onChange={(e) => setPromoNotifs(e.target.checked)} />
                <span>Private Collection Drops</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={conciergeNotifs} onChange={(e) => setConciergeNotifs(e.target.checked)} />
                <span>Concierge & Support Tickets</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-outline-muted)' }}>
              <label className="form-field">
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Preferred Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
                >
                  <option value="USD ($)">USD ($) — US Dollar</option>
                  <option value="EUR (€)">EUR (€) — Euro</option>
                  <option value="GBP (£)">GBP (£) — British Pound</option>
                  <option value="AED (د.إ)">AED (د.إ) — UAE Dirham</option>
                </select>
              </label>
              <label className="form-field">
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Regional Delivery Zone</span>
                <input value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }} />
              </label>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button type="submit">Save All Preferences</Button>
          <Link className="button button--secondary" to="/atelier">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
