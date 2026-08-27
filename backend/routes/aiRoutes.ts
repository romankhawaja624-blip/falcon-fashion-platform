// FALCON AI Routes — POST /api/ai/chat (quota-enforced)

import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { checkAndConsumeQuota } from '../services/aiQuotaService';
import { query } from '../db/pool';

const router = Router();

router.post('/chat', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Message text is required.' } });
      return;
    }

    const quota = await checkAndConsumeQuota(user.userId, user.membershipTier);
    if (!quota.allowed) {
      res.status(429).json({
        success: false,
        error: {
          code: 'QUOTA_EXCEEDED',
          message: quota.limitType === 'daily'
            ? 'Daily AI message limit reached. Upgrade to Pro for unlimited access.'
            : 'Monthly AI message limit reached. Upgrade to Pro for unlimited access.',
          limitType: quota.limitType,
        },
        quota: quota.usage,
        limits: quota.limits,
      });
      return;
    }

    // Mock AI response — production will connect to LLM provider
    const aiResponse = {
      message: `Thank you for your message. Our AI stylist has noted: "${message.substring(0, 100)}". This is a development response — production will connect to a real LLM provider.`,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: { response: aiResponse, quota: quota.usage, limits: quota.limits },
    });
  } catch (err) { next(err); }
});

/** GET /api/ai/quota — check remaining quota without consuming */
router.get('/quota', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);

    const result = await query<{
      daily_used: number; monthly_used: number;
      daily_reset_date: string; monthly_reset_date: string;
    }>('SELECT * FROM ai_quotas WHERE user_id = $1', [user.userId]);

    if (result.rowCount === 0) {
      res.status(200).json({
        success: true,
        data: {
          dailyUsed: 0, dailyRemaining: user.membershipTier === 'pro' ? 'unlimited' : 3,
          monthlyUsed: 0, monthlyRemaining: user.membershipTier === 'pro' ? 'unlimited' : 50,
          limits: { daily: user.membershipTier === 'pro' ? 'unlimited' : 3, monthly: user.membershipTier === 'pro' ? 'unlimited' : 50 },
        },
      });
      return;
    }

    const row = result.rows[0];
    const dailyUsed   = row.daily_reset_date === today ? row.daily_used : 0;
    const monthlyUsed = row.monthly_reset_date === month ? row.monthly_used : 0;

    res.status(200).json({
      success: true,
      data: {
        dailyUsed, monthlyUsed,
        dailyRemaining: user.membershipTier === 'pro' ? 'unlimited' : Math.max(0, 3 - dailyUsed),
        monthlyRemaining: user.membershipTier === 'pro' ? 'unlimited' : Math.max(0, 50 - monthlyUsed),
        limits: { daily: user.membershipTier === 'pro' ? 'unlimited' : 3, monthly: user.membershipTier === 'pro' ? 'unlimited' : 50 },
      },
    });
  } catch (err) { next(err); }
});

export default router;
