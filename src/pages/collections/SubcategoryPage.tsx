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

  const subcategoryProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(subcategoryName.toLowerCase()) ||
      p.description.toLowerCase().includes(subcategoryName.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(subcategoryName.toLowerCase())) ||
      p.category.toLowerCase().includes(categoryName.toLowerCase())
  );
  const matchingProducts = subcategoryProducts.length > 0 ? subcategoryProducts : products;

  return (
    <div className="subcategory-page container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <Link to={`/collections/${audience}`} className="breadcrumbs__audience">
          {audience}
        </Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <Link to={`/collections/${audience}/${category}`}>
          {categoryName}
        </Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <span className="breadcrumbs__current">{subcategoryName}</span>
      </nav>

      {/* Header */}
      <header className="subcategory-header">
        <span className="eyebrow">
          {audience} / {categoryName}
        </span>
        <h1 className="subcategory-header__title">
          {subcategoryName}
        </h1>
      </header>

      {/* Products Grid */}
      <section className="category-products" aria-labelledby="curated-selection-heading">
        <div className="category-products__header">
          <h2 id="curated-selection-heading" className="category-products__title">
            Curated Selection
          </h2>
          <span className="category-products__count">
            {matchingProducts.length} {matchingProducts.length === 1 ? 'piece' : 'pieces'} available
          </span>
        </div>

        <div className="product-grid">
          {matchingProducts.map((prod) => (
            <ProductCard key={prod.slug} product={prod} variant="editorial" />
          ))}
        </div>
      </section>
    </div>
  );
};
