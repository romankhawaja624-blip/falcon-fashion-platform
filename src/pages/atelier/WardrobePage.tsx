import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Plus, Shirt, Check } from 'lucide-react';
import { AiEntryCard } from '../../components/ai/AiEntryCard';
import { WardrobeCard } from '../../components/atelier/WardrobeCard';
import { wardrobeItems as initialWardrobeItems } from '../../data/atelier';
import { products, type Product } from '../../data/products';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { Button } from '../../components/ui/Button';

interface CustomWardrobeItem {
  name: string;
  category: string;
  imageId: string;
}

export function WardrobePage() {
  const [items, setItems] = useState<CustomWardrobeItem[]>(() => {
    try {
      const saved = localStorage.getItem('falcon_wardrobe');
      return saved ? JSON.parse(saved) : initialWardrobeItems;
    } catch {
      return initialWardrobeItems;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState<CustomWardrobeItem>(items[0] || initialWardrobeItems[0]);

  // Modal State for Adding Custom Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Coats & jackets');

  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('falcon_wardrobe', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wardrobe to localStorage', e);
    }
  }, [items]);

  const filteredWardrobe = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Coats & jackets') return item.category.includes('Outerwear') || item.category.includes('Coats') || item.category.includes('jackets');
    if (selectedCategory === 'Eveningwear') return item.category.includes('Eveningwear');
    if (selectedCategory === 'Tailoring') return item.category.includes('Tailoring') || item.category.includes('Blazer') || item.category.includes('Suits');
    if (selectedCategory === 'Accessories') return item.category.includes('Accessories');
    return true;
  });

  // Dynamic catalog pairings matching the active item
  const suggestedPairings: Product[] = products
    .filter((p) => p.category.toLowerCase() !== activeItem?.category.toLowerCase())
    .slice(0, 3);

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: CustomWardrobeItem = {
      name: newItemName.trim(),
      category: newItemCategory,
      imageId: 'obsidian-wool-coat-main',
    };

    setItems((prev) => [newItem, ...prev]);
    setActiveItem(newItem);
    setNewItemName('');
    setShowAddModal(false);
    showToast(`"${newItem.name}" added to your digital wardrobe`, 'success');
  };

  const handleAddPairingToBag = (product: Product) => {
    const size = product.sizes[0] ?? 'One Size';
    addItem(product, size);
    showToast(`Added ${product.name} (Size ${size}) to your bag`, 'success');
  };

  return (
    <div className="atelier-page wardrobe-page" style={{ paddingBottom: '4rem' }}>
      <header className="atelier-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Digital Collection
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: '0.25rem 0' }}>
            My Wardrobe & Matcher
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '560px' }}>
            Your cataloged digital garments, ready for intelligent AI pairing and outfit composition.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => setShowAddModal(true)} variant="secondary" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <Plus size={16} /> Add Custom Item
          </Button>
          <Link className="button button--primary" to="/stylist">
            Style Items Together &rarr;
          </Link>
        </div>
      </header>

      {/* Category Chips */}
      <div className="wardrobe-filters" role="group" aria-label="Wardrobe categories" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {['All', 'Coats & jackets', 'Eveningwear', 'Tailoring', 'Accessories'].map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid var(--color-outline-muted)',
              background: selectedCategory === cat ? 'var(--color-text, #fff)' : 'transparent',
              color: selectedCategory === cat ? 'var(--color-background, #000)' : 'var(--color-text, #fff)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat === 'All' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <section className="wardrobe-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Left Column: Grid */}
        <div>
          <div className="wardrobe-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filteredWardrobe.map((item) => (
              <div
                key={item.name}
                onClick={() => setActiveItem(item)}
                style={{
                  cursor: 'pointer',
                  border: activeItem?.name === item.name ? '2px solid var(--color-champagne)' : '1px solid var(--color-outline-muted)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  background: 'var(--color-surface, #141416)',
                }}
              >
                <WardrobeCard {...item} />
              </div>
            ))}

            <button
              className="wardrobe-add"
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '220px',
                border: '1px dashed var(--color-outline-muted)',
                borderRadius: '8px',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Plus size={24} style={{ marginBottom: '8px' }} />
              <strong>Add New Item</strong>
            </button>
          </div>

          {filteredWardrobe.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--color-outline-muted)', borderRadius: '8px' }}>
              <Shirt size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem' }}>
                No items in this category
              </h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Add pieces to your digital collection to begin styling.</p>
            </div>
          )}
        </div>

        {/* Right Column: Matcher & AI Entry */}
        <div style={{ display: 'grid', gap: '1.5rem', height: 'fit-content' }}>
          <AiEntryCard />

          {/* Interactive Outfit Matcher Section */}
          <article
            className="admin-panel"
            style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', padding: '1.5rem', borderRadius: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <Sparkles size={18} style={{ color: 'var(--color-champagne)' }} aria-hidden="true" />
              <p className="eyebrow" style={{ margin: 0, color: 'var(--color-champagne)' }}>Outfit Matcher</p>
            </div>

            {activeItem && (
              <>
                <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.35rem', fontWeight: 400, margin: '0 0 0.25rem 0' }}>
                  Pairings for {activeItem.name}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  Curated catalog recommendations that elevate this piece.
                </p>

                {suggestedPairings.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {suggestedPairings.map((prod) => (
                      <div
                        key={prod.slug}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--color-outline-muted)',
                          paddingTop: '0.85rem',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500 }}>{prod.name}</strong>
                          <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                            {prod.category} — {prod.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="button button--secondary"
                          onClick={() => handleAddPairingToBag(prod)}
                          style={{ fontSize: '0.75rem', minHeight: '32px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ShoppingBag size={12} aria-hidden="true" />
                          Add Pairing
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No pairing suggestions available.</p>
                )}
              </>
            )}
          </article>
        </div>
      </section>

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--color-surface, #141416)',
            border: '1px solid var(--color-outline-muted)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
          }}>
            <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Add to Digital Wardrobe
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Catalog a custom garment into your digital wardrobe for Falcon AI clienteling.
            </p>

            <form onSubmit={handleAddCustomItem} style={{ display: 'grid', gap: '1.25rem' }}>
              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Garment Name
                </span>
                <input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Vintage Cashmere Trench"
                  required
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Category
                </span>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', color: '#fff', borderRadius: '4px' }}
                >
                  <option value="Coats & jackets">Coats & Jackets</option>
                  <option value="Eveningwear">Eveningwear</option>
                  <option value="Tailoring">Tailoring & Suit</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>
                  Catalog Item
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}