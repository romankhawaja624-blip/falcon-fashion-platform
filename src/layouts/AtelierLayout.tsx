import { Menu, Sparkles } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { atelierNav } from '../data/atelier';

export function AtelierLayout() {
  return <div className="atelier-shell"><aside className="atelier-sidebar"><Link className="atelier-brand" to="/atelier">Digital Atelier</Link><span className="atelier-tier">Premium member</span><nav aria-label="Atelier navigation">{atelierNav.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}</nav><Link className="button button--primary" to="/stylist">Book styling session</Link></aside><header className="atelier-mobile-header"><Link className="wordmark" to="/atelier">Falcon</Link><button className="icon-button" type="button" aria-label="Open atelier navigation"><Menu size={21} aria-hidden="true" /></button></header><main className="atelier-main"><Outlet /></main></div>;
}