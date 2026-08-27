// FALCON Server-Side Cryptographic Utilities (Node.js runtime)
// Uses Node.js crypto module with standard HMAC SHA-256 (HS256)

import { createHmac, randomBytes, pbkdf2Sync } from 'crypto';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('[FATAL SECURITY ERROR] JWT_SECRET must be set in production environment.');
  }
  return secret || 'falcon_atelier_jwt_secret_key_production_ready_2026';
}

export function hashPassword(password: string, saltHex?: string): { hash: string; salt: string } {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16);
  const derived = pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  return {
    hash: derived.toString('hex'),
    salt: salt.toString('hex'),
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computed } = hashPassword(password, salt);
  return computed === hash;
}

export function generateToken(payload: {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  membershipTier: 'free' | 'pro';
}): string {
  const secret = getJwtSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp    = Date.now() + 24 * 60 * 60 * 1000;
  const body   = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig    = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  membershipTier: 'free' | 'pro';
  exp: number;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const body = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (Date.now() > body.exp) return null;

    const secret   = getJwtSecret();
    const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    if (expected !== parts[2]) return null;
    return body;
  } catch {
    return null;
  }
}
