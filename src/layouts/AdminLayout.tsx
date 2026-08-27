import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { adminNav } from '../data/admin';

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => setMobileNavOpen((prev) => !prev);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="admin-shell">
      {/* Desktop & Mobile Sidebar */}
      <aside className={`admin-sidebar ${mobileNavOpen ? 'admin-sidebar--open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link className="admin-brand" to="/admin" onClick={closeMobileNav}>
            Falcon <span>Admin</span>
          </Link>
          <button
            className="icon-button mobile-only"
            type="button"
            onClick={closeMobileNav}
            aria-label="Close admin navigation"
            style={{ display: mobileNavOpen ? 'inline-flex' : 'none' }}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p className="admin-caption">Operations console</p>
        <nav aria-label="Admin navigation">
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMobileNav}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link className="admin-signout" to="/" onClick={closeMobileNav}>
          Exit workspace &rarr;
        </Link>
      </aside>

      {/* Mobile Top Navigation Header */}
      <header className="admin-mobile-header">
        <Link className="wordmark" to="/admin">
          Falcon Admin
        </Link>
        <button
          className="icon-button"
          type="button"
          aria-label="Toggle admin navigation"
          aria-expanded={mobileNavOpen}
          onClick={toggleMobileNav}
        >
          {mobileNavOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </header>

      {/* Main Outlet */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}