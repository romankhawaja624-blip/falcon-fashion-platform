// FALCON Development Seed Script
// Idempotent: uses ON CONFLICT DO NOTHING so re-running never corrupts data
// All demo accounts are clearly marked as development-only

import { PoolClient } from 'pg';
import { withTransaction } from './pool';
import { hashPassword } from '../security/crypto';

const DEMO_PRODUCTS = [
  { slug: 'obsidian-wool-coat',    name: 'Obsidian Wool Coat',    price: 1495, stock: 24, category: 'Outerwear',   imageId: 'obsidian-wool-coat' },
  { slug: 'charcoal-blazer',       name: 'Charcoal Blazer',       price: 1250, stock: 0,  category: 'Tailoring',   imageId: 'charcoal-blazer' },
  { slug: 'obsidian-silk-gown',    name: 'Obsidian Silk Gown',    price: 2895, stock: 8,  category: 'Evening',     imageId: 'obsidian-silk-gown' },
  { slug: 'graphite-trousers',     name: 'Graphite Trousers',     price: 650,  stock: 15, category: 'Tailoring',   imageId: 'graphite-trousers' },
  { slug: 'ivory-linen-shirt',     name: 'Ivory Linen Shirt',     price: 485,  stock: 20, category: 'Shirts',      imageId: 'ivory-linen-shirt' },
  { slug: 'midnight-turtleneck',   name: 'Midnight Turtleneck',   price: 725,  stock: 12, category: 'Knitwear',    imageId: 'midnight-turtleneck' },
  { slug: 'slate-chelsea-boots',   name: 'Slate Chelsea Boots',   price: 895,  stock: 9,  category: 'Footwear',    imageId: 'slate-chelsea-boots' },
  { slug: 'bone-cashmere-sweater', name: 'Bone Cashmere Sweater', price: 1150, stock: 7,  category: 'Knitwear',    imageId: 'bone-cashmere-sweater' },
];

export async function seedDatabase(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);

  await withTransaction(async (client: PoolClient) => {
    // --- Demo Customer: alex@example.com (development-only) ---
    const { hash: alexHash, salt: alexSalt } = hashPassword('falcon_demo_2026');
    await client.query(
      `INSERT INTO users (id, email, password_hash, salt, first_name, last_name, membership_tier, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (email) DO NOTHING`,
      ['usr_customer_alex', 'alex@example.com', alexHash, alexSalt, 'Alex', 'Morgan', 'free', 'CUSTOMER', true]
    );

    await client.query(
      `INSERT INTO user_profiles (user_id, atelier_id, aesthetic, palette, outerwear_size, tailoring_size, footwear_size, currency, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO NOTHING`,
      ['usr_customer_alex', 'FX-MBR-8492', 'Quiet structure', 'Monochrome', 'M (Medium)', '38R / EU 48', '39 EU / 8.5 US', 'USD ($)', 'Global Express']
    );

    await client.query(
      `INSERT INTO ai_quotas (user_id, daily_used, monthly_used, daily_reset_date, monthly_reset_date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO NOTHING`,
      ['usr_customer_alex', 1, 8, today, month]
    );

    await client.query(
      `INSERT INTO loyalty_accounts (user_id, xp, coins, level_label)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO NOTHING`,
      ['usr_customer_alex', 1840, 320, 'Level 04']
    );

    // --- Demo Admin: admin@falcon.com (development-only) ---
    const { hash: adminHash, salt: adminSalt } = hashPassword('falcon_admin_2026');
    await client.query(
      `INSERT INTO users (id, email, password_hash, salt, first_name, last_name, membership_tier, role, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (email) DO NOTHING`,
      ['usr_admin_concierge', 'admin@falcon.com', adminHash, adminSalt, 'Atelier', 'Director', 'pro', 'ADMIN', true]
    );

    await client.query(
      `INSERT INTO user_profiles (user_id, atelier_id, aesthetic, palette, outerwear_size, tailoring_size, footwear_size, currency, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO NOTHING`,
      ['usr_admin_concierge', 'FX-ADM-0001', 'Architectural minimalism', 'Monochrome', 'L (Large)', '40R / EU 50', '42 EU / 9.5 US', 'USD ($)', 'Global Express']
    );

    // --- Product Inventory (with server-authoritative prices) ---
    for (const product of DEMO_PRODUCTS) {
      await client.query(
        `INSERT INTO inventory (product_id, slug, name, price_value, price_currency, category, image_id, stock_quantity, low_stock_threshold)
         VALUES ($1, $2, $3, $4, 'USD', $5, $6, $7, 10)
         ON CONFLICT (slug) DO NOTHING`,
        [product.slug, product.slug, product.name, product.price, product.category, product.imageId, product.stock]
      );
    }

    // --- Demo Support Ticket ---
    await client.query(
      `INSERT INTO support_tickets (id, user_id, customer_name, customer_email, subject, category, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      ['SUP-1001', 'usr_customer_alex', 'Alex Morgan', 'alex@example.com', 'Order confirmation request', 'Order', 'Normal', 'Open']
    );

    await client.query(
      `INSERT INTO ticket_messages (id, ticket_id, sender, text, is_customer)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      ['msg-SUP-1001-1', 'SUP-1001', 'Falcon Client Concierge', 'Inquiry received. Reviewing your order details.', false]
    );
  });

  console.log('[FALCON DB] Development seed data applied successfully.');
}
