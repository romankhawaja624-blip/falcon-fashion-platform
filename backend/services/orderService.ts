// FALCON Order Service — PostgreSQL-backed order retrieval with ownership enforcement

import { query } from '../db/pool';

export interface OrderSummary {
  id: string;
  status: string;
  totalValue: number;
  totalCurrency: string;
  createdAt: string;
  itemCount: number;
}

export interface OrderDetail {
  id: string;
  userId: string;
  status: string;
  totalValue: number;
  totalCurrency: string;
  shippingAddress: object;
  createdAt: string;
  items: Array<{
    productSlug: string;
    name: string;
    quantity: number;
    priceValue: number;
    priceCurrency: string;
  }>;
}

/** Get all orders for a specific user */
export async function getUserOrders(userId: string): Promise<OrderSummary[]> {
  const res = await query<{
    id: string; status: string; total_value: number;
    total_currency: string; created_at: string; item_count: string;
  }>(
    `SELECT o.id, o.status, o.total_value, o.total_currency, o.created_at,
            (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
     FROM orders o
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return res.rows.map(r => ({
    id: r.id, status: r.status,
    totalValue: Number(r.total_value), totalCurrency: r.total_currency,
    createdAt: r.created_at, itemCount: parseInt(r.item_count, 10),
  }));
}

/** Get a single order by ID — enforces ownership */
export async function getOrderById(
  orderId: string,
  requestingUserId: string,
  requestingRole: 'CUSTOMER' | 'ADMIN'
): Promise<OrderDetail> {
  const res = await query<{
    id: string; user_id: string; status: string; total_value: number;
    total_currency: string; shipping_address_json: string | object; created_at: string;
  }>('SELECT id, user_id, status, total_value, total_currency, shipping_address_json, created_at FROM orders WHERE id = $1', [orderId]);

  if (res.rowCount === 0) {
    const err: any = new Error('Order not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const order = res.rows[0];

  // Ownership check: customers can only access their own orders
  if (requestingRole !== 'ADMIN' && order.user_id !== requestingUserId) {
    const err: any = new Error('Order not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const itemsRes = await query<{
    product_slug: string; product_name: string; quantity: number;
    price_value: number;
  }>('SELECT product_slug, product_name, quantity, price_value FROM order_items WHERE order_id = $1', [orderId]);

  return {
    id: order.id, userId: order.user_id, status: order.status,
    totalValue: Number(order.total_value), totalCurrency: order.total_currency || 'USD',
    shippingAddress: typeof order.shipping_address_json === 'string'
      ? JSON.parse(order.shipping_address_json) : (order.shipping_address_json || {}),
    createdAt: order.created_at,
    items: itemsRes.rows.map(i => ({
      productSlug: i.product_slug, name: i.product_name,
      quantity: i.quantity, priceValue: Number(i.price_value), priceCurrency: 'USD',
    })),
  };
}
