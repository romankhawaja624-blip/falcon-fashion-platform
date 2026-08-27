// FALCON Authentication Middleware — JWT bearer-token extraction & RBAC enforcement

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../security/crypto';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    membershipTier: 'free' | 'pro';
  };
}

/** Extracts and verifies the Bearer JWT. Sets req.user on success. */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication token required.' } });
    return;
  }
  const token   = header.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' } });
    return;
  }
  req.user = payload;
  next();
}

/** Requires ADMIN role. Must be used after authenticate(). */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin authorization required.' } });
    return;
  }
  next();
}
