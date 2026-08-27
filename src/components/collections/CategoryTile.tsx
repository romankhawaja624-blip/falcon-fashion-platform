import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryNode } from '../../data/collections';
import { Image } from '../ui/Image';

interface CategoryTileProps {
  category: CategoryNode;
  audience: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, audience }) => {
  const targetUrl = `/collections/${audience}/${category.id}`;

  return (
    <div className="category-tile" style={{
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'var(--color-surface, #141416)',
      border: '1px solid var(--color-outline-muted, rgba(255,255,255,0.08))',
      transition: 'transform 0.3s ease, border-color 0.3s ease',
    }}>
      <Link to={targetUrl} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="category-tile__image-wrapper" style={{
          position: 'relative',
          width: '100%',
          paddingTop: '125%', // 4:5 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#1a1a1e',
        }}>
          <Image
            imageKey={category.imageKey}
            alt={category.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }} />
        </div>
        <div className="category-tile__content" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.25rem',
          color: '#fff',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading, "Bodoni Moda", serif)',
            fontSize: '1.25rem',
            margin: '0 0 0.25rem 0',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            {category.name}
          </h3>
          {category.children && category.children.length > 0 && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted, rgba(255,255,255,0.6))',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {category.children.length} Subcategories
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};
