import { Menu } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { adminNav } from '../data/admin';

export function AdminLayout() {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" to="/admin">Falcon <span>Admin</span></Link><p className="admin-caption">Operations console</p><nav aria-label="Admin navigation">{adminNav.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}</nav><Link className="admin-signout" to="/">Exit workspace</Link></aside><header className="admin-mobile-header"><Link className="wordmark" to="/admin">Falcon</Link><button className="icon-button" type="button" aria-label="Open admin navigation"><Menu size={21} aria-hidden="true" /></button></header><main className="admin-main"><Outlet /></main></div>;
}