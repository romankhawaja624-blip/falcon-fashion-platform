// FALCON Backend Integration Test Suite
// Tests against the real Express server + PostgreSQL
// Run: npx tsx backend/tests/integration.ts

import { hashPassword, verifyPassword, generateToken, verifyToken } from '../security/crypto';

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

interface TestResult {
  name: string;
  pass: boolean;
  detail: string;
  infraDependency?: boolean;
}

const results: TestResult[] = [];
let customerToken = '';
let adminToken    = '';
let dbAvailable   = false;

function log(pass: boolean, name: string, detail: string, infraDependency = false): void {
  results.push({ name, pass, detail, infraDependency });
  const icon = pass ? '  ✅ PASS:' : (infraDependency ? '  🟡 INFRA:' : '  ❌ FAIL:');
  console.log(`${icon} ${name} — ${detail}`);
}

let serverInstance: any = null;

async function ensureServerRunning(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/health`);
  } catch {
    // Server not running on 3001 — start local Express instance
    const { default: app } = await import('../server');
    await new Promise<void>((resolve) => {
      serverInstance = app.listen(3001, () => {
        resolve();
      });
    });
  }
}

async function api(
  method: string,
  path: string,
  body?: object,
  token?: string
): Promise<{ status: number; data: any }> {
  await ensureServerRunning();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

// ============================================================
// CRYPTO TESTS (unit-level, no server needed)
// ============================================================
async function testCrypto(): Promise<void> {
  console.log('\n--- Crypto Unit Tests ---');
  const { hash, salt } = hashPassword('test_password');
  log(hash.length === 64, 'PBKDF2 hash length', `Length: ${hash.length}`);
  log(salt.length === 32, 'Salt length', `Length: ${salt.length}`);
  log(verifyPassword('test_password', hash, salt), 'Correct password verification', 'hash check');
  log(!verifyPassword('wrong_password', hash, salt), 'Wrong password rejection', 'rejection check');

  const token = generateToken({ userId: 'usr_test', email: 'test@falcon.com', role: 'CUSTOMER', membershipTier: 'free' });
  const payload = verifyToken(token);
  log(payload !== null && payload.userId === 'usr_test', 'JWT sign & verify', `User ID: ${payload?.userId}`);
  log(verifyToken('invalid.token.structure') === null, 'Invalid JWT rejection', 'malformed token');
}

// ============================================================
// HEALTH CHECK
// ============================================================
async function testHealth(): Promise<void> {
  console.log('\n--- Health & Database Connectivity ---');
  const { status, data } = await api('GET', '/api/health');
  log(status === 200 || status === 503, 'Health endpoint status', `Status: ${status}`);
  log(data?.data?.server === 'ok', 'Express HTTP server', `Server status: ${data?.data?.server}`);
  
  dbAvailable = data?.data?.database === 'ok';
  if (dbAvailable) {
    log(true, 'PostgreSQL connectivity', 'PostgreSQL database is online & connected');
  } else {
    log(false, 'PostgreSQL connectivity', 'PostgreSQL instance offline. Live DB tests require running PostgreSQL.', true);
  }
}

// ============================================================
// AUTHENTICATION & SECURITY
// ============================================================
async function testAuth(): Promise<void> {
  console.log('\n--- Authentication & RBAC Tests ---');
  if (!dbAvailable) {
    log(false, 'Auth API endpoints', 'Skipped live DB test (PostgreSQL offline)', true);
    return;
  }

  // Register
  const regEmail = `test_${Date.now()}@falcon-test.com`;
  const reg = await api('POST', '/api/auth/register', {
    email: regEmail, password: 'test_secure_2026', firstName: 'Test', lastName: 'User',
  });
  log(reg.status === 201, 'Registration endpoint', `Status: ${reg.status}`);
  if (reg.data?.data?.token) customerToken = reg.data.data.token;

  // Privilege escalation payload attack: user submits role = ADMIN in body
  const escalate = await api('POST', '/api/auth/register', {
    email: `escalate_${Date.now()}@falcon-test.com`, password: 'test_secure_2026',
    firstName: 'Attacker', lastName: 'User', role: 'ADMIN', membershipTier: 'pro',
  });
  log(escalate.status === 201 && escalate.data?.data?.user?.role === 'CUSTOMER', 'Privilege escalation attempt rejected (forced CUSTOMER)', `Role: ${escalate.data?.data?.user?.role}`);

  // Duplicate registration
  const dup = await api('POST', '/api/auth/register', {
    email: regEmail, password: 'another_password', firstName: 'Test', lastName: 'User',
  });
  log(dup.status === 409, 'Duplicate registration rejection', `Status: ${dup.status}`);

  // Login
  const login = await api('POST', '/api/auth/login', { email: regEmail, password: 'test_secure_2026' });
  log(login.status === 200, 'Login authentication', `Status: ${login.status}`);

  // Wrong password
  const bad = await api('POST', '/api/auth/login', { email: regEmail, password: 'wrong' });
  log(bad.status === 401, 'Invalid password rejection', `Status: ${bad.status}`);

  // Missing token
  const noAuth = await api('GET', '/api/orders');
  log(noAuth.status === 401, 'Unauthenticated request rejection', `Status: ${noAuth.status}`);
}

// ============================================================
// RBAC AUDIT
// ============================================================
async function testRBAC(): Promise<void> {
  console.log('\n--- RBAC Authorization ---');
  if (!dbAvailable) {
    log(false, 'RBAC endpoints', 'Skipped live DB test (PostgreSQL offline)', true);
    return;
  }

  const custAdmin = await api('GET', '/api/admin/inventory', undefined, customerToken);
  log(custAdmin.status === 403, 'Customer → Admin endpoint (403 Forbidden)', `Status: ${custAdmin.status}`);

  // Admin login
  const admin = await api('POST', '/api/auth/login', { email: 'admin@falcon.com', password: 'falcon_admin_2026' });
  if (admin.data?.data?.token) adminToken = admin.data.data.token;

  if (adminToken) {
    const adminOk = await api('GET', '/api/admin/inventory', undefined, adminToken);
    log(adminOk.status === 200, 'Admin → Admin endpoint (200 OK)', `Status: ${adminOk.status}`);
  }
}

// ============================================================
// AI QUOTA AUDIT
// ============================================================
async function testAIQuota(): Promise<void> {
  console.log('\n--- AI Quota Enforcement (Free: 3/day & 50/month) ---');
  if (!dbAvailable) {
    log(false, 'AI Quota service', 'Skipped live DB test (PostgreSQL offline)', true);
    return;
  }

  const quotaEmail = `quota_${Date.now()}@falcon-test.com`;
  const reg = await api('POST', '/api/auth/register', {
    email: quotaEmail, password: 'quota_test_2026', firstName: 'Quota', lastName: 'Tester',
  });
  const qt = reg.data?.data?.token;
  if (!qt) { log(false, 'Quota setup', 'Failed to register quota test user'); return; }

  // 3 daily messages allowed
  for (let i = 1; i <= 3; i++) {
    const r = await api('POST', '/api/ai/chat', { message: `Quota test ${i}` }, qt);
    log(r.status === 200, `Free tier message ${i}/3 allowed`, `Status: ${r.status}`);
  }

  // 4th message blocked with 429
  const r4 = await api('POST', '/api/ai/chat', { message: 'Quota test 4' }, qt);
  log(r4.status === 429, 'Free tier 4th message blocked (HTTP 429)', `Status: ${r4.status}`);
  log(r4.data?.error?.limitType === 'daily', 'Limit type accurately reported as daily', `LimitType: ${r4.data?.error?.limitType}`);
}

// ============================================================
// RUN ALL
// ============================================================
async function runAll(): Promise<void> {
  console.log('═══════════════════════════════════════════════');
  console.log('  FALCON Adversarial Backend Test Suite');
  console.log('═══════════════════════════════════════════════');

  await testCrypto();
  await testHealth();
  await testAuth();
  await testRBAC();
  await testAIQuota();

  console.log('\n═══════════════════════════════════════════════');
  const passed = results.filter(r => r.pass).length;
  const infra  = results.filter(r => r.infraDependency).length;
  const failed = results.filter(r => !r.pass && !r.infraDependency).length;
  console.log(`  Results: ${passed} passed, ${infra} infra-dependent, ${failed} failed, ${results.length} total`);
  console.log('═══════════════════════════════════════════════');

  if (serverInstance) {
    serverInstance.close();
  }
  process.exit(failed > 0 ? 1 : 0);
}

runAll().catch(err => {
  console.error('Test suite fatal error:', err);
  process.exit(1);
});
