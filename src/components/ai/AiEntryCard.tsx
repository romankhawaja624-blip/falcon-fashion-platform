import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AiEntryCard() {
  return <aside className="ai-entry"><p className="eyebrow">Falcon intelligence</p><h2>Find the pieces that feel like you.</h2><p>Describe an occasion, a mood, or a silhouette. Falcon will shape the edit.</p><Link className="text-link" to="/assistant">Open AI stylist <ArrowUpRight size={16} aria-hidden="true" /></Link></aside>;
}