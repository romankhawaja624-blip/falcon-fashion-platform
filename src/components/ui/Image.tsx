import React from 'react';
import { imageRegistry, ImageAsset } from '../../data/imageRegistry';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageKey?: string;
  fallbackKey?: string;
}

export const Image: React.FC<ImageProps> = ({
  imageKey,
  fallbackKey = 'placeholder',
  src,
  alt,
  className = '',
  ...props
}) => {
  let resolvedSrc = src;
  let resolvedAlt = alt;

  if (imageKey && imageRegistry[imageKey]) {
    const asset: ImageAsset = imageRegistry[imageKey];
    resolvedSrc = asset.src;
    resolvedAlt = alt || asset.alt;
  } else if (!resolvedSrc && fallbackKey && imageRegistry[fallbackKey]) {
    const asset: ImageAsset = imageRegistry[fallbackKey];
    resolvedSrc = asset.src;
    resolvedAlt = alt || asset.alt;
  }

  return (
    <img
      src={resolvedSrc || 'https://picsum.photos/seed/placeholder/800/600'}
      alt={resolvedAlt || 'Falcon Atelier'}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (fallbackKey && imageRegistry[fallbackKey] && e.currentTarget.src !== imageRegistry[fallbackKey].src) {
          e.currentTarget.src = imageRegistry[fallbackKey].src;
        }
      }}
      {...props}
    />
  );
};
