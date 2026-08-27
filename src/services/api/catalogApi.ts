// FALCON Client API for Catalog & Inventory
// Communicates with real Node.js backend via HTTP

import { apiRequest, type ApiResponse } from './client';

export interface InventoryItem {
  productId: string;
  slug: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export async function fetchProducts(): Promise<ApiResponse<InventoryItem[]>> {
  return apiRequest<InventoryItem[]>('GET', '/api/inventory');
}

export async function fetchProductBySlug(slug: string): Promise<ApiResponse<InventoryItem>> {
  return apiRequest<InventoryItem>('GET', `/api/inventory/${slug}`);
}

export async function fetchStock(slug: string): Promise<ApiResponse<InventoryItem>> {
  return apiRequest<InventoryItem>('GET', `/api/inventory/${slug}`);
}

export async function adminUpdateStock(slug: string, stockQuantity: number): Promise<ApiResponse<InventoryItem>> {
  return apiRequest<InventoryItem>('PATCH', `/api/admin/inventory/${slug}`, { stockQuantity });
}
