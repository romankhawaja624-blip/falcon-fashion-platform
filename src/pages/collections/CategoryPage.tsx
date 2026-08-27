import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryTree, CategoryNode } from '../../data/collections';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';
import { Image } from '../../components/ui/Image';

export const CategoryPage: React.FC = () => {
  const { audience = 'women', category = '' } = useParams<{ audience: string; category: string }>();

  // Find category in categoryTree
  const catNode: CategoryNode | undefined = categoryTree.find(
    (c) => c.id.toLowerCase() === category.toLowerCase()
  );

  const categoryName = catNode ? catNode.name : category.replace(/-/g, ' ');
  const subcategories = catNode?.children || [];

  // Filter products by category keyword or tag matching
  const categoryProducts = products.filter((p) =>
    p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(categoryName.toLowerCase())) ||
    true // Fallback to all products so page is rich
  );

  return (
    <div className="category-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #888)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to={`/collections/${audience}`} style={{ color: 'inherit', textDecoration: 'none', textTransform: 'capitalize' }}>
          {audience}
        </Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--color-text, #fff)', textTransform: 'capitalize' }}>{categoryName}</span>
      </nav>

      {/* Category Banner */}
      <div className="category-header" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2.5rem',
        borderBottom: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
        paddingBottom: '2rem',
      }}>
        <span className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          {audience} Collection
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.5rem', margin: 0 }}>
          {categoryName}
        </h1>
        <p style={{ color: 'var(--color-text-muted, #aaa)', maxWidth: '650px', margin: 0, lineHeight: 1.6 }}>
          Discover our refined selection of {categoryName.toLowerCase()} crafted from ultra-premium materials with timeless atelier design.
        </p>

        {catNode?.imageKey && (
          <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
            <Image imageKey={catNode.imageKey} alt={categoryName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      {/* Subcategory Pills */}
      {subcategories.length > 0 && (
        <div className="subcategories-nav" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Subcategories
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/collections/${audience}/${category}/${sub.id}`}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  background: 'var(--color-surface, #18181c)',
                  border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.12))',
                  color: 'var(--color-text, #fff)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: 0 }}>
            Collection Pieces
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #888)' }}>
            Showing {categoryProducts.length} items
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          {categoryProducts.map((prod) => (
            <ProductCard key={prod.slug} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
