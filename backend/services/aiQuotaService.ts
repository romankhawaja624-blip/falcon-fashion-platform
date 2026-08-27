// FALCON AI Quota Service — PostgreSQL-backed with atomic updates
// Locked rule: FREE = 3/day AND 50/month | PRO = unlimited

import { query } from '../db/pool';
import { PoolClient } from 'pg';

const FREE_DAILY   = 3;
const FREE_MONTHLY = 50;

interface QuotaRow {
  user_id: string;
  daily_used: number;
  monthly_used: number;
  daily_reset_date: string;
  monthly_reset_date: string;
}

async function resetIfStale(userId: string, client?: PoolClient): Promise<QuotaRow> {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);
  const q     = client
    ? (sql: string, p: unknown[]) => client.query(sql, p)
    : (sql: string, p: unknown[]) => query(sql, p);

  // Reset daily counter if date has rolled
  await q(
    `UPDATE ai_quotas
     SET daily_used = 0, daily_reset_date = $1
     WHERE user_id = $2 AND daily_reset_date <> $1`,
    [today, userId]
  );
  // Reset monthly counter if month has rolled
  await q(
    `UPDATE ai_quotas
     SET monthly_used = 0, monthly_reset_date = $1
     WHERE user_id = $2 AND monthly_reset_date <> $1`,
    [month, userId]
  );

  const res = await q(
    'SELECT * FROM ai_quotas WHERE user_id = $1',
    [userId]
  );
  const rows = (res as any).rows as QuotaRow[];
  if (rows.length === 0) {
    await q(
      `INSERT INTO ai_quotas (user_id, daily_used, monthly_used, daily_reset_date, monthly_reset_date)
       VALUES ($1, 0, 0, $2, $3)`,
      [userId, today, month]
    );
    return { user_id: userId, daily_used: 0, monthly_used: 0, daily_reset_date: today, monthly_reset_date: month };
  }
  return rows[0];
}

export interface QuotaCheckResult {
  allowed: boolean;
  limitType?: 'daily' | 'monthly';
  upgradeRequired: boolean;
  usage: { dailyUsed: number; dailyRemaining: number | 'unlimited'; monthlyUsed: number; monthlyRemaining: number | 'unlimited' };
  limits: { daily: number | 'unlimited'; monthly: number | 'unlimited' };
}

export async function checkAndConsumeQuota(
  userId: string,
  membershipTier: 'free' | 'pro'
): Promise<QuotaCheckResult> {
  if (membershipTier === 'pro') {
    // Pro: atomic increment with no limit check
    await query('UPDATE ai_quotas SET daily_used = daily_used + 1, monthly_used = monthly_used + 1 WHERE user_id = $1', [userId]);
    const row = await resetIfStale(userId);
    return {
      allowed: true, upgradeRequired: false,
      usage: { dailyUsed: row.daily_used, dailyRemaining: 'unlimited', monthlyUsed: row.monthly_used, monthlyRemaining: 'unlimited' },
      limits: { daily: 'unlimited', monthly: 'unlimited' },
    };
  }

  // Free tier: atomic UPDATE ... WHERE and check rowCount to detect limit atomically
  await resetIfStale(userId);

  // Atomic: increment only if BOTH limits not yet reached
  const res = await query<{ daily_used: number; monthly_used: number }>(
    `UPDATE ai_quotas
     SET daily_used = daily_used + 1, monthly_used = monthly_used + 1
     WHERE user_id = $1
       AND daily_used < $2
       AND monthly_used < $3
     RETURNING daily_used, monthly_used`,
    [userId, FREE_DAILY, FREE_MONTHLY]
  );

  if (res.rowCount > 0) {
    const { daily_used, monthly_used } = res.rows[0];
    return {
      allowed: true, upgradeRequired: false,
      usage: { dailyUsed: daily_used, dailyRemaining: FREE_DAILY - daily_used, monthlyUsed: monthly_used, monthlyRemaining: FREE_MONTHLY - monthly_used },
      limits: { daily: FREE_DAILY, monthly: FREE_MONTHLY },
    };
  }

  // Determine which limit blocked the request
  const row = await resetIfStale(userId);
  const limitType: 'daily' | 'monthly' = row.daily_used >= FREE_DAILY ? 'daily' : 'monthly';
  return {
    allowed: false, limitType, upgradeRequired: true,
    usage: {
      dailyUsed: row.daily_used,
      dailyRemaining: Math.max(0, FREE_DAILY - row.daily_used),
      monthlyUsed: row.monthly_used,
      monthlyRemaining: Math.max(0, FREE_MONTHLY - row.monthly_used),
    },
    limits: { daily: FREE_DAILY, monthly: FREE_MONTHLY },
  };
}
