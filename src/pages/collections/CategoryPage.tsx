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
  const matchingProducts = products.filter((p) =>
    p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(categoryName.toLowerCase()))
  );
  const categoryProducts = matchingProducts.length > 0 ? matchingProducts : products;

  return (
    <div className="category-page container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <Link to={`/collections/${audience}`} className="breadcrumbs__audience">
          {audience}
        </Link>
        <span className="breadcrumbs__sep" aria-hidden="true">/</span>
        <span className="breadcrumbs__current">{categoryName}</span>
      </nav>

      {/* Category Banner */}
      <header className="category-header">
        <span className="eyebrow">
          {audience} Collection
        </span>
        <h1 className="category-header__title">
          {categoryName}
        </h1>
        <p className="category-header__desc">
          Discover our refined selection of {categoryName.toLowerCase()} crafted from ultra-premium materials with timeless atelier design.
        </p>

        {catNode?.imageKey && (
          <div className="category-header__visual">
            <Image
              imageKey={catNode.imageKey}
              alt={`FALCON ${categoryName} Architectural Visual`}
              className="category-header__image"
            />
          </div>
        )}
      </header>

      {/* Subcategory Navigation Pills */}
      {subcategories.length > 0 && (
        <section className="subcategories-nav" aria-label="Subcategories">
          <h2 className="subcategories-nav__title">
            Subcategories
          </h2>
          <div className="subcategories-nav__pills">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/collections/${audience}/${category}/${sub.id}`}
                className="subcategory-pill"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product List */}
      <section className="category-products" aria-labelledby="category-pieces-heading">
        <div className="category-products__header">
          <h2 id="category-pieces-heading" className="category-products__title">
            Collection Pieces
          </h2>
          <span className="category-products__count">
            {categoryProducts.length} {categoryProducts.length === 1 ? 'piece' : 'pieces'} available
          </span>
        </div>

        <div className="product-grid">
          {categoryProducts.map((prod) => (
            <ProductCard key={prod.slug} product={prod} variant="editorial" />
          ))}
        </div>
      </section>
    </div>
  );
};
