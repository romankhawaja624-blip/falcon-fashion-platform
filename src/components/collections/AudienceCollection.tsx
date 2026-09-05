import React from 'react';
import { Audience, audienceLabels } from '../../data/audience';
import { audienceCollections, CategoryNode } from '../../data/collections';
import { CollectionGrid } from './CollectionGrid';
import { CategoryTile } from './CategoryTile';
import { Image } from '../ui/Image';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

interface AudienceCollectionProps {
  audience: string;
}

export const AudienceCollection: React.FC<AudienceCollectionProps> = ({ audience }) => {
  const normalizedAudience = (audience as Audience) || 'women';
  const label = audienceLabels[normalizedAudience] || `${audience.charAt(0).toUpperCase() + audience.slice(1)} Collection`;
  const categories = audienceCollections[normalizedAudience] || audienceCollections.women || [];
  const heroImageKey = `${normalizedAudience}Collection`;

  // Display sample products for featured section
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="audience-collection">
      {/* Hero Editorial Banner */}
      <section className="audience-hero" aria-labelledby="audience-hero-heading">
        <div className="audience-hero__image-wrap">
          <Image
            imageKey={heroImageKey}
            alt={`FALCON ${label} Editorial Collection`}
            className="audience-hero__image"
          />
          <div className="audience-hero__scrim" aria-hidden="true" />
        </div>
        <div className="container audience-hero__content">
          <p className="eyebrow">FALCON ATELIER</p>
          <h1 id="audience-hero-heading" className="audience-hero__title">
            {label}
          </h1>
          <p className="audience-hero__subtitle">
            Explore curations designed for effortless elegance, precision tailoring, and modern luxury.
          </p>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container audience-section" aria-labelledby="browse-categories-heading">
        <div className="audience-section__header">
          <h2 id="browse-categories-heading" className="audience-section__title">
            Browse Categories
          </h2>
          <span className="audience-section__count">
            {categories.length} Categories
          </span>
        </div>

        <CollectionGrid>
          {categories.map((cat: CategoryNode) => (
            <CategoryTile key={cat.id} category={cat} audience={normalizedAudience} />
          ))}
        </CollectionGrid>
      </section>

      {/* Featured Pieces Section */}
      <section className="container audience-section audience-section--featured" aria-labelledby="featured-pieces-heading">
        <div className="audience-section__header">
          <h2 id="featured-pieces-heading" className="audience-section__title">
            Featured Silhouettes
          </h2>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} variant="editorial" />
          ))}
        </div>
      </section>
    </div>
  );
};
