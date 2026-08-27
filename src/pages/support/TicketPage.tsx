import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAccount } from '../../features/account/AccountContext';
import { useToast } from '../../features/toast/ToastContext';

type TicketReply = {
  sender: string;
  time: string;
  text: string;
  isCustomer?: boolean;
};

export function TicketPage() {
  const { id = 'SUP-2084' } = useParams();
  const { profile } = useAccount();
  const { showToast } = useToast();

  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState<TicketReply[]>(() => [
    {
      sender: 'Falcon Client Concierge',
      time: '14:32',
      text: `Welcome, ${profile.name}. We have received inquiry ${id} and are reviewing your atelier account details.`,
      isCustomer: false,
    },
    {
      sender: profile.name,
      time: '14:35',
      text: 'Thank you for following up on this order request.',
      isCustomer: true,
    },
  ]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: TicketReply = {
      sender: profile.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText.trim(),
      isCustomer: true,
    };

    setMessages((prev) => [...prev, newReply]);
    setReplyText('');
    showToast('Reply transmitted to client concierge.', 'success');

    // Simulate concierge response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Falcon Client Concierge',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Our specialist has received your update and will process the request shortly.',
          isCustomer: false,
        },
      ]);
    }, 1200);
  };

  return (
    <main className="support-page container" aria-labelledby="ticket-title" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <Link to="/help" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Help Center
        </Link>
      </nav>

      <header className="support-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase' }}>
            Support Inquiry / {id}
          </p>
          <h1 id="ticket-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
            Concierge Consultation
          </h1>
        </div>
        <span className="status-pill status-pill--ready" style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--color-champagne)', color: 'var(--color-champagne)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          Open
        </span>
      </header>

      <div className="ticket-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Case Meta Sidebar */}
        <aside className="ticket-meta" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <p className="eyebrow" style={{ margin: '0 0 1rem 0' }}>Case Details</p>
          <div style={{ display: 'grid', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Customer</span>
              <strong>{profile.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Priority</span>
              <strong>Priority Atelier</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Status</span>
              <strong style={{ color: 'var(--color-champagne)' }}>In Progress</strong>
            </div>
          </div>
        </aside>

        {/* Conversation Thread */}
        <section className="ticket-thread" aria-label="Support conversation" style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gap: '1rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {messages.map((msg, index) => (
              <article
                key={index}
                style={{
                  padding: '1.25rem',
                  borderRadius: '8px',
                  background: msg.isCustomer ? 'var(--color-surface-high, #1e1e24)' : 'var(--color-surface, #141416)',
                  border: '1px solid var(--color-outline-muted)',
                  borderLeft: `3px solid ${msg.isCustomer ? 'var(--color-intelligent-blue, #64b5f6)' : 'var(--color-champagne, #d4af37)'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: msg.isCustomer ? 'var(--color-intelligent-blue)' : 'var(--color-champagne)', fontFamily: 'var(--font-mono)' }}>
                  <span>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{msg.text}</p>
              </article>
            ))}
          </div>

          <form className="ticket-reply" onSubmit={handleSendReply} style={{ marginTop: '1rem' }}>
            <label htmlFor="reply" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Transmit Reply to Client Concierge
            </label>
            <textarea
              id="reply"
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a considered response..."
              style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px', resize: 'vertical', marginBottom: '0.75rem' }}
            />
            <button className="button button--primary" type="submit" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              <Send size={14} /> Send Reply
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}