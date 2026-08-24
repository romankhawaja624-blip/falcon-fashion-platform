import type { Product } from '../../data/products';

export function searchProducts(products: Product[], query: string, category = 'All') {
  const normalizedQuery = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    const searchable = `${product.name} ${product.category} ${product.description} ${product.tags.join(' ')}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}