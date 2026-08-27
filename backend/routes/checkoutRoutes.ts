// FALCON Checkout Routes — POST /api/checkout (authenticated, transactional)

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { processCheckout } from '../services/checkoutService';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { items, shippingAddress, contactName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Cart items are required.' } });
      return;
    }

    if (!shippingAddress) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Shipping address is required.' } });
      return;
    }

    const result = await processCheckout(
      user.userId,
      user.email,
      contactName || user.email,
      items,
      shippingAddress
    );
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;
