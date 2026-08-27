import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { getProduct, setProductStock, getProductStock } from '../../data/products';
import { imageRegistry } from '../../data/imageRegistry';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { ArrowLeft, Save, CheckCircle, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

export function AdminProductEditorPage() {
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isEditing = Boolean(editSlug);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Outerwear');
  const [audience, setAudience] = useState('Women');
  const [price, setPrice] = useState('1480');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('15');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [fit, setFit] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('obsidian-wool-coat-main');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editSlug) {
      const existing = getProduct(editSlug);
      if (existing) {
        setName(existing.name);
        setSlug(existing.slug);
        setCategory(existing.category);
        setPrice(existing.priceValue.toString());
        setDescription(existing.description);
        setMaterial(existing.material ?? '');
        setFit(existing.fit ?? '');
        if (existing.imageIds[0]) setSelectedImageId(existing.imageIds[0]);
        if (existing.sizes) setSelectedSizes(existing.sizes);
        setStock(getProductStock(existing.slug).toString());
      }
    }
  }, [editSlug]);

  const availableImageKeys = Object.keys(imageRegistry);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!price || isNaN(Number(price))) {
      setFormError('Valid price is required.');
      return;
    }
    if (!stock || isNaN(Number(stock))) {
      setFormError('Valid stock count is required.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      setProductStock(slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), parseInt(stock, 10));
      showToast(isEditing ? `Product "${name}" updated successfully` : `Product "${name}" created successfully`, 'success');
    }, 600);
  };

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Catalog / {isEditing ? 'Edit Piece' : 'New Product'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            {isEditing ? `Edit: ${name || editSlug}` : 'Add a New Silhouette'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Configure basic details, pricing, inventory, and atelier imagery.
          </p>
        </div>
        <Link className="text-link" to="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back to catalog
        </Link>
      </header>

      {savedSuccess && (
        <div style={{ background: 'rgba(40,167,69,0.15)', border: '1px solid #28a745', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#28a745' }}>
            <CheckCircle size={20} />
            <div>
              <strong style={{ display: 'block' }}>Product Saved Successfully!</strong>
              <span style={{ fontSize: '0.85rem' }}>Stock updated and changes indexed in registry.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link className="button button--secondary" to="/admin/products" style={{ fontSize: '0.85rem' }}>
              View Catalog
            </Link>
            {slug && (
              <Link className="button button--primary" to={`/product/${slug}`} style={{ fontSize: '0.85rem' }}>
                View PDP
              </Link>
            )}
          </div>
        </div>
      )}

      {formError && (
        <div style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid #ff6b6b', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
        {/* Basic Information */}
        <fieldset style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
          <legend style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', padding: '0 0.5rem', color: 'var(--color-champagne)' }}>
            Basic Information
          </legend>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Product Name *</span>
              <input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEditing) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="The Obsidian Wool Coat..."
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Slug Identifier *</span>
              <input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="obsidian-wool-coat"
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Category *</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              >
                <option value="Outerwear">Outerwear</option>
                <option value="Tailoring">Tailoring</option>
                <option value="Eveningwear">Eveningwear</option>
                <option value="Knitwear">Knitwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Leather Goods">Leather Goods</option>
                <option value="Footwear">Footwear</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Target Audience *</span>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Kids">Kids</option>
                <option value="Young Adults">Young Adults</option>
                <option value="Adults">Adults</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Status *</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
            <span>Editorial Description</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the silhouette, material weight, drape, and feeling..."
              style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', resize: 'vertical' }}
            />
          </label>
        </fieldset>

        {/* Commerce & Pricing */}
        <fieldset style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
          <legend style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', padding: '0 0.5rem', color: 'var(--color-champagne)' }}>
            Commerce & Stock
          </legend>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Price (USD) *</span>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1480"
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Compare-at Price (USD)</span>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="1650"
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Initial Inventory Stock *</span>
              <input
                required
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="24"
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
              />
            </label>
          </div>
        </fieldset>

        {/* Product Attributes & Sizes */}
        <fieldset style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
          <legend style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', padding: '0 0.5rem', color: 'var(--color-champagne)' }}>
            Attributes & Sizing
          </legend>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Material Composition</span>
              <input
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="100% Virgin Wool (Biella, Italy)..."
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              <span>Fit & Silhouette Notes</span>
              <input
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="Slightly oversized architectural fit..."
                style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)' }}
              />
            </label>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Available Sizes</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((sz) => {
                const active = selectedSizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => handleSizeToggle(sz)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: `1px solid ${active ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                      background: active ? 'var(--color-champagne)' : 'var(--color-surface-low, #1c1c1f)',
                      color: active ? '#000' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </fieldset>

        {/* Image Registry Selector */}
        <fieldset style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <legend style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', padding: '0 0.5rem', color: 'var(--color-champagne)' }}>
            Centralized Imagery (Image Registry)
          </legend>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ border: '1px solid var(--color-outline-muted)', borderRadius: '6px', overflow: 'hidden', height: '240px', background: '#000' }}>
              <RemoteImage assetId={selectedImageId} alt="Selected preview" />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <label style={{ display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
                <span>Select Asset Key from Image Registry *</span>
                <select
                  value={selectedImageId}
                  onChange={(e) => setSelectedImageId(e.target.value)}
                  style={{ padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
                >
                  {availableImageKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Selected image key: <code style={{ color: 'var(--color-champagne)' }}>{selectedImageId}</code>
              </p>
            </div>
          </div>
        </fieldset>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </button>
          <Button type="submit" disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} />
            {isSubmitting ? 'Saving Piece...' : isEditing ? 'Update Product' : 'Save as Draft'}
          </Button>
        </div>
      </form>
    </div>
  );
}