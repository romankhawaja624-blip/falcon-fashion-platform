// FALCON Admin Routes — RBAC-protected admin endpoints

import { Router } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getAllInventory, updateStock } from '../services/inventoryService';
import { query } from '../db/pool';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, requireAdmin);

/** GET /api/admin/inventory — full inventory dashboard */
router.get('/inventory', async (_req, res, next) => {
  try {
    const items = await getAllInventory();
    res.status(200).json({ success: true, data: items });
  } catch (err) { next(err); }
});

/** PATCH /api/admin/inventory/:slug — admin stock update */
router.patch('/inventory/:slug', async (req: AuthRequest, res, next) => {
  try {
    const { stockQuantity } = req.body;
    if (typeof stockQuantity !== 'number') {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'stockQuantity (number) is required.' } });
      return;
    }
    const item = await updateStock(req.params.slug as string, stockQuantity);
    res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
});

/** GET /api/admin/customers — customer list */
router.get('/customers', async (_req, res, next) => {
  try {
    const result = await query<{
      id: string; email: string; first_name: string; last_name: string;
      membership_tier: string; role: string; email_verified: boolean; created_at: string;
    }>(`SELECT id, email, first_name, last_name, membership_tier, role, email_verified, created_at
        FROM users ORDER BY created_at DESC`);
    res.status(200).json({
      success: true,
      data: result.rows.map(u => ({
        id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name,
        membershipTier: u.membership_tier, role: u.role,
        emailVerified: u.email_verified, createdAt: u.created_at,
      })),
    });
  } catch (err) { next(err); }
});

/** GET /api/admin/orders — all orders */
router.get('/orders', async (_req, res, next) => {
  try {
    const result = await query<{
      id: string; user_id: string; status: string; total_value: number;
      total_currency: string; created_at: string;
    }>('SELECT id, user_id, status, total_value, total_currency, created_at FROM orders ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      data: result.rows.map(o => ({
        id: o.id, userId: o.user_id, status: o.status,
        totalValue: Number(o.total_value), totalCurrency: o.total_currency,
        createdAt: o.created_at,
      })),
    });
  } catch (err) { next(err); }
});

export default router;
