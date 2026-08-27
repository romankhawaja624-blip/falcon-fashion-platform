// FALCON Security & Cryptographic Utilities
// Standard Web Crypto API implementation for zero external dependencies

export async function hashPassword(password: string, saltHex?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = saltHex
    ? hexToBytes(saltHex)
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const hashHex = bytesToHex(new Uint8Array(exportedKey));
  const saltHexResult = bytesToHex(saltBytes);

  return { hash: hashHex, salt: saltHexResult };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  return computed.hash === hash;
}

export function generateToken(payload: { userId: string; email: string; role: 'CUSTOMER' | 'ADMIN'; membershipTier: 'free' | 'pro' }): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  const signature = btoa(`${payload.userId}:${payload.role}:${exp}`);
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): { userId: string; email: string; role: 'CUSTOMER' | 'ADMIN'; membershipTier: 'free' | 'pro'; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const body = JSON.parse(atob(parts[1]));
    if (Date.now() > body.exp) return null;
    return body;
  } catch {
    return null;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
