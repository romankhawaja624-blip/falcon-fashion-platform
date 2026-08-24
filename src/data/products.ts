export type Product = {
  slug: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  description: string;
  imageIds: string[];
  sizes: string[];
  tags: string[];
};

export const products: Product[] = [
  {
    slug: 'obsidian-wool-coat',
    name: 'The Obsidian Wool Coat',
    category: 'Outerwear',
    price: '$1,480',
    priceValue: 1480,
    description: 'A sculptural wool coat with a precise architectural silhouette and a quiet, cinematic finish.',
    imageIds: ['obsidian-wool-coat-main', 'obsidian-wool-coat-collar', 'obsidian-wool-coat-back'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['New arrival', 'Wool'],
  },
  {
    slug: 'obsidian-silk-gown',
    name: 'The Obsidian Silk Gown',
    category: 'Eveningwear',
    price: '$2,240',
    priceValue: 2240,
    description: 'Fluid black silk shaped into an expressive evening silhouette with an effortless drape.',
    imageIds: ['obsidian-silk-gown-main'],
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['Evening', 'Silk'],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? products[0];
}