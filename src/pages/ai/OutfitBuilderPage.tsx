import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiChatPanel } from '../../components/ai/AiChatPanel';
import { products } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { useCart } from '../../features/cart/CartContext';

// Simple mappings for demo purposes
const occasionMap: Record<string, string> = {
  'Minimal evening': 'Eveningwear',
  'Gallery opening': 'Outerwear',
  'Travel': 'Outerwear',
};
const aestheticMap: Record<string, string> = {
  'Structured': 'Tailoring',
  'Fluid': 'Knitwear',
  'Avant-garde': 'Accessories',
};

export function OutfitBuilderPage() {
  // UI controls state
  const [occasion, setOccasion] = useState('Minimal evening');
  const [aesthetic, setAesthetic] = useState('Structured');
  const [investment, setInvestment] = useState(85); // 0-100 slider
  const [anchorSlug, setAnchorSlug] = useState<string>('');

  const { addItem } = useCart();

  // Determine filtered products based on simple deterministic logic
  const filteredProducts = useMemo(() => {
    // Base filter by category derived from occasion and aesthetic
    const categoryFromOccasion = occasionMap[occasion];
    const categoryFromAesthetic = aestheticMap[aesthetic];
    // Simple scoring: product matches either category and price within investment range
    const maxPrice = Math.round((investment / 100) * 3000); // assume max 3000
    return products.filter((p) => {
      const matchCategory = p.category === categoryFromOccasion || p.category === categoryFromAesthetic;
      const matchPrice = p.priceValue <= maxPrice;
      const matchAnchor = anchorSlug ? p.slug === anchorSlug : true;
      return matchCategory && matchPrice && matchAnchor;
    });
  }, [occasion, aesthetic, investment, anchorSlug]);

  // Anchor piece selection UI – list of product names
  const anchorOptions = useMemo(() => {
    return products.map((p) => ({ label: p.name, value: p.slug }));
  }, []);

  // Add full look to cart – add each filtered product with default size (first size)
  const handleAddLook = () => {
    filteredProducts.forEach((p) => {
      const size = p.sizes[0] ?? 'One Size';
      addItem(p, size);
    });
  };

  // Render composition pieces – limit to first 3 for UI simplicity
  const displayPieces = filteredProducts.slice(0, 3);

  return (
    <div className="builder-page">
      <aside className="builder-controls">
        <p className="eyebrow">Falcon Studio</p>
        <h1>Outfit builder</h1>
        <p>Shape the parameters, then let Falcon compose the look.</p>
        <label>
          Occasion
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            <option>Minimal evening</option>
            <option>Gallery opening</option>
            <option>Travel</option>
          </select>
        </label>
        <label>
          Aesthetic
          <select value={aesthetic} onChange={(e) => setAesthetic(e.target.value)}>
            <option>Structured</option>
            <option>Fluid</option>
            <option>Avant-garde</option>
          </select>
        </label>
        <label>
          Investment level
          <input
            type="range"
            min={0}
            max={100}
            value={investment}
            onChange={(e) => setInvestment(parseInt(e.target.value, 10))}
          />
          <output>{investment}</output>
        </label>
        <label>
          Anchor piece
          <select value={anchorSlug} onChange={(e) => setAnchorSlug(e.target.value)}>
            <option value="">-- none --</option>
            {anchorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button className="button button--primary" onClick={handleAddLook} type="button">
          Add full look to bag
        </button>
        <Link className="button button--secondary" to="/stylist/look/obsidian-evening">
          Save to wardrobe
        </Link>
      </aside>
      <section className="look-canvas">
        <div className="look-canvas__heading">
          <p className="eyebrow">Generated composition / {filteredProducts.length}</p>
          <h2>{occasion} – {aesthetic}</h2>
        </div>
        <div className="look-grid">
          {displayPieces.map((p) => (
            <div key={p.slug} className="look-piece">
              <RemoteImage assetId={p.imageIds[0]} />
              <span>{p.category === 'Outerwear' ? 'Anchor piece' : 'Piece'}</span>
              <strong>{p.name}</strong>
            </div>
          ))}
          {displayPieces.length === 0 && (
            <p className="empty-state">No items match the selected criteria.</p>
          )}
        </div>
        <AiChatPanel builder />
      </section>
    </div>
  );
}