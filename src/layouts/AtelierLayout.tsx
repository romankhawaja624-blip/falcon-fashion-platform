import { useState } from 'react';
import { Menu, X, Crown, ShieldCheck } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { atelierNav } from '../data/atelier';
import { useAccount } from '../features/account/AccountContext';
import { isPageVisible } from '../data/pageRegistry';

export function AtelierLayout() {
  const { membership } = useAccount();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const visibleNavItems = atelierNav.filter((item) => isPageVisible(item.to));
  const closeNav = () => setMobileNavOpen(false);

  return (
    <div className="atelier-shell">
      {/* Desktop & Mobile Sidebar */}
      <aside className={`atelier-sidebar ${mobileNavOpen ? 'atelier-sidebar--open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link className="atelier-brand" to="/atelier" onClick={closeNav}>
            Digital Atelier
          </Link>
          <button
            className="icon-button mobile-only"
            type="button"
            onClick={closeNav}
            aria-label="Close atelier navigation"
            style={{ display: mobileNavOpen ? 'inline-flex' : 'none' }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <span
          className={`atelier-tier ${membership === 'pro' ? 'atelier-tier--pro' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            border: '1px solid var(--color-champagne)',
            color: 'var(--color-champagne)',
            marginBottom: '1rem',
            width: 'fit-content',
          }}
        >
          {membership === 'pro' ? <Crown size={12} /> : <ShieldCheck size={12} />}
          {membership === 'pro' ? 'Pro Member' : 'Free Tier'}
        </span>

        <nav aria-label="Atelier navigation">
          {visibleNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeNav}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link className="button button--primary" to="/stylist" onClick={closeNav} style={{ marginTop: 'auto' }}>
          Consult AI Stylist
        </Link>
      </aside>

      {/* Mobile Top Header Bar */}
      <header className="atelier-mobile-header">
        <Link className="wordmark" to="/atelier">
          Falcon
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-expanded={mobileNavOpen}
          aria-label="Toggle atelier navigation"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          {mobileNavOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </header>

      {/* Main Outlet */}
      <main className="atelier-main">
        <Outlet />
      </main>
    </div>
  );
}