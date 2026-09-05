import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiChatPanel } from '../../components/ai/AiChatPanel';
import { products, type Product } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ShoppingBag, Sparkles, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

const occasionMap: Record<string, string[]> = {
  'Minimal evening': ['Eveningwear', 'Outerwear', 'Tailoring'],
  'Gallery opening': ['Tailoring', 'Outerwear', 'Accessories'],
  'Global travel': ['Knitwear', 'Outerwear', 'Tailoring'],
  'Executive summit': ['Tailoring', 'Outerwear', 'Knitwear'],
};

export function OutfitBuilderPage() {
  const [occasion, setOccasion] = useState('Minimal evening');
  const [aesthetic, setAesthetic] = useState('Structured');
  const [investment, setInvestment] = useState(85);
  const [anchorSlug, setAnchorSlug] = useState<string>('obsidian-wool-coat');
  const [savedToWardrobe, setSavedToWardrobe] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const anchorProduct = useMemo(() => products.find((p) => p.slug === anchorSlug), [anchorSlug]);

  // Compute complementary outfit pieces
  const compositionPieces = useMemo(() => {
    const categories = occasionMap[occasion] || ['Tailoring', 'Outerwear'];
    const maxPrice = Math.round((investment / 100) * 3000);

    const complementary = products.filter((p) => {
      if (anchorProduct && p.slug === anchorProduct.slug) return false;
      const matchCat = categories.includes(p.category);
      const matchPrice = p.priceValue <= maxPrice;
      return matchCat && matchPrice;
    });

    const list: Product[] = [];
    if (anchorProduct) list.push(anchorProduct);

    // Pick top 3 complementary items
    complementary.slice(0, 3).forEach((item) => list.push(item));
    return list;
  }, [occasion, investment, anchorProduct]);

  const handleAddLookToBag = () => {
    let count = 0;
    compositionPieces.forEach((p) => {
      const size = p.sizes[0] ?? 'One Size';
      const result = addItem(p, size);
      if (result.success !== false) {
        count++;
      }
    });

    if (count > 0) {
      showToast(`Added complete look (${count} pieces) to your bag`, 'success');
    } else {
      showToast('Items in this look are out of stock.', 'error');
    }
  };

  const handleSaveToWardrobe = () => {
    setSavedToWardrobe(true);
    showToast(`Look "${occasion} – ${aesthetic}" saved to your digital wardrobe`, 'success');
    setTimeout(() => setSavedToWardrobe(false), 3000);
  };

  const totalLookValue = compositionPieces.reduce((sum, p) => sum + p.priceValue, 0);

  return (
    <div className="atelier-page container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Editorial Header */}
      <header className="atelier-page-heading" style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: 0 }}>
                ATELIER STUDIO
              </span>
              <span style={{ color: 'var(--color-outline-muted)' }}>/</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                COMPOSITION ENGINE
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 400, margin: '0.25rem 0', letterSpacing: '-0.02em' }}>
              Outfit Studio & Composition Builder
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '560px', lineHeight: 1.6 }}>
              Calibrate occasions, silhouettes, and investment thresholds to compose unified looks anchored by signature garments.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link className="button button--secondary" to="/stylist" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
              <MessageSquare size={14} /> Consult AI Stylist
            </Link>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Controls Sidebar */}
        <aside className="builder-controls" style={{ background: 'var(--color-surface-low, #141416)', border: '1px solid var(--color-outline-muted)', padding: '2rem', borderRadius: '4px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-champagne, #C2A878)' }} />
            <p className="eyebrow" style={{ margin: 0 }}>PARAMETERS</p>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.4rem', fontWeight: 400, margin: '0 0 1.5rem 0' }}>
            Composition Controls
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                Occasion Context
              </span>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                style={{ width: '100%', padding: '0.85rem', background: 'var(--color-surface-high, #1a1a1e)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '2px', fontFamily: 'inherit', fontSize: '0.9rem' }}
              >
                <option value="Minimal evening">Minimal Evening</option>
                <option value="Gallery opening">Gallery Opening</option>
                <option value="Global travel">Global Travel</option>
                <option value="Executive summit">Executive Summit</option>
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                Aesthetic Direction
              </span>
              <select
                value={aesthetic}
                onChange={(e) => setAesthetic(e.target.value)}
                style={{ width: '100%', padding: '0.85rem', background: 'var(--color-surface-high, #1a1a1e)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '2px', fontFamily: 'inherit', fontSize: '0.9rem' }}
              >
                <option value="Structured">Structured Architecture</option>
                <option value="Fluid ease">Fluid Ease</option>
                <option value="Avant-garde edge">Avant-Garde Edge</option>
                <option value="Monochrome">Monochrome Edit</option>
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                <span>Investment Cap</span>
                <span style={{ color: 'var(--color-champagne, #C2A878)' }}>${Math.round((investment / 100) * 3000).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={investment}
                onChange={(e) => setInvestment(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--color-champagne, #C2A878)' }}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                Anchor Piece
              </span>
              <select
                value={anchorSlug}
                onChange={(e) => setAnchorSlug(e.target.value)}
                style={{ width: '100%', padding: '0.85rem', background: 'var(--color-surface-high, #1a1a1e)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '2px', fontFamily: 'inherit', fontSize: '0.9rem' }}
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: '0.85rem', marginTop: '2.5rem' }}>
            <button
              className="button button--primary"
              onClick={handleAddLookToBag}
              type="button"
              style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
            >
              <ShoppingBag size={16} /> Add Full Look (${totalLookValue.toLocaleString()})
            </button>
            
            <button
              className="button button--secondary"
              onClick={handleSaveToWardrobe}
              type="button"
              style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
            >
              {savedToWardrobe ? <CheckCircle2 size={16} style={{ color: '#4caf50' }} /> : <Sparkles size={16} />}
              {savedToWardrobe ? 'Saved to Wardrobe' : 'Save Look to Wardrobe'}
            </button>
          </div>
        </aside>

        {/* Canvas & Interactive Look Display */}
        <section className="look-canvas-section" style={{ display: 'grid', gap: '2.5rem' }}>
          <div className="look-canvas__heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: '0 0 0.25rem 0' }}>
                CURATED COMPOSITION / {compositionPieces.length} PIECES
              </p>
              <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2rem', fontWeight: 400, margin: 0 }}>
                {occasion} — {aesthetic}
              </h2>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--color-champagne, #C2A878)' }}>
              Total Value: ${totalLookValue.toLocaleString()}
            </span>
          </div>

          {/* Look Pieces Grid */}
          <div className="look-grid-refined" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {compositionPieces.map((prod, index) => (
              <div
                key={prod.slug}
                className="look-piece-card"
                style={{
                  background: 'var(--color-surface-low, #141416)',
                  border: index === 0 ? '1px solid var(--color-champagne, #C2A878)' : '1px solid var(--color-outline-muted)',
                  borderRadius: '4px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '120%', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem', background: '#1a1a1e' }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <RemoteImage assetId={prod.imageIds[0]} alt={prod.name} />
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: index === 0 ? 'var(--color-champagne, #C2A878)' : 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                    {index === 0 ? 'Anchor Silhouette' : `Complementary ${prod.category}`}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.15rem', fontWeight: 400, margin: '0.25rem 0 0.5rem 0' }}>
                    <Link to={`/product/${prod.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {prod.name}
                    </Link>
                  </h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', margin: 0, color: 'var(--color-text-muted)' }}>
                    {prod.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Embedded AI Composer Assistant Panel */}
          <div style={{ marginTop: '1rem' }}>
            <AiChatPanel builder />
          </div>
        </section>
      </div>
    </div>
  );
}