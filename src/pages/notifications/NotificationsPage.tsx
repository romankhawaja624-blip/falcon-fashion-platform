import { Link } from 'react-router-dom';
import { NotificationsList } from '../../components/notifications/NotificationsList';
import { Bell, ShoppingBag, Sparkles } from 'lucide-react';

export function NotificationsPage() {
  return (
    <main className="container" aria-labelledby="notifications-title" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase' }}>
            Atelier Notifications
          </p>
          <h1 id="notifications-title" style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
            Activity & Updates
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '560px' }}>
            Order dispatches, AI styling updates, loyalty milestones, and membership notifications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link className="button button--secondary" to="/atelier/settings" style={{ fontSize: '0.85rem' }}>
            Notification Preferences
          </Link>
        </div>
      </header>

      <NotificationsList />

      {/* Quick Access Cards */}
      <section style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <ShoppingBag size={16} style={{ color: 'var(--color-champagne)' }} />
            <span className="eyebrow" style={{ margin: 0 }}>Commerce</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            Track Your Orders
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
            View delivery status, archival receipts, and re-order past selections.
          </p>
          <Link className="text-link" to="/orders" style={{ fontSize: '0.85rem' }}>View orders &rarr;</Link>
        </article>

        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne)' }} />
            <span className="eyebrow" style={{ margin: 0 }}>AI Styling</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            Continue Styling
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
            Return to your Falcon AI clienteling session for further curation.
          </p>
          <Link className="text-link" to="/stylist" style={{ fontSize: '0.85rem' }}>Open AI Stylist &rarr;</Link>
        </article>

        <article style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <Bell size={16} style={{ color: 'var(--color-champagne)' }} />
            <span className="eyebrow" style={{ margin: 0 }}>Support</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            Client Concierge
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
            Open a support inquiry or check on an existing case.
          </p>
          <Link className="text-link" to="/help" style={{ fontSize: '0.85rem' }}>Help Center &rarr;</Link>
        </article>
      </section>
    </main>
  );
}
