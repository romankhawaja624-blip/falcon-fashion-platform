// src/data/collections.ts

export interface CategoryNode {
  id: string; // unique slug
  name: string;
  imageKey?: string; // key in imageRegistry
  children?: CategoryNode[];
}

export const categoryTree: CategoryNode[] = [
  {
    id: 'shirts',
    name: 'Shirts',
    imageKey: 'shirtsCategory',
    children: [
      { id: 'casual-shirts', name: 'Casual Shirts', imageKey: 'shirtsCategory' },
      { id: 'formal-shirts', name: 'Formal Shirts', imageKey: 'shirtsCategory' },
    ],
  },
  {
    id: 'tshirts',
    name: 'T-Shirts',
    imageKey: 'shirtsCategory',
    children: [
      { id: 'crew-neck', name: 'Crew Neck', imageKey: 'shirtsCategory' },
      { id: 'polo', name: 'Polo', imageKey: 'shirtsCategory' },
    ],
  },
  {
    id: 'jeans',
    name: 'Jeans',
    imageKey: 'jeansCategory',
    children: [
      { id: 'slim-fit', name: 'Slim Fit', imageKey: 'jeansCategory' },
      { id: 'straight-fit', name: 'Straight Fit', imageKey: 'jeansCategory' },
    ],
  },
  {
    id: 'trousers',
    name: 'Trousers',
    imageKey: 'trousersCategory',
    children: [
      { id: 'chinos', name: 'Chinos', imageKey: 'trousersCategory' },
      { id: 'tailored-trousers', name: 'Tailored Trousers', imageKey: 'trousersCategory' },
    ],
  },
  {
    id: 'suits',
    name: 'Suits',
    imageKey: 'suitsCategory',
    children: [
      { id: 'tuxedos', name: 'Tuxedos', imageKey: 'suitsCategory' },
      { id: 'business-suits', name: 'Business Suits', imageKey: 'suitsCategory' },
    ],
  },
  {
    id: 'shalwar-kameez',
    name: 'Shalwar Kameez',
    imageKey: 'shalwarKameezCategory',
    children: [
      { id: 'classic-edition', name: 'Classic Edition', imageKey: 'shalwarKameezCategory' },
      { id: 'designer-edition', name: 'Designer Edition', imageKey: 'shalwarKameezCategory' },
    ],
  },
];

export const audienceCollections: Record<string, CategoryNode[]> = {
  men: categoryTree,
  women: categoryTree,
  kids: categoryTree,
  youngAdults: categoryTree,
  adults: categoryTree,
};
