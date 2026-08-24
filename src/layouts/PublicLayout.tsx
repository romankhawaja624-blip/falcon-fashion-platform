import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';

export function PublicLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="app-shell">
      <PublicHeader />
      {children ?? <Outlet />}
    </div>
  );
}