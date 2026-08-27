// FALCON Catalog & Inventory Backend Service
import { db } from '../database/db';
import type { Product } from '../../data/products';

export function getAllProducts(): Product[] {
  return Array.from(db.products.values());
}

export function getProductBySlug(slug: string): Product | null {
  return db.products.get(slug) ?? null;
}

export function getProductStock(slug: string): number {
  const inv = db.inventory.get(slug);
  if (inv) return inv.stockQuantity;
  return 10;
}

export function updateInventoryStock(slug: string, newStockQuantity: number): { slug: string; stockQuantity: number; status: string } {
  const quantity = Math.max(0, newStockQuantity);
  const inv = db.inventory.get(slug);
  if (inv) {
    inv.stockQuantity = quantity;
    inv.updatedAt = new Date().toISOString();
  } else {
    db.inventory.set(slug, {
      productId: slug,
      slug,
      stockQuantity: quantity,
      lowStockThreshold: 10,
      updatedAt: new Date().toISOString(),
    });
  }

  const status = quantity === 0 ? 'Out of stock' : quantity <= 10 ? 'Low stock' : 'Healthy';
  return { slug, stockQuantity: quantity, status };
}
