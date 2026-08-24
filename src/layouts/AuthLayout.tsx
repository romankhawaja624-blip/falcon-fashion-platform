import { Link } from 'react-router-dom';
import { ShaderCanvas } from '../components/effects/ShaderCanvas';

export function AuthLayout({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  return <main className={admin ? 'auth-layout auth-layout--admin' : 'auth-layout'}><div className="auth-layout__visual" aria-hidden="true"><ShaderCanvas reducedMotion /><div className="auth-layout__visual-copy"><p className="eyebrow">{admin ? 'Secure access' : 'The digital atelier'}</p><p>{admin ? 'Protected workspace for Falcon operations.' : 'Where editorial fashion meets intelligent personal style.'}</p></div></div><section className="auth-layout__content"><Link className="auth-wordmark" to="/">Falcon</Link>{children}</section></main>;
}