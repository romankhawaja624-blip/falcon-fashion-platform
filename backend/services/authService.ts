// FALCON Auth Service — real PostgreSQL-backed registration & login

import { query } from '../db/pool';
import { hashPassword, verifyPassword, generateToken } from '../security/crypto';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipTier: 'free' | 'pro';
  role: 'CUSTOMER' | 'ADMIN';
  emailVerified: boolean;
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ user: SafeUser; token: string }> {
  const email = input.email.toLowerCase().trim();

  const existing = await query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1', [email]
  );
  if (existing.rowCount > 0) {
    const err: any = new Error('An account with this email address already exists.');
    err.statusCode = 409; err.code = 'EMAIL_CONFLICT';
    throw err;
  }

  const { hash, salt } = hashPassword(input.password);
  const id = `usr_${Date.now().toString(36)}`;

  await query(
    `INSERT INTO users (id, email, password_hash, salt, first_name, last_name, membership_tier, role, email_verified)
     VALUES ($1,$2,$3,$4,$5,$6,'free','CUSTOMER',false)`,
    [id, email, hash, salt, input.firstName.trim(), input.lastName.trim()]
  );

  const atelierId = `FX-MBR-${Math.floor(1000 + Math.random() * 9000)}`;
  await query(
    `INSERT INTO user_profiles (user_id, atelier_id, aesthetic, palette, outerwear_size, tailoring_size, footwear_size, currency, region)
     VALUES ($1,$2,'Quiet structure','Monochrome','M (Medium)','38R / EU 48','39 EU / 8.5 US','USD ($)','Global Express')`,
    [id, atelierId]
  );

  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);
  await query(
    `INSERT INTO ai_quotas (user_id, daily_used, monthly_used, daily_reset_date, monthly_reset_date)
     VALUES ($1, 0, 0, $2, $3)`,
    [id, today, month]
  );

  await query(
    `INSERT INTO loyalty_accounts (user_id, xp, coins, level_label) VALUES ($1, 0, 0, 'Level 01')`,
    [id]
  );

  const user: SafeUser = {
    id, email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    membershipTier: 'free',
    role: 'CUSTOMER',
    emailVerified: false,
  };
  const token = generateToken({ userId: id, email, role: 'CUSTOMER', membershipTier: 'free' });
  return { user, token };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: SafeUser; token: string }> {
  const email = input.email.toLowerCase().trim();

  const result = await query<{
    id: string; email: string; password_hash: string; salt: string;
    first_name: string; last_name: string; membership_tier: 'free'|'pro';
    role: 'CUSTOMER'|'ADMIN'; email_verified: boolean;
  }>('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rowCount === 0) {
    const err: any = new Error('Invalid email address or password.');
    err.statusCode = 401; err.code = 'AUTHENTICATION_FAILED';
    throw err;
  }

  const row = result.rows[0];
  const valid = verifyPassword(input.password, row.password_hash, row.salt);
  if (!valid) {
    const err: any = new Error('Invalid email address or password.');
    err.statusCode = 401; err.code = 'AUTHENTICATION_FAILED';
    throw err;
  }

  const user: SafeUser = {
    id: row.id, email: row.email,
    firstName: row.first_name, lastName: row.last_name,
    membershipTier: row.membership_tier,
    role: row.role,
    emailVerified: row.email_verified,
  };
  const token = generateToken({
    userId: row.id, email: row.email,
    role: row.role, membershipTier: row.membership_tier,
  });
  return { user, token };
}

export async function getUserProfile(userId: string): Promise<Record<string, unknown>> {
  const userRes = await query<{
    id: string; email: string; first_name: string; last_name: string;
    membership_tier: string; role: string; email_verified: boolean;
  }>('SELECT id, email, first_name, last_name, membership_tier, role, email_verified FROM users WHERE id = $1', [userId]);

  if (userRes.rowCount === 0) {
    const err: any = new Error('User not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  const u = userRes.rows[0];

  const profRes = await query<{
    atelier_id: string; aesthetic: string; palette: string;
    outerwear_size: string; tailoring_size: string; footwear_size: string;
    currency: string; region: string; ai_learning: boolean; notifications_json: object;
  }>('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);

  const p = profRes.rows[0] || {};
  return {
    id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name,
    membershipTier: u.membership_tier, role: u.role, emailVerified: u.email_verified,
    atelierId: p.atelier_id || '', aesthetic: p.aesthetic || '', palette: p.palette || '',
    outerwearSize: p.outerwear_size || '', tailoringSize: p.tailoring_size || '',
    footwearSize: p.footwear_size || '', currency: p.currency || 'USD ($)',
    region: p.region || 'Global Express', aiLearning: p.ai_learning ?? true,
    notifications: typeof p.notifications_json === 'string' ? JSON.parse(p.notifications_json) : (p.notifications_json || {}),
  };
}

export async function updateUserProfile(userId: string, input: {
  firstName?: string;
  lastName?: string;
  aesthetic?: string;
  palette?: string;
  outerwearSize?: string;
  tailoringSize?: string;
  footwearSize?: string;
  currency?: string;
  region?: string;
}): Promise<Record<string, unknown>> {
  if (input.firstName || input.lastName) {
    await query(
      `UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), updated_at = NOW() WHERE id = $3`,
      [input.firstName?.trim() || null, input.lastName?.trim() || null, userId]
    );
  }
  await query(
    `UPDATE user_profiles
     SET aesthetic = COALESCE($1, aesthetic),
         palette = COALESCE($2, palette),
         outerwear_size = COALESCE($3, outerwear_size),
         tailoring_size = COALESCE($4, tailoring_size),
         footwear_size = COALESCE($5, footwear_size),
         currency = COALESCE($6, currency),
         region = COALESCE($7, region)
     WHERE user_id = $8`,
    [
      input.aesthetic || null, input.palette || null,
      input.outerwearSize || null, input.tailoringSize || null, input.footwearSize || null,
      input.currency || null, input.region || null, userId
    ]
  );
  return getUserProfile(userId);
}
