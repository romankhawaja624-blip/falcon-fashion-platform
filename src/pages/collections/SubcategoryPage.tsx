import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryTree, CategoryNode } from '../../data/collections';
import { products } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';

export const SubcategoryPage: React.FC = () => {
  const { audience = 'women', category = '', subcategory = '' } = useParams<{
    audience: string;
    category: string;
    subcategory: string;
  }>();

  // Find category & subcategory node
  const catNode: CategoryNode | undefined = categoryTree.find(
    (c) => c.id.toLowerCase() === category.toLowerCase()
  );

  const subNode = catNode?.children?.find(
    (s) => s.id.toLowerCase() === subcategory.toLowerCase()
  );

  const categoryName = catNode ? catNode.name : category.replace(/-/g, ' ');
  const subcategoryName = subNode ? subNode.name : subcategory.replace(/-/g, ' ');

  const matchingProducts = products;

  return (
    <div className="subcategory-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #888)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to={`/collections/${audience}`} style={{ color: 'inherit', textDecoration: 'none', textTransform: 'capitalize' }}>
          {audience}
        </Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to={`/collections/${audience}/${category}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {categoryName}
        </Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--color-text, #fff)', textTransform: 'capitalize' }}>{subcategoryName}</span>
      </nav>

      {/* Header */}
      <div className="subcategory-header" style={{
        marginBottom: '2.5rem',
        borderBottom: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
        paddingBottom: '1.5rem',
      }}>
        <span className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          {audience} / {categoryName}
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.5rem 0 0 0' }}>
          {subcategoryName}
        </h1>
      </div>

      {/* Products Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: 0 }}>
            Curated Selection
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #888)' }}>
            {matchingProducts.length} items available
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          {matchingProducts.map((prod) => (
            <ProductCard key={prod.slug} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
