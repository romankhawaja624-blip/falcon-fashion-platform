import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { wardrobeItems } from '../../data/atelier';
import { products, type Product } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';

export function WardrobePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeWardrobeItem, setActiveWardrobeItem] = useState(wardrobeItems[0]);

  const { addItem } = useCart();
  const { showToast } = useToast();

  const filteredWardrobe = wardrobeItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Coats & jackets') return item.category.includes('Outerwear') || item.category.includes('Coats');
    if (selectedCategory === 'Eveningwear') return item.category.includes('Eveningwear');
    if (selectedCategory === 'Accessories') return item.category.includes('Accessories');
    return true;
  });

  // Determine catalog suggestions based on active wardrobe item
  const suggestedPairings: Product[] = products
    .filter((p) => p.category !== activeWardrobeItem.category)
    .slice(0, 3);

  const handleAddPairingToBag = (product: Product) => {
    const size = product.sizes[0] ?? 'One Size';
    addItem(product, size);
    showToast(`Added ${product.name} (Size ${size}) to your bag`, 'success');
  };

  return (
    <div className="atelier-page wardrobe-page">
      <header className="atelier-page-heading">
        <div>
          <p className="eyebrow">Digital collection</p>
          <h1>My wardrobe</h1>
          <p>Your digital collection, curated and ready for AI styling.</p>
        </div>
        <Link className="button button--primary" to="/stylist">
          Style these together
        </Link>
      </header>

      <div className="wardrobe-filters" role="group" aria-label="Wardrobe categories">
        {['All', 'Coats & jackets', 'Eveningwear', 'Accessories'].map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
            type="button"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'All' ? 'All items' : cat}
          </button>
        ))}
      </div>

      <section className="wardrobe-layout">
        <div className="wardrobe-grid">
          {filteredWardrobe.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveWardrobeItem(item)}
              style={{
                cursor: 'pointer',
                outline: activeWardrobeItem.name === item.name ? '2px solid var(--color-champagne)' : 'none',
                borderRadius: 'var(--radius-control)',
              }}
            >
              <WardrobeCard {...item} />
            </div>
          ))}
          <button className="wardrobe-add" type="button">
            <span>+</span>
            <strong>Add item</strong>
          </button>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <AiEntryCard />

          {/* Interactive Outfit Matcher Section */}
          <article
            className="admin-panel"
            style={{ background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={18} color="var(--color-champagne)" aria-hidden="true" />
              <p className="eyebrow" style={{ margin: 0 }}>Outfit Matcher</p>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, margin: '0 0 8px' }}>
              Pairing with {activeWardrobeItem.name}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: '20px', margin: '0 0 20px' }}>
              Suggested catalog additions to complement your digital piece.
            </p>

            {suggestedPairings.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {suggestedPairings.map((prod) => (
                  <div
                    key={prod.slug}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-outline-muted)',
                      paddingTop: '12px',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', fontWeight: 400 }}>{prod.name}</strong>
                      <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                        {prod.category} — {prod.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => handleAddPairingToBag(prod)}
                      style={{ fontSize: '10px', minHeight: '32px', padding: '6px 12px' }}
                    >
                      <ShoppingBag size={12} style={{ marginRight: '4px' }} aria-hidden="true" />
                      Add pairing
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No suggestions available at this time.</p>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}