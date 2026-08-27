// FALCON Error Handling Middleware
// Sanitizes errors before returning to client — never leaks stack traces or SQL

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log full detail server-side only
  console.error('[FALCON ERROR]', err.message);

  const status  = err.statusCode ?? 500;
  const code    = err.code ?? 'INTERNAL_SERVER_ERROR';
  const message = status < 500
    ? err.message
    : 'An unexpected server error occurred.'; // Never expose internal detail to client

  res.status(status).json({ success: false, error: { code, message } });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } });
}
