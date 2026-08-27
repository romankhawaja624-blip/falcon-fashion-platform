import { Link, useParams } from 'react-router-dom';
import { products, type Product } from '../../data/products';
import { Image } from '../../components/ui/Image';
import { ProductCard } from '../../components/product/ProductCard';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ShoppingBag, Sparkles, ArrowLeft } from 'lucide-react';

export function CuratedLookPage() {
  const { slug = 'obsidian-evening' } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Curated look definition map
  const lookData = {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'AI Editorial Composition',
    description: 'A quiet, architectural edit designed for an evening with room to move. Fluid Mulberry silk anchored by heavy, structured virgin wool outerwear.',
    imageKey: 'womenCollection',
    pieces: [products[0], products[1], products[2]].filter(Boolean) as Product[],
  };

  const totalValue = lookData.pieces.reduce((sum, p) => sum + p.priceValue, 0);

  const handleAddFullLook = () => {
    let count = 0;
    lookData.pieces.forEach((p) => {
      const res = addItem(p, p.sizes[0] || 'One Size');
      if (res.success !== false) count++;
    });

    if (count > 0) {
      showToast(`Added full curated look (${count} pieces) to your bag`, 'success');
    }
  };

  return (
    <div className="curated-page atelier-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Navigation Breadcrumb */}
      <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <Link to="/stylist" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to AI Stylist
        </Link>
      </nav>

      <header className="atelier-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {lookData.category}
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.75rem', margin: '0.25rem 0 0.5rem 0' }}>
            {lookData.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: 0, lineHeight: 1.6 }}>
            {lookData.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            className="button button--primary"
            onClick={handleAddFullLook}
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}
          >
            <ShoppingBag size={16} /> Add Complete Look (${totalValue.toLocaleString()})
          </button>
          <Link className="button button--secondary" to="/stylist/builder">
            Refine in Outfit Studio
          </Link>
        </div>
      </header>

      {/* Hero Visual Section */}
      <section className="curated-look" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        <div className="curated-look__image" style={{ borderRadius: '8px', overflow: 'hidden', height: '440px', position: 'relative', background: '#1a1a1e' }}>
          <Image imageKey={lookData.imageKey} alt={lookData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-champagne)' }}>
              FALCON EDIT 01
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0 0 0' }}>
              Form Follows Feeling
            </h3>
          </div>
        </div>

        <div className="curated-look__details" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>Atelier Composition</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '0 0 1rem 0' }}>
            The Composition Breakdown
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            This edit balances clean lines with expressive textures. Each piece has been proportioned to layer effortlessly while retaining an independent architectural presence.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'grid', gap: '1rem' }}>
            {lookData.pieces.map((piece) => (
              <li
                key={piece.slug}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: 'var(--color-surface, #141416)',
                  border: '1px solid var(--color-outline-muted)',
                  borderRadius: '6px',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 500 }}>{piece.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{piece.category} — {piece.price}</span>
                </div>
                <Link className="text-link" to={`/product/${piece.slug}`} style={{ fontSize: '0.85rem' }}>
                  View Piece &rarr;
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Included Product Cards */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: 0 }}>
            Included Silhouettes
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {lookData.pieces.length} Pieces
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {lookData.pieces.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}