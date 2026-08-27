// FALCON Backend HTTP Server Runtime
import * as apiControllers from './controllers/apiControllers';
import * as supportService from './services/supportService';
import * as checkoutService from './services/checkoutService';

export interface HttpRequest {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  headers: Record<string, string>;
  body?: any;
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
}

export async function handleHttpRequest(req: HttpRequest): Promise<HttpResponse> {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const jsonHeaders = { 'Content-Type': 'application/json' };

  try {
    // 1. Auth Endpoints
    if (req.method === 'POST' && req.path === '/api/auth/register') {
      const res = await apiControllers.handleRegister(req.body);
      return { status: res.success ? 201 : 400, headers: jsonHeaders, body: res };
    }

    if (req.method === 'POST' && req.path === '/api/auth/login') {
      const res = await apiControllers.handleLogin(req.body);
      return { status: res.success ? 200 : 401, headers: jsonHeaders, body: res };
    }

    // 2. AI Chat & Quota Endpoint
    if (req.method === 'POST' && req.path === '/api/ai/chat') {
      const res = await apiControllers.handleAiChat(authHeader, req.body);
      const status = res.success ? 200 : res.error?.code === 'AI_LIMIT_REACHED' ? 429 : 400;
      return { status, headers: jsonHeaders, body: res };
    }

    // 3. Checkout Endpoint
    if (req.method === 'POST' && req.path === '/api/checkout') {
      const res = await apiControllers.handleCheckout(authHeader, req.body);
      return { status: res.success ? 201 : 400, headers: jsonHeaders, body: res };
    }

    // 4. Admin Inventory Endpoint
    if (req.method === 'PATCH' && req.path === '/api/admin/inventory') {
      const res = await apiControllers.handleAdminUpdateInventory(authHeader, req.body);
      const status = res.success ? 200 : res.error?.code === 'FORBIDDEN' ? 403 : 400;
      return { status, headers: jsonHeaders, body: res };
    }

    // 5. Support Ticket Endpoint
    if (req.method === 'GET' && req.path.startsWith('/api/support/tickets')) {
      const tickets = supportService.getTickets();
      return { status: 200, headers: jsonHeaders, body: { success: true, data: tickets } };
    }

    // 6. Order Detail Endpoint
    if (req.method === 'GET' && req.path.startsWith('/api/orders/')) {
      const orderId = req.path.split('/api/orders/')[1];
      const order = checkoutService.getOrderById(orderId);
      if (!order) {
        return { status: 404, headers: jsonHeaders, body: { success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } } };
      }
      return { status: 200, headers: jsonHeaders, body: { success: true, data: order } };
    }

    return { status: 404, headers: jsonHeaders, body: { success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } } };
  } catch (err: any) {
    return {
      status: 500,
      headers: jsonHeaders,
      body: { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } },
    };
  }
}
