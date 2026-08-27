// FALCON Inventory Routes — public read, admin-only mutation

import { Router } from 'express';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import { getStockBySlug, getAllInventory, updateStock } from '../services/inventoryService';

const router = Router();

/** GET /api/inventory — public: list all stock levels */
router.get('/', async (_req, res, next) => {
  try {
    const items = await getAllInventory();
    res.status(200).json({ success: true, data: items });
  } catch (err) { next(err); }
});

/** GET /api/inventory/:slug — public: single product stock */
router.get('/:slug', async (req, res, next) => {
  try {
    const item = await getStockBySlug(req.params.slug as string);
    if (!item) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found in inventory.' } });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) { next(err); }
});

/** PATCH /api/inventory/:slug — admin-only: update stock */
router.patch('/:slug', authenticate, requireAdmin, async (req: AuthRequest, res, next) => {
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

export default router;
