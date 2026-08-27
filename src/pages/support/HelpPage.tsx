import { Search, MessageSquare, Package, RotateCcw, ShieldCheck, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../features/toast/ToastContext';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved';
  lastUpdate: string;
}

const initialTickets: SupportTicket[] = [
  { id: 'SUP-2084', subject: 'Payment confirmation inquiry', category: 'Orders & Delivery', status: 'Open', lastUpdate: '24 Aug 2026' },
];

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
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('falcon_tickets');
      return saved ? JSON.parse(saved) : initialTickets;
    } catch {
      return initialTickets;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Orders & Delivery');
  const [description, setDescription] = useState('');

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem('falcon_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save tickets to localStorage', e);
    }
  }, [tickets]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newTicketId = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newTicketId,
      subject: subject.trim(),
      category,
      status: 'Open',
      lastUpdate: 'Today',
    };

    setTickets((prev) => [newTicket, ...prev]);
    setShowModal(false);
    setSubject('');
    setDescription('');
    showToast(`Support Ticket ${newTicketId} created successfully.`, 'success');
    navigate(`/support/ticket/${newTicketId}`);
  };

  return (
    <main className="support-page container" aria-labelledby="help-title" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header className="support-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.5rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase' }}>Falcon Client Services</p>
          <h1 id="help-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
            Care, Considered.
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Assistance with your atelier pieces, delivery questions, and AI styling sessions.</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
          <Plus size={16} /> Open New Support Ticket
        </Button>
      </header>

      <section style={{ marginBlock: '2.5rem', maxWidth: '640px' }} aria-label="Search help center">
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

      {/* Active Cases Section */}
      <section style={{ marginBlock: '2.5rem' }} aria-labelledby="active-cases-title">
        <div className="section-heading" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <p className="eyebrow">Your Cases</p>
            <h2 id="active-cases-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: 0 }}>
              Support Inquiries ({tickets.length})
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {tickets.map((t) => (
            <article key={t.id} className="admin-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.25rem', borderRadius: '8px' }}>
              <div>
                <span className="status-pill status-pill--ready" style={{ marginBottom: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--color-champagne)', color: 'var(--color-champagne)' }}>
                  {t.status} / {t.id}
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: '8px 0 4px 0', fontFamily: 'var(--font-heading, "Bodoni Moda", serif)' }}>
                  {t.subject}
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Category: {t.category} • Updated: {t.lastUpdate}
                </p>
              </div>
              <Link className="button button--secondary" to={`/support/ticket/${t.id}`} style={{ fontSize: '0.8rem' }}>
                View Ticket &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Knowledge Directory */}
      <section style={{ marginBlock: '3.5rem' }} aria-labelledby="support-topics-title">
        <div className="section-heading" style={{ marginBottom: '2rem' }}>
          <p className="eyebrow">Knowledge Directory</p>
          <h2 id="support-topics-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: 0 }}>
            Frequently Addressed Topics
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map((categoryItem) => {
            const Icon = categoryItem.icon;
            return (
              <article key={categoryItem.title} className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', display: 'inline-flex' }}>
                    <Icon size={18} style={{ color: 'var(--color-champagne)' }} aria-hidden="true" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-heading, "Bodoni Moda", serif)' }}>{categoryItem.title}</h3>
                </div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {categoryItem.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Direct Concierge Banner */}
      <section className="admin-panel" style={{ marginBlock: '3rem', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '2rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>Direct Concierge</p>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '4px 0 8px' }}>Need Dedicated Assistance?</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Our atelier specialists are available 7 days a week for personalized inquiries.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="button button--primary" to="/stylist">
              <MessageSquare size={16} style={{ marginRight: '8px' }} aria-hidden="true" /> Consult Falcon AI
            </Link>
            <Link className="button button--secondary" to="/shop">
              Return to Shop
            </Link>
          </div>
        </div>
      </section>

      {/* Create Ticket Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--color-surface, #141416)',
            border: '1px solid var(--color-outline-muted)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '520px',
            width: '100%',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Open New Support Ticket
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Submit a private inquiry directly to the Falcon Atelier Client Concierge team.
            </p>

            <form onSubmit={handleCreateTicket} style={{ display: 'grid', gap: '1.25rem' }}>
              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Inquiry Subject
                </span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Delivery status for Obsidian Coat"
                  required
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
                >
                  <option value="Orders & Delivery">Orders & Delivery</option>
                  <option value="AI Styling & Sizing">AI Styling & Sizing</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                  <option value="Atelier Membership">Atelier Membership</option>
                </select>
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Detailed Description
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your inquiry..."
                  rows={4}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                />
              </label>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>
                  Submit Inquiry
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
