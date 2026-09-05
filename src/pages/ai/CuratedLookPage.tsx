import { Link, useParams } from 'react-router-dom';
import { products, type Product } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { ProductCard } from '../../components/product/ProductCard';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ShoppingBag, Sparkles, ArrowLeft, SlidersHorizontal, ArrowRight } from 'lucide-react';

export function CuratedLookPage() {
  const { slug = 'obsidian-evening' } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Curated look definition map
  const lookData = {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    category: 'AI EDITORIAL COMPOSITION',
    description: 'A quiet, architectural edit designed for an evening with room to move. Fluid Mulberry silk anchored by heavy, structured virgin wool outerwear and sharp Italian tailoring.',
    heroAssetId: 'obsidian-silk-gown-main',
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
      showToast(`Added complete curated look (${count} pieces) to your bag`, 'success');
    }
  };

  return (
    <div className="atelier-page container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      {/* Navigation Breadcrumb */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/stylist" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <ArrowLeft size={14} /> Back to AI Stylist
        </Link>
      </nav>

      <header className="atelier-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: 0 }}>
              {lookData.category}
            </span>
            <span style={{ color: 'var(--color-outline-muted)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              FALCON EDIT 01
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 400, margin: '0.25rem 0 1rem 0', letterSpacing: '-0.02em' }}>
            {lookData.title}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: 0, lineHeight: 1.7, fontSize: '1rem' }}>
            {lookData.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button button--primary"
            onClick={handleAddFullLook}
            style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}
          >
            <ShoppingBag size={16} /> Add Complete Look (${totalValue.toLocaleString()})
          </button>
          <Link className="button button--secondary" to="/stylist/builder" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <SlidersHorizontal size={14} /> Refine in Studio
          </Link>
        </div>
      </header>

      {/* Hero Visual Section */}
      <section className="curated-look-hero" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '5rem' }}>
        <div className="curated-look__image" style={{ borderRadius: '4px', overflow: 'hidden', height: '520px', position: 'relative', background: 'var(--color-surface-low, #141416)', border: '1px solid var(--color-outline-muted)' }}>
          <RemoteImage assetId={lookData.heroAssetId} alt={lookData.title} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,12,0.85) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-champagne, #C2A878)', fontFamily: 'var(--font-mono)' }}>
              FALCON COGNITION ARCHIVE
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.75rem', fontWeight: 400, margin: '0.35rem 0 0 0' }}>
              Form Follows Feeling
            </h3>
          </div>
        </div>

        <div className="curated-look__details" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne, #C2A878)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>COMPOSITION BREAKDOWN</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2.2rem', fontWeight: 400, margin: '0 0 1rem 0' }}>
            Architectural Balance
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '2rem' }}>
            This edit balances clean lines with expressive textures. Each piece has been proportioned to layer effortlessly while retaining an independent architectural presence across varying environments.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
            {lookData.pieces.map((piece) => (
              <li
                key={piece.slug}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--color-surface-low, #141416)',
                  border: '1px solid var(--color-outline-muted)',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 400, fontFamily: 'var(--font-display, "Bodoni Moda", serif)' }}>
                    {piece.name}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {piece.category} — {piece.price}
                  </span>
                </div>
                <Link className="text-link" to={`/product/${piece.slug}`} style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View Piece <ArrowRight size={12} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Included Product Cards */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: '0 0 0.25rem 0' }}>
              ENSEMBLE PIECES
            </p>
            <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>
              Included Silhouettes
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {lookData.pieces.length} Pieces
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {lookData.pieces.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}