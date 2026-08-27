// FALCON Auth Routes — register, login, profile management

import { Router } from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Missing required fields: email, password, firstName, lastName.' } });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Password must be at least 8 characters.' } });
      return;
    }
    const result = await registerUser({ email, password, firstName, lastName });
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Missing required fields: email, password.' } });
      return;
    }
    const result = await loginUser({ email, password });
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
});

/** GET /api/auth/profile — read authenticated user profile (IDOR safe) */
router.get('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const profile = await getUserProfile(req.user!.userId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) { next(err); }
});

/** PATCH /api/auth/profile — update authenticated user profile (IDOR safe) */
router.patch('/profile', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const updated = await updateUserProfile(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;
