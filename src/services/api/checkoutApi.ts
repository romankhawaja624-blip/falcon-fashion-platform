// FALCON Client API for Checkout & Order Tracking
// Communicates with real Node.js backend via HTTP

import { apiRequest, type ApiResponse } from './client';

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

export async function submitCheckout(payload: {
  items: Array<{ slug: string; quantity: number; size?: string }>;
  shippingAddress: object;
  contactName?: string;
}): Promise<ApiResponse<OrderResult>> {
  return apiRequest<OrderResult>('POST', '/api/checkout', payload);
}

export async function fetchOrders(): Promise<ApiResponse<OrderSummary[]>> {
  return apiRequest<OrderSummary[]>('GET', '/api/orders');
}

export async function fetchOrderById(orderId: string): Promise<ApiResponse<OrderDetail>> {
  return apiRequest<OrderDetail>('GET', `/api/orders/${orderId}`);
}

export async function adminUpdateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
  return apiRequest('PATCH', `/api/admin/orders/${orderId}/status`, { status });
}
