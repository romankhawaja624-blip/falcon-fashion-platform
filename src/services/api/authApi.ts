// FALCON Client API for Authentication & Account Profile
// Communicates with real Node.js backend via HTTP

import { apiRequest, setAuthToken, clearAuthToken, type ApiResponse } from './client';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: 'free' | 'pro';
  role: 'CUSTOMER' | 'ADMIN';
  emailVerified: boolean;
}

export interface AuthResult {
  user: SafeUser;
  token: string;
}

export async function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<ApiResponse<AuthResult>> {
  const res = await apiRequest<AuthResult>('POST', '/api/auth/register', input, { skipAuth: true });
  if (res.success && res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResult>> {
  const res = await apiRequest<AuthResult>('POST', '/api/auth/login', input, { skipAuth: true });
  if (res.success && res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res;
}

export function logout(): void {
  clearAuthToken();
}

export async function getProfile(): Promise<ApiResponse> {
  return apiRequest('GET', '/api/auth/profile');
}

export async function updateProfile(_userId: string, updated: Record<string, unknown>): Promise<ApiResponse> {
  return apiRequest('PATCH', '/api/auth/profile', updated);
}
