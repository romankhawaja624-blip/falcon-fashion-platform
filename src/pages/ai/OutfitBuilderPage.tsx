import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiChatPanel } from '../../components/ai/AiChatPanel';
import { products, type Product } from '../../data/products';
import { Image } from '../../components/ui/Image';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { ShoppingBag, Sparkles, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';

const occasionMap: Record<string, string[]> = {
  'Minimal evening': ['Eveningwear', 'Outerwear', 'Tailoring'],
  'Gallery opening': ['Tailoring', 'Outerwear', 'Accessories'],
  'Global travel': ['Knitwear', 'Outerwear', 'Tailoring'],
  'Executive summit': ['Tailoring', 'Outerwear', 'Knitwear'],
};

const aestheticMap: Record<string, string[]> = {
  'Structured': ['Tailoring', 'Outerwear'],
  'Fluid ease': ['Eveningwear', 'Knitwear'],
  'Avant-garde edge': ['Outerwear', 'Accessories'],
  'Monochrome': ['Tailoring', 'Eveningwear'],
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
    <div className="builder-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Falcon Studio
            </p>
            <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
              Outfit Studio & Composition Builder
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link className="button button--secondary" to="/stylist" style={{ fontSize: '0.85rem' }}>
              Consult AI Stylist &rarr;
            </Link>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
        {/* Controls Sidebar */}
        <aside className="builder-controls" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.75rem', borderRadius: '8px', height: 'fit-content' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.35rem', marginBottom: '1.25rem' }}>
            Composition Controls
          </h2>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Occasion Context
              </span>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
              >
                <option value="Minimal evening">Minimal Evening</option>
                <option value="Gallery opening">Gallery Opening</option>
                <option value="Global travel">Global Travel</option>
                <option value="Executive summit">Executive Summit</option>
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Aesthetic Direction
              </span>
              <select
                value={aesthetic}
                onChange={(e) => setAesthetic(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
              >
                <option value="Structured">Structured Architecture</option>
                <option value="Fluid ease">Fluid Ease</option>
                <option value="Avant-garde edge">Avant-Garde Edge</option>
                <option value="Monochrome">Monochrome</option>
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                <span>Investment Cap</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-champagne)' }}>${Math.round((investment / 100) * 3000).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={investment}
                onChange={(e) => setInvestment(parseInt(e.target.value, 10))}
                style={{ width: '100%' }}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Anchor Piece
              </span>
              <select
                value={anchorSlug}
                onChange={(e) => setAnchorSlug(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '2rem' }}>
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
        <section className="look-canvas" style={{ display: 'grid', gap: '2rem' }}>
          <div className="look-canvas__heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem' }}>
            <div>
              <p className="eyebrow" style={{ color: 'var(--color-champagne)', textTransform: 'uppercase' }}>
                Curated Composition / {compositionPieces.length} Pieces
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: 0 }}>
                {occasion} — {aesthetic}
              </h2>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Total: ${totalLookValue.toLocaleString()}
            </span>
          </div>

          {/* Look Pieces Grid */}
          <div className="look-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {compositionPieces.map((prod, index) => (
              <div
                key={prod.slug}
                className="look-piece"
                style={{
                  background: 'var(--color-surface, #141416)',
                  border: '1px solid var(--color-outline-muted)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '120%', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem', background: '#1a1a1e' }}>
                  <Image imageKey={prod.category.toLowerCase() + 'Category'} alt={prod.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: index === 0 ? 'var(--color-champagne)' : 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {index === 0 ? 'Anchor Piece' : `Complementary ${prod.category}`}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.1rem', margin: '0.25rem 0 0.5rem 0' }}>
                    <Link to={`/product/${prod.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {prod.name}
                    </Link>
                  </h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', margin: 0 }}>
                    {prod.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Composer Assistant Panel */}
          <div style={{ marginTop: '1rem' }}>
            <AiChatPanel builder />
          </div>
        </section>
      </div>
    </div>
  );
}