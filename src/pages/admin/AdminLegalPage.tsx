import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Globe, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminLegalPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<'privacy' | 'terms' | 'returns' | 'cookies'>('privacy');

  const policies = [
    {
      id: 'privacy',
      title: 'Privacy Policy & Data Rights',
      version: 'v2.4',
      status: 'Current',
      updated: '15 Aug 2026',
      summary: 'Data protection standards governing AI clienteling, digital wardrobe storage, and member profiles under GDPR and CCPA.',
      content: `FALCON values client privacy above all. Personal measurements, wardrobe selections, and AI styling history are stored strictly with encryption and local privacy controls. We do not sell or monetize personal styling data to third parties.`,
    },
    {
      id: 'terms',
      title: 'Terms of Atelier Service',
      version: 'v1.9',
      status: 'Current',
      updated: '01 Jul 2026',
      summary: 'Terms governing digital atelier membership tiers, private preview access, and custom orders.',
      content: `Access to FALCON Pro features and private atelier previews is provided according to your active membership status. All digital wardrobe intelligence remains the property of the client.`,
    },
    {
      id: 'returns',
      title: 'Returns & Exchange Policy',
      version: 'v3.1',
      status: 'Current',
      updated: '10 Aug 2026',
      summary: '30-day complimentary returns for unblemished atelier garments with original tags and security seals.',
      content: `Complimentary global courier returns are provided within 30 days of delivery. Returned pieces must remain unwashed, unworn, and in original packaging.`,
    },
    {
      id: 'cookies',
      title: 'Cookie & Tracking Policy',
      version: 'v1.2',
      status: 'Under Review',
      updated: '20 Aug 2026',
      summary: 'Strictly essential session cookies used for shopping bag state and client session persistence.',
      content: `FALCON uses strictly functional local storage and cookies to maintain your shopping cart, active wishlist, and session authentication. No intrusive tracking pixels are deployed.`,
    },
  ];

  const currentPolicyObj = policies.find((p) => p.id === selectedPolicy) ?? policies[0];

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Legal & Regional Compliance
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Policy & Governance
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Global regulatory compliance, policy publication manifest, and regional readiness.
          </p>
        </div>
        <Link className="button button--secondary" to="/legal" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ExternalLink size={16} /> View Customer Legal Page
        </Link>
      </header>

      {/* Compliance Overview Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-champagne)' }} />
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(40,167,69,0.15)', color: '#28a745', border: '1px solid #28a745' }}>
              Compliant
            </span>
          </div>
          <p className="eyebrow" style={{ margin: 0 }}>Data Protection</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>GDPR & CCPA</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>All client measurement & wardrobe records protected.</p>
        </article>

        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <Globe size={20} style={{ color: 'var(--color-champagne)' }} />
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', color: 'var(--color-champagne)', border: '1px solid var(--color-champagne)' }}>
              18 Markets
            </span>
          </div>
          <p className="eyebrow" style={{ margin: 0 }}>Regional Coverage</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>Global Operations</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>Multilingual terms & regional consumer laws active.</p>
        </article>

        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <FileText size={20} style={{ color: 'var(--color-champagne)' }} />
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(255,193,7,0.15)', color: '#ffc107', border: '1px solid #ffc107' }}>
              1 Under Review
            </span>
          </div>
          <p className="eyebrow" style={{ margin: 0 }}>Policy Manifest</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>4 Core Documents</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>Privacy, Terms, Returns, and Cookie Governance.</p>
        </article>
      </section>

      {/* Policy Manifest Table & Viewer */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Document Selector Table */}
        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Policy Roster</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0.25rem 0 1.25rem 0' }}>
            Governance Manifest
          </h3>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {policies.map((p) => {
              const active = selectedPolicy === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPolicy(p.id as any)}
                  style={{
                    padding: '1rem',
                    borderRadius: '6px',
                    border: `1px solid ${active ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                    background: active ? 'var(--color-surface-low, #1c1c1f)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: active ? 'var(--color-champagne)' : 'var(--color-text)' }}>{p.title}</strong>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-text-muted)' }}>{p.version}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{p.summary}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Updated: {p.updated}</span>
                    <span style={{ color: p.status === 'Current' ? '#28a745' : '#ffc107' }}>● {p.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Policy Document Preview */}
        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Document Inspection</span>
              <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>
                {currentPolicyObj.title}
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)', padding: '0.3rem 0.6rem', border: '1px solid var(--color-outline-muted)', borderRadius: '4px' }}>
              {currentPolicyObj.version}
            </span>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', fontSize: '0.85rem' }}>
              <strong>Status:</strong> {currentPolicyObj.status} / <strong>Effective Date:</strong> {currentPolicyObj.updated}
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Executive Summary</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{currentPolicyObj.summary}</p>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Policy Excerpt</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7, background: 'var(--color-surface-low, #1c1c1f)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid var(--color-champagne)', margin: 0 }}>
                {currentPolicyObj.content}
              </p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Link className="button button--secondary" to="/legal" target="_blank" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                View Published Page <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}