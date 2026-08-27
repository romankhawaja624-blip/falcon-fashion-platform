// FALCON Order Routes — authenticated, ownership-protected

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getUserOrders, getOrderById } from '../services/orderService';

const router = Router();

/** GET /api/orders — list current user's orders */
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = await getUserOrders(req.user!.userId);
    res.status(200).json({ success: true, data: orders });
  } catch (err) { next(err); }
});

/** GET /api/orders/:id — single order with ownership check */
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await getOrderById(req.params.id as string, req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, data: order });
  } catch (err) { next(err); }
});

export default router;
