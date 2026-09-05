import React from 'react';

interface CollectionGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  children,
}) => {
  return (
    <div className="collection-grid">
      {children}
    </div>
  );
};
