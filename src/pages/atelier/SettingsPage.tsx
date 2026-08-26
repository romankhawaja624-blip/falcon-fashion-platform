import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function SettingsPage() {
  const [aesthetic, setAesthetic] = useState('Quiet structure');
  const [palette, setPalette] = useState('Monochrome');
  const [aiLearning, setAiLearning] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');
  const [saved, setSaved] = useState(false);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="atelier-page settings-page">
      <header className="atelier-page-heading">
        <div>
          <p className="eyebrow">Atelier / Preferences</p>
          <h1>Settings & profile.</h1>
          <p>Fine-tune your personal style parameters, measurements, and AI intelligence.</p>
        </div>
        <Link className="text-link" to="/atelier">
          &larr; Back to dashboard
        </Link>
      </header>

      {saved && (
        <p className="auth-success" role="status" style={{ marginBlock: '24px 0', textAlign: 'start' }}>
          Preferences updated successfully.
        </p>
      )}

      <form className="settings-form" onSubmit={handleSave} style={{ marginTop: '48px', display: 'grid', gap: '48px' }}>
        <section className="admin-panel" style={{ background: 'var(--color-surface-low)' }}>
          <div className="admin-panel-heading" style={{ marginBottom: '24px' }}>
            <div>
              <p className="eyebrow">01 / Identity</p>
              <h2>Member profile</h2>
            </div>
            <span className="status-pill status-pill--ready">Premium member</span>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <label className="form-field">
              <span>Full name</span>
              <input defaultValue="Alex Morgan" aria-label="Full name" />
            </label>
            <label className="form-field">
              <span>Email address</span>
              <input defaultValue="alex@example.com" type="email" aria-label="Email address" />
            </label>
            <label className="form-field">
              <span>Atelier ID</span>
              <input value="FX-MBR-8492" disabled aria-label="Atelier ID" style={{ opacity: 0.6 }} />
            </label>
          </div>
        </section>

        <section className="admin-panel" style={{ background: 'var(--color-surface-low)' }}>
          <div className="admin-panel-heading" style={{ marginBottom: '24px' }}>
            <div>
              <p className="eyebrow">02 / Style parameters</p>
              <h2>Aesthetic direction</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <span className="field__label" style={{ display: 'block', marginBottom: '12px' }}>Primary aesthetic</span>
              <div className="filter-group" role="radiogroup" aria-label="Primary aesthetic">
                {['Quiet structure', 'Fluid ease', 'Avant-garde edge'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={aesthetic === opt}
                    className={aesthetic === opt ? 'filter-chip filter-chip--active' : 'filter-chip'}
                    onClick={() => setAesthetic(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="field__label" style={{ display: 'block', marginBottom: '12px' }}>Signature palette</span>
              <div className="filter-group" role="radiogroup" aria-label="Signature palette">
                {['Monochrome', 'Champagne & Ink', 'Mineral Slate', 'Earth & Stone'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={palette === opt}
                    className={palette === opt ? 'filter-chip filter-chip--active' : 'filter-chip'}
                    onClick={() => setPalette(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="admin-panel" style={{ background: 'var(--color-surface-low)' }}>
          <div className="admin-panel-heading" style={{ marginBottom: '24px' }}>
            <div>
              <p className="eyebrow">03 / Sizing specifications</p>
              <h2>Measurements</h2>
            </div>
          </div>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <label className="form-field">
              <span>Outerwear size</span>
              <input defaultValue="M (Medium)" aria-label="Outerwear size" />
            </label>
            <label className="form-field">
              <span>Tailoring & blazer</span>
              <input defaultValue="38R / EU 48" aria-label="Tailoring size" />
            </label>
            <label className="form-field">
              <span>Eveningwear & gowns</span>
              <input defaultValue="S / UK 8" aria-label="Eveningwear size" />
            </label>
            <label className="form-field">
              <span>Footwear</span>
              <input defaultValue="39 EU / 8.5 US" aria-label="Footwear size" />
            </label>
          </div>
        </section>

        <section className="admin-panel" style={{ background: 'var(--color-surface-low)' }}>
          <div className="admin-panel-heading" style={{ marginBottom: '24px' }}>
            <div>
              <p className="eyebrow">04 / Intelligence & regional</p>
              <h2>AI & locale controls</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '16px', fontWeight: 400 }}>Style Intelligence Learning</strong>
                <small style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Allow Falcon AI to learn from your styling sessions and wardrobe choices.</small>
              </div>
              <button
                type="button"
                className={aiLearning ? 'filter-chip filter-chip--active' : 'filter-chip'}
                onClick={() => setAiLearning(!aiLearning)}
                aria-pressed={aiLearning}
              >
                {aiLearning ? 'Active' : 'Disabled'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-outline-muted)' }}>
              <label className="form-field">
                <span>Preferred currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ background: 'transparent', border: 0, borderBottom: '1px solid var(--color-outline-muted)', color: 'var(--color-text)', padding: '12px 0' }}
                >
                  <option value="USD ($)" style={{ background: 'var(--color-surface)' }}>USD ($) — US Dollar</option>
                  <option value="EUR (€)" style={{ background: 'var(--color-surface)' }}>EUR (€) — Euro</option>
                  <option value="GBP (£)" style={{ background: 'var(--color-surface)' }}>GBP (£) — British Pound</option>
                  <option value="AED (د.إ)" style={{ background: 'var(--color-surface)' }}>AED (د.إ) — UAE Dirham</option>
                </select>
              </label>
              <label className="form-field">
                <span>Regional delivery zone</span>
                <input defaultValue="North America / Global Express" aria-label="Regional delivery zone" />
              </label>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button type="submit">Save preferences</Button>
          <Link className="button button--secondary" to="/atelier">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
