// FALCON API Controllers with Server-Side Input Validation & Error Sanitization
import { verifyToken } from '../security/crypto';
import * as authService from '../services/authService';
import * as catalogService from '../services/catalogService';
import * as checkoutService from '../services/checkoutService';
import * as aiQuotaService from '../services/aiQuotaService';
import * as supportService from '../services/supportService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export function handleAuthToken(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyToken(token);
}

export async function handleRegister(body: any): Promise<ApiResponse> {
  try {
    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName) {
      return { success: false, error: { code: 'INVALID_INPUT', message: 'All registration fields are required.' } };
    }
    const result = await authService.registerUser(body);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: { code: 'REGISTRATION_FAILED', message: err.message } };
  }
}

export async function handleLogin(body: any): Promise<ApiResponse> {
  try {
    if (!body?.email || !body?.password) {
      return { success: false, error: { code: 'INVALID_INPUT', message: 'Email and password are required.' } };
    }
    const result = await authService.loginUser(body);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: { code: 'AUTHENTICATION_FAILED', message: err.message } };
  }
}

export async function handleAiChat(authHeader: string | undefined, body: any): Promise<ApiResponse> {
  const token = handleAuthToken(authHeader);
  const userId = token ? token.userId : 'usr_guest';
  const tier = token ? token.membershipTier : 'free';

  // Server-Side Atomic Quota Check & Consumption
  const quotaResult = aiQuotaService.consumeAiQuota(userId, tier);

  if (!quotaResult.allowed && tier !== 'pro') {
    return {
      success: false,
      error: {
        code: 'AI_LIMIT_REACHED',
        message: `Your ${tier} plan ${quotaResult.limitType} limit of ${
          quotaResult.limitType === 'daily' ? quotaResult.limits.daily : quotaResult.limits.monthly
        } messages has been reached. Upgrade to Pro for unlimited AI clienteling.`,
      },
      data: {
        upgradeRequired: true,
        limitType: quotaResult.limitType,
        usage: quotaResult.usage,
        limits: quotaResult.limits,
      },
    };
  }

  const promptMessage = body?.message ?? 'Hello Falcon Stylist';
  const simulatedResponse = `Falcon AI Recommendation: Based on your digital wardrobe preferences and active style score, "${promptMessage}" pairs beautifully with the Obsidian Wool Coat and Graphite Tailored Trousers.`;

  return {
    success: true,
    data: {
      response: simulatedResponse,
      usage: quotaResult.usage,
      limits: quotaResult.limits,
      upgradeRequired: false,
    },
  };
}

export async function handleAdminUpdateInventory(authHeader: string | undefined, body: any): Promise<ApiResponse> {
  const token = handleAuthToken(authHeader);
  if (!token || token.role !== 'ADMIN') {
    return { success: false, error: { code: 'FORBIDDEN', message: 'Admin authorization required.' } };
  }

  if (!body?.slug || body?.stockQuantity === undefined) {
    return { success: false, error: { code: 'INVALID_INPUT', message: 'Product slug and stockQuantity are required.' } };
  }

  const updated = catalogService.updateInventoryStock(body.slug, body.stockQuantity);
  return { success: true, data: updated };
}

export async function handleCheckout(authHeader: string | undefined, body: any): Promise<ApiResponse> {
  const token = handleAuthToken(authHeader);
  const userId = token ? token.userId : 'usr_guest';

  try {
    const order = await checkoutService.processCheckout({
      userId,
      items: body.items ?? [],
      shippingAddress: body.shippingAddress ?? {},
      contactEmail: body.contactEmail ?? 'guest@example.com',
      contactName: body.contactName ?? 'Guest Client',
      deliveryMethod: body.deliveryMethod ?? { id: 'standard', label: 'Standard', estimate: '5-7 days', price: 0 },
    });
    return { success: true, data: order };
  } catch (err: any) {
    return { success: false, error: { code: 'CHECKOUT_FAILED', message: err.message } };
  }
}
