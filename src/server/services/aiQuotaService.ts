// FALCON AI Quota & Allowance Enforcement Service
// Implements Locked Product Decision: FREE = 3/day AND 50/month; PRO = Unlimited

import { db, type DbAiQuota } from '../database/db';
import { BACKEND_CONFIG } from '../config/config';

export interface QuotaCheckResult {
  allowed: boolean;
  limitType?: 'daily' | 'monthly';
  upgradeRequired: boolean;
  usage: {
    dailyUsed: number;
    dailyRemaining: number | 'unlimited';
    monthlyUsed: number;
    monthlyRemaining: number | 'unlimited';
  };
  limits: {
    daily: number | 'unlimited';
    monthly: number | 'unlimited';
  };
}

export function getOrCreateQuota(userId: string): DbAiQuota {
  const todayStr = new Date().toISOString().split('T')[0];
  const monthStr = todayStr.substring(0, 7);

  let quota = db.aiQuotas.get(userId);
  if (!quota) {
    quota = {
      userId,
      dailyUsed: 0,
      monthlyUsed: 0,
      dailyResetDate: todayStr,
      monthlyResetDate: monthStr,
      updatedAt: new Date().toISOString(),
    };
    db.aiQuotas.set(userId, quota);
  }

  // Atomic Daily Reset check
  if (quota.dailyResetDate !== todayStr) {
    quota.dailyUsed = 0;
    quota.dailyResetDate = todayStr;
    quota.updatedAt = new Date().toISOString();
  }

  // Atomic Monthly Reset check
  if (quota.monthlyResetDate !== monthStr) {
    quota.monthlyUsed = 0;
    quota.monthlyResetDate = monthStr;
    quota.updatedAt = new Date().toISOString();
  }

  return quota;
}

export function checkAiQuota(userId: string, membershipTier: 'free' | 'pro'): QuotaCheckResult {
  const quota = getOrCreateQuota(userId);

  if (membershipTier === 'pro') {
    return {
      allowed: true,
      upgradeRequired: false,
      usage: {
        dailyUsed: quota.dailyUsed,
        dailyRemaining: 'unlimited',
        monthlyUsed: quota.monthlyUsed,
        monthlyRemaining: 'unlimited',
      },
      limits: {
        daily: 'unlimited',
        monthly: 'unlimited',
      },
    };
  }

  const freeDailyLimit = BACKEND_CONFIG.AI_QUOTA.FREE.DAILY_LIMIT; // 3
  const freeMonthlyLimit = BACKEND_CONFIG.AI_QUOTA.FREE.MONTHLY_LIMIT; // 50

  const dailyRemaining = Math.max(0, freeDailyLimit - quota.dailyUsed);
  const monthlyRemaining = Math.max(0, freeMonthlyLimit - quota.monthlyUsed);

  // Enforce BOTH limits
  let allowed = true;
  let limitType: 'daily' | 'monthly' | undefined = undefined;

  if (quota.dailyUsed >= freeDailyLimit) {
    allowed = false;
    limitType = 'daily';
  } else if (quota.monthlyUsed >= freeMonthlyLimit) {
    allowed = false;
    limitType = 'monthly';
  }

  return {
    allowed,
    limitType,
    upgradeRequired: !allowed,
    usage: {
      dailyUsed: quota.dailyUsed,
      dailyRemaining,
      monthlyUsed: quota.monthlyUsed,
      monthlyRemaining,
    },
    limits: {
      daily: freeDailyLimit,
      monthly: freeMonthlyLimit,
    },
  };
}

export function consumeAiQuota(userId: string, membershipTier: 'free' | 'pro'): QuotaCheckResult {
  const check = checkAiQuota(userId, membershipTier);
  if (!check.allowed && membershipTier !== 'pro') {
    return check;
  }

  const quota = getOrCreateQuota(userId);
  quota.dailyUsed += 1;
  quota.monthlyUsed += 1;
  quota.updatedAt = new Date().toISOString();

  return checkAiQuota(userId, membershipTier);
}
