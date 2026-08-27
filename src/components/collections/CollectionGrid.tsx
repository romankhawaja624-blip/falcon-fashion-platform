import React from 'react';

interface CollectionGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  children,
  gap = '1.5rem',
}) => {
  return (
    <div
      className="collection-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: gap,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};
