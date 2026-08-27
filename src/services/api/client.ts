// In dev mode, Vite proxies /api/* to http://localhost:3001
// In production, the API_BASE can be set to the backend URL
const API_BASE = import.meta.env.VITE_API_BASE || '';

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('falcon_auth_token');
    return stored || null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem('falcon_auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('falcon_auth_token');
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; limitType?: string };
  quota?: Record<string, unknown>;
  limits?: Record<string, unknown>;
}

export async function apiRequest<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  options?: { skipAuth?: boolean }
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!options?.skipAuth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({ success: false, error: { code: 'PARSE_ERROR', message: 'Invalid server response.' } }));
    return json as ApiResponse<T>;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error.';
    return { success: false, error: { code: 'NETWORK_ERROR', message: `Unable to connect to server. ${message}` } };
  }
}
