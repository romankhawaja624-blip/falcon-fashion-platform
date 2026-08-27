import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';

export function PublicLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="sr-only" href="#main-content" style={{ position: 'absolute', top: 0, left: 0, padding: '8px 16px', background: 'var(--color-champagne)', color: '#000', zIndex: 10000, textDecoration: 'none' }}>
        Skip to main content
      </a>
      <PublicHeader />
      <div id="main-content">
        {children ?? <Outlet />}
      </div>
      <PublicFooter />
    </div>
  );
}