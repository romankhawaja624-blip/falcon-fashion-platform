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
    <div className="audience-collection" style={{ paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <section className="audience-hero" style={{
        position: 'relative',
        height: '380px',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '3rem',
      }}>
        <Image
          imageKey={heroImageKey}
          alt={label}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <p className="eyebrow" style={{
            color: 'var(--color-champagne, #d4af37)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
          }}>
            FALCON ATELIER
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading, "Bodoni Moda", serif)',
            fontSize: 'calc(2rem + 1.5vw)',
            color: '#ffffff',
            margin: '0 0 1rem 0',
            fontWeight: 400,
          }}>
            {label}
          </h1>
          <p style={{
            maxWidth: '600px',
            margin: '0 auto',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}>
            Explore curations designed for effortless elegance, precision tailoring, and modern luxury.
          </p>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
          paddingBottom: '0.75rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Bodoni Moda", serif)',
            fontSize: '1.5rem',
            margin: 0,
          }}>
            Browse Categories
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #888)' }}>
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
      <section className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
          paddingBottom: '0.75rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Bodoni Moda", serif)',
            fontSize: '1.5rem',
            margin: 0,
          }}>
            Featured Silhouettes
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
