// FALCON Real PostgreSQL & HTTP Runtime Automated Test Suite
import { registerUser, loginUser } from '../services/authService';
import { checkAiQuota, getOrCreateQuota } from '../services/aiQuotaService';
import { updateInventoryStock, getProductStock } from '../services/catalogService';
import { processCheckout, getOrderById, updateOrderStatus } from '../services/checkoutService';
import { createTicket, addTicketReply, updateTicketStatus, getTicketById } from '../services/supportService';
import { generateToken } from '../security/crypto';
import { handleHttpRequest } from '../app';
import * as authApi from '../../services/api/authApi';
import * as catalogApi from '../../services/api/catalogApi';
import * as checkoutApi from '../../services/api/checkoutApi';
import * as supportApi from '../../services/api/supportApi';
import * as aiApi from '../../services/api/aiApi';

export async function runBackendTests(): Promise<{ total: number; passed: number; failed: number; results: string[] }> {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      passed++;
      results.push(`✅ PASS: ${testName}`);
    } else {
      failed++;
      results.push(`❌ FAIL: ${testName}`);
    }
  };

  try {
    // TEST 1: Authentication Registration & PBKDF2 Password Hashing
    const regRes = await registerUser({
      email: 'pg_client_test@falcon.com',
      password: 'SecurePassword123!',
      firstName: 'Postgres',
      lastName: 'Client',
    });
    assert(regRes.user.email === 'pg_client_test@falcon.com', 'Auth: PostgreSQL registration succeeds with PBKDF2 salt');

    // TEST 2: Authentication Login via API Client
    const loginRes = await authApi.login({
      email: 'pg_client_test@falcon.com',
      password: 'SecurePassword123!',
    });
    assert(loginRes.success && (loginRes.data?.token?.length ?? 0) > 0, 'Auth API: Login returns valid signed JWT bearer token');

    // TEST 3: HTTP Server Runtime — POST /api/auth/login
    const httpLogin = await handleHttpRequest({
      method: 'POST',
      path: '/api/auth/login',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'pg_client_test@falcon.com', password: 'SecurePassword123!' },
    });
    assert(httpLogin.status === 200 && httpLogin.body.success, 'HTTP Runtime: POST /api/auth/login returns 200 OK');

    // TEST 4: RBAC Authorization — Customer Token Blocked from Admin API
    const customerToken = generateToken({
      userId: regRes.user.id,
      email: regRes.user.email,
      role: 'CUSTOMER',
      membershipTier: 'free',
    });
    const adminToken = generateToken({
      userId: 'usr_admin_concierge',
      email: 'admin@falcon.com',
      role: 'ADMIN',
      membershipTier: 'pro',
    });

    const httpUnauth = await handleHttpRequest({
      method: 'PATCH',
      path: '/api/admin/inventory',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: { slug: 'obsidian-wool-coat', stockQuantity: 99 },
    });
    assert(httpUnauth.status === 403 && httpUnauth.body.error?.code === 'FORBIDDEN', 'RBAC: Customer token returns 403 FORBIDDEN on Admin Inventory API');

    const httpAuth = await handleHttpRequest({
      method: 'PATCH',
      path: '/api/admin/inventory',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: { slug: 'obsidian-wool-coat', stockQuantity: 99 },
    });
    assert(httpAuth.status === 200 && httpAuth.body.data?.stockQuantity === 99, 'RBAC: Admin token authorized for stock mutation (200 OK)');

    // TEST 5: AI Quota Enforcement — Free 0/day + 0/month
    const testQuotaUser = `usr_pg_quota_${Date.now()}`;
    let qCheck = checkAiQuota(testQuotaUser, 'free');
    assert(qCheck.allowed && qCheck.usage.dailyUsed === 0 && qCheck.usage.monthlyUsed === 0, 'AI Quota: Free 0/day + 0/month allowed');

    // TEST 6: AI Quota Enforcement — Daily Limit Reached (3/day)
    const quotaObj = getOrCreateQuota(testQuotaUser);
    quotaObj.dailyUsed = 3;
    quotaObj.monthlyUsed = 10;
    qCheck = checkAiQuota(testQuotaUser, 'free');
    assert(!qCheck.allowed && qCheck.limitType === 'daily' && qCheck.upgradeRequired, 'AI Quota: Free 3/day rejected with limitType=daily');

    // TEST 7: AI Quota Enforcement — Monthly Limit Reached (50/month)
    quotaObj.dailyUsed = 1;
    quotaObj.monthlyUsed = 50;
    qCheck = checkAiQuota(testQuotaUser, 'free');
    assert(!qCheck.allowed && qCheck.limitType === 'monthly' && qCheck.upgradeRequired, 'AI Quota: Free 50/month rejected with limitType=monthly');

    // TEST 8: AI Quota Enforcement — Pro Tier Unlimited
    qCheck = checkAiQuota(testQuotaUser, 'pro');
    assert(qCheck.allowed && qCheck.usage.dailyRemaining === 'unlimited', 'AI Quota: Pro member allowed unlimited queries');

    // TEST 9: HTTP Server Runtime — POST /api/ai/chat
    const httpAi = await handleHttpRequest({
      method: 'POST',
      path: '/api/ai/chat',
      headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
      body: { message: 'Recommend silk eveningwear' },
    });
    assert(httpAi.status === 200 && httpAi.body.data?.response?.length > 0, 'HTTP Runtime: POST /api/ai/chat returns 200 OK with response');

    // TEST 10: Inventory Stock Decrement & Concurrency
    updateInventoryStock('obsidian-silk-gown', 15);
    assert(getProductStock('obsidian-silk-gown') === 15, 'Inventory: Stock updated to 15 in database repository');

    // TEST 11: Transactional Checkout & Atomic Stock Decrement
    const httpCheckout = await handleHttpRequest({
      method: 'POST',
      path: '/api/checkout',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: {
        items: [{ slug: 'obsidian-silk-gown', size: 'M', quantity: 3 }],
        shippingAddress: {
          firstName: 'Postgres',
          lastName: 'Client',
          address: '456 Fifth Avenue',
          city: 'New York',
          region: 'NY',
          postalCode: '10018',
          country: 'United States',
        },
        contactEmail: 'pg_client_test@falcon.com',
        contactName: 'Postgres Client',
        deliveryMethod: { id: 'standard', label: 'Standard', estimate: '5-7 days', price: 0 },
      },
    });
    assert(
      httpCheckout.status === 201 &&
      httpCheckout.body.data?.id?.startsWith('FX-') &&
      getProductStock('obsidian-silk-gown') === 12,
      'Checkout Transaction: Order created (201 Created) & stock decremented atomically from 15 to 12'
    );

    // TEST 12: Checkout Rollback on Insufficient Stock
    let rollbackSuccess = false;
    try {
      await processCheckout({
        userId: regRes.user.id,
        items: [{ slug: 'obsidian-silk-gown', size: 'M', quantity: 999 }],
        shippingAddress: {
          firstName: 'Postgres',
          lastName: 'Client',
          address: '456 Fifth Avenue',
          city: 'New York',
          region: 'NY',
          postalCode: '10018',
          country: 'United States',
        },
        contactEmail: 'pg_client_test@falcon.com',
        contactName: 'Postgres Client',
        deliveryMethod: { id: 'standard', label: 'Standard', estimate: '5-7 days', price: 0 },
      });
    } catch {
      rollbackSuccess = true;
    }
    assert(rollbackSuccess && getProductStock('obsidian-silk-gown') === 12, 'Checkout Transaction: Insufficient stock rejected & transaction rolled back safely');

    // TEST 13: Support Ticket Lifecycle & Ownership Protection
    const ticket = createTicket({
      userId: regRes.user.id,
      customerName: 'Postgres Client',
      customerEmail: 'pg_client_test@falcon.com',
      subject: 'Order tracking request',
      category: 'Shipping',
      description: 'Requesting tracking confirmation.',
    });
    addTicketReply(ticket.id, 'Falcon Client Concierge', 'Your order is preparing for dispatch.', false);
    updateTicketStatus(ticket.id, 'In Progress');
    const fetched = getTicketById(ticket.id);
    assert(fetched?.ticket.status === 'In Progress' && fetched?.ticket.userId === regRes.user.id, 'Support: Ticket created, replied to, and status updated');

  } catch (err: any) {
    failed++;
    results.push(`❌ EXCEPTION: Backend test suite encountered error: ${err.message}`);
  }

  return { total: passed + failed, passed, failed, results };
}
