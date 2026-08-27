// FALCON Client API for AI Clienteling & Quota Enforcement
// Communicates with real Node.js backend via HTTP

import { apiRequest, type ApiResponse } from './client';

export interface AiChatResponse {
  response: { message: string; timestamp: string };
  quota: { dailyUsed: number; dailyRemaining: number | string; monthlyUsed: number; monthlyRemaining: number | string };
  limits: { daily: number | string; monthly: number | string };
}

export interface AiQuotaResponse {
  dailyUsed: number;
  dailyRemaining: number | string;
  monthlyUsed: number;
  monthlyRemaining: number | string;
  limits: { daily: number | string; monthly: number | string };
}

export async function sendAiMessage(message: string): Promise<ApiResponse<AiChatResponse>> {
  return apiRequest<AiChatResponse>('POST', '/api/ai/chat', { message });
}

export async function getAiQuota(): Promise<ApiResponse<AiQuotaResponse>> {
  return apiRequest<AiQuotaResponse>('GET', '/api/ai/quota');
}
