// FALCON Inventory Service — PostgreSQL-backed, admin-only mutation
// Stock can never go negative (CHECK constraint in schema)

import { query } from '../db/pool';

export interface InventoryItem {
  productId: string;
  slug: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

/** Get stock for a single product by slug */
export async function getStockBySlug(slug: string): Promise<InventoryItem | null> {
  const res = await query<{
    product_id: string; slug: string; stock_quantity: number; low_stock_threshold: number;
  }>('SELECT * FROM inventory WHERE slug = $1', [slug]);

  if (res.rowCount === 0) return null;
  const r = res.rows[0];
  return {
    productId: r.product_id, slug: r.slug,
    stockQuantity: r.stock_quantity, lowStockThreshold: r.low_stock_threshold,
    isLowStock: r.stock_quantity > 0 && r.stock_quantity <= r.low_stock_threshold,
    isOutOfStock: r.stock_quantity === 0,
  };
}

/** Get full inventory list */
export async function getAllInventory(): Promise<InventoryItem[]> {
  const res = await query<{
    product_id: string; slug: string; stock_quantity: number; low_stock_threshold: number;
  }>('SELECT * FROM inventory ORDER BY slug');
  return res.rows.map(r => ({
    productId: r.product_id, slug: r.slug,
    stockQuantity: r.stock_quantity, lowStockThreshold: r.low_stock_threshold,
    isLowStock: r.stock_quantity > 0 && r.stock_quantity <= r.low_stock_threshold,
    isOutOfStock: r.stock_quantity === 0,
  }));
}

/** Admin-only: update stock quantity */
export async function updateStock(slug: string, newQuantity: number): Promise<InventoryItem> {
  if (newQuantity < 0) {
    const err: any = new Error('Stock quantity cannot be negative.');
    err.statusCode = 400; err.code = 'INVALID_REQUEST';
    throw err;
  }

  const res = await query<{
    product_id: string; slug: string; stock_quantity: number; low_stock_threshold: number;
  }>(
    'UPDATE inventory SET stock_quantity = $1 WHERE slug = $2 RETURNING *',
    [newQuantity, slug]
  );

  if (res.rowCount === 0) {
    const err: any = new Error(`Product "${slug}" not found in inventory.`);
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  const r = res.rows[0];
  return {
    productId: r.product_id, slug: r.slug,
    stockQuantity: r.stock_quantity, lowStockThreshold: r.low_stock_threshold,
    isLowStock: r.stock_quantity > 0 && r.stock_quantity <= r.low_stock_threshold,
    isOutOfStock: r.stock_quantity === 0,
  };
}
