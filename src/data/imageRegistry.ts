// src/data/imageRegistry.ts

export interface ImageAsset {
  src: string; // full URL
  alt: string;
  width?: number;
  height?: number;
}

// Use Picsum placeholder images keyed by logical name.
export const imageRegistry: Record<string, ImageAsset> = {
  // Home hero
  homeHero: {
    src: 'https://picsum.photos/seed/homeHero/1600/900',
    alt: 'Falcon home hero image',
  },
  // Collections
  womenCollection: {
    src: 'https://picsum.photos/seed/womenCollection/1200/600',
    alt: 'Women collection hero',
  },
  menCollection: {
    src: 'https://picsum.photos/seed/menCollection/1200/600',
    alt: 'Men collection hero',
  },
  kidsCollection: {
    src: 'https://picsum.photos/seed/kidsCollection/1200/600',
    alt: 'Kids collection hero',
  },
  youngAdultsCollection: {
    src: 'https://picsum.photos/seed/youngAdultsCollection/1200/600',
    alt: 'Young adults collection hero',
  },
  adultsCollection: {
    src: 'https://picsum.photos/seed/adultsCollection/1200/600',
    alt: 'Adults collection hero',
  },
  // Category examples
  shirtsCategory: {
    src: 'https://picsum.photos/seed/shirts/800/600',
    alt: 'Shirts category',
  },
  trousersCategory: {
    src: 'https://picsum.photos/seed/trousers/800/600',
    alt: 'Trousers category',
  },
  jeansCategory: {
    src: 'https://picsum.photos/seed/jeans/800/600',
    alt: 'Jeans category',
  },
  suitsCategory: {
    src: 'https://picsum.photos/seed/suits/800/600',
    alt: 'Suits category',
  },
  shalwarKameezCategory: {
    src: 'https://picsum.photos/seed/shalwarKameez/800/600',
    alt: 'Shalwar Kameez category',
  },
  // Fallback image
  placeholder: {
    src: 'https://picsum.photos/seed/placeholder/800/600',
    alt: 'Placeholder image',
  },
};
