// FALCON Checkout Service — atomic PostgreSQL transaction
// Aligned with schema.sql column names:
//   orders: subtotal, shipping_cost, total, shipping_address_json, contact_email, contact_name
//   order_items: product_slug, product_name, category, image_id, size, quantity, price_value

import { withTransaction } from '../db/pool';
import { PoolClient } from 'pg';

export interface CartItem { slug: string; quantity: number; size?: string; }

export interface OrderResult {
  orderId: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  items: Array<{ slug: string; name: string; quantity: number; price: number; size: string }>;
}

export async function processCheckout(
  userId: string,
  userEmail: string,
  userName: string,
  items: CartItem[],
  shippingAddress: object
): Promise<OrderResult> {
  if (!items || items.length === 0) {
    const err: any = new Error('Cart is empty.');
    err.statusCode = 400; err.code = 'INVALID_REQUEST';
    throw err;
  }

  return withTransaction(async (client: PoolClient) => {
    // Sort items by slug deterministically to prevent PostgreSQL deadlocks during multi-product concurrent checkouts
    const sortedItems = [...items].sort((a, b) => a.slug.localeCompare(b.slug));
    const validated: Array<{
      slug: string; name: string; category: string; imageId: string;
      stock: number; price: number; qty: number; size: string;
    }> = [];

    for (const item of sortedItems) {
      if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        const err: any = new Error(`Invalid item quantity for "${item.slug}". Must be a positive integer.`);
        err.statusCode = 400; err.code = 'INVALID_QUANTITY';
        throw err;
      }
      const res = await client.query<{
        product_id: string; slug: string; name: string; category: string; image_id: string;
        stock_quantity: number; price_value: number; low_stock_threshold: number;
      }>(
        'SELECT product_id, slug, name, category, image_id, stock_quantity, price_value, low_stock_threshold FROM inventory WHERE slug = $1 FOR UPDATE',
        [item.slug]
      );
      if (res.rowCount === 0) {
        const err: any = new Error(`Product "${item.slug}" not found in catalog.`);
        err.statusCode = 400; err.code = 'PRODUCT_NOT_FOUND';
        throw err;
      }
      const row = res.rows[0];
      if (row.stock_quantity < item.quantity) {
        const err: any = new Error(
          `Insufficient stock for "${row.name || row.slug}". Requested: ${item.quantity}, Available: ${row.stock_quantity}.`
        );
        err.statusCode = 409; err.code = 'INSUFFICIENT_STOCK';
        throw err;
      }
      validated.push({
        slug: row.slug, name: row.name || row.slug, category: row.category || '',
        imageId: row.image_id || '', stock: row.stock_quantity,
        price: Number(row.price_value), qty: item.quantity, size: item.size || '',
      });
    }

    // --- 2. Compute server-authoritative totals (client prices ignored) ---
    const subtotal     = validated.reduce((sum, v) => sum + v.price * v.qty, 0);
    const shippingCost = 0; // Free shipping placeholder
    const total        = subtotal + shippingCost;
    const orderId      = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // --- 3. Create order record (aligned with schema columns) ---
    await client.query(
      `INSERT INTO orders (id, user_id, status, subtotal, shipping_cost, total, shipping_address_json, contact_email, contact_name)
       VALUES ($1, $2, 'placed', $3, $4, $5, $6, $7, $8)`,
      [orderId, userId, subtotal, shippingCost, total, JSON.stringify(shippingAddress), userEmail, userName]
    );

    // --- 4. Decrement stock + create order items ---
    for (const v of validated) {
      const updateRes = await client.query(
        'UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE slug = $2 AND stock_quantity >= $1',
        [v.qty, v.slug]
      );
      if ((updateRes.rowCount ?? 0) === 0) {
        const err: any = new Error(`Insufficient stock for "${v.name}".`);
        err.statusCode = 409; err.code = 'INSUFFICIENT_STOCK';
        throw err;
      }
      const itemId = `OI-${orderId}-${v.slug}`;
      await client.query(
        `INSERT INTO order_items (id, order_id, product_slug, product_name, category, image_id, size, quantity, price_value)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [itemId, orderId, v.slug, v.name, v.category, v.imageId, v.size, v.qty, v.price]
      );
    }

    const createdAt = new Date().toISOString();
    return {
      orderId, subtotal, shippingCost, total, currency: 'USD', status: 'placed', createdAt,
      items: validated.map(v => ({ slug: v.slug, name: v.name, quantity: v.qty, price: v.price, size: v.size })),
    };
  });
}
