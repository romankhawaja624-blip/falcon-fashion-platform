-- FALCON Production PostgreSQL Relational Schema Definition
-- Includes Primary Keys, Foreign Keys, Indexes, Constraints, and Atomic Triggers

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  membership_tier VARCHAR(32) NOT NULL DEFAULT 'free' CHECK (membership_tier IN ('free', 'pro')),
  role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  atelier_id VARCHAR(64) NOT NULL,
  aesthetic VARCHAR(128) NOT NULL DEFAULT 'Quiet structure',
  palette VARCHAR(128) NOT NULL DEFAULT 'Monochrome',
  outerwear_size VARCHAR(64) NOT NULL DEFAULT 'M (Medium)',
  tailoring_size VARCHAR(64) NOT NULL DEFAULT '38R / EU 48',
  footwear_size VARCHAR(64) NOT NULL DEFAULT '39 EU / 8.5 US',
  currency VARCHAR(32) NOT NULL DEFAULT 'USD ($)',
  region VARCHAR(128) NOT NULL DEFAULT 'Global Express',
  ai_learning BOOLEAN NOT NULL DEFAULT TRUE,
  notifications_json JSONB NOT NULL DEFAULT '{"orders": true, "promotions": false, "styling": true, "concierge": true}'::jsonb
);

-- 3. AI Quotas Table
CREATE TABLE IF NOT EXISTS ai_quotas (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_used INT NOT NULL DEFAULT 0 CHECK (daily_used >= 0),
  monthly_used INT NOT NULL DEFAULT 0 CHECK (monthly_used >= 0),
  daily_reset_date VARCHAR(10) NOT NULL,
  monthly_reset_date VARCHAR(7) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  product_id VARCHAR(128) PRIMARY KEY,
  slug VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL DEFAULT '',
  price_value NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price_value >= 0),
  price_currency VARCHAR(8) NOT NULL DEFAULT 'USD',
  category VARCHAR(128) NOT NULL DEFAULT '',
  image_id VARCHAR(255) NOT NULL DEFAULT '',
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 10,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_slug ON inventory(slug);

-- 4b. Carts Table (server-side cart persistence)
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_slug VARCHAR(128) NOT NULL,
  size VARCHAR(64) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_slug, size)
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered')),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(10, 2) NOT NULL CHECK (shipping_cost >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address_json JSONB NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(128) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug VARCHAR(128) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  image_id VARCHAR(255) NOT NULL,
  size VARCHAR(64) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_value NUMERIC(10, 2) NOT NULL CHECK (price_value >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 7. Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'Normal' CHECK (priority IN ('High', 'Normal', 'Low')),
  status VARCHAR(32) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);

-- 8. Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id VARCHAR(128) PRIMARY KEY,
  ticket_id VARCHAR(64) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  is_customer BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- 9. Loyalty Accounts Table
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INT NOT NULL DEFAULT 0 CHECK (xp >= 0),
  coins INT NOT NULL DEFAULT 0 CHECK (coins >= 0),
  level_label VARCHAR(64) NOT NULL DEFAULT 'Level 01',
  history_json JSONB NOT NULL DEFAULT '[]'::jsonb
);
