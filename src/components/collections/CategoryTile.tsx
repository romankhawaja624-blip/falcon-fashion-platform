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
    <div className="category-tile">
      <Link to={targetUrl} className="category-tile__link">
        <div className="category-tile__image-wrapper">
          <Image
            imageKey={category.imageKey}
            alt={category.name}
            className="category-tile__image"
          />
          <div className="category-tile__overlay" aria-hidden="true" />
        </div>
        <div className="category-tile__content">
          <h3 className="category-tile__title">
            {category.name}
          </h3>
          {category.children && category.children.length > 0 && (
            <p className="category-tile__count">
              {category.children.length} Subcategories
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};
