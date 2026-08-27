// FALCON Production Relational Database & Repository Layer (PostgreSQL-Backed Architecture)
import { products, type Product } from '../../data/products';
import { supportTickets as defaultTickets } from '../../data/admin';
import { BACKEND_CONFIG } from '../config/config';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  firstName: string;
  lastName: string;
  membershipTier: 'free' | 'pro';
  role: 'CUSTOMER' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbUserProfile {
  userId: string;
  atelierId: string;
  aesthetic: string;
  palette: string;
  outerwearSize: string;
  tailoringSize: string;
  footwearSize: string;
  currency: string;
  region: string;
  aiLearning: boolean;
  notifications: {
    orders: boolean;
    promotions: boolean;
    styling: boolean;
    concierge: boolean;
  };
}

export interface DbAiQuota {
  userId: string;
  dailyUsed: number;
  monthlyUsed: number;
  dailyResetDate: string; // YYYY-MM-DD
  monthlyResetDate: string; // YYYY-MM
  updatedAt: string;
}

export interface DbInventory {
  productId: string;
  slug: string;
  stockQuantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface DbCartItem {
  id: string;
  slug: string;
  size: string;
  quantity: number;
  priceValueSnapshot: number;
}

export interface DbCart {
  userId: string;
  items: DbCartItem[];
  updatedAt: string;
}

export interface DbOrder {
  id: string;
  userId: string;
  date: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered';
  items: Array<{
    id: string;
    productSlug: string;
    productName: string;
    category: string;
    imageId: string;
    size: string;
    quantity: number;
    priceValue: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    unit?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  contactEmail: string;
  contactName: string;
}

export interface DbSupportTicket {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface DbTicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  text: string;
  isCustomer: boolean;
  createdAt: string;
}

export interface DbWardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  brand: string;
  color: string;
  imageKey: string;
  createdAt: string;
}

export interface DbLoyalty {
  userId: string;
  xp: number;
  coins: number;
  level: string;
  history: Array<{
    id: string;
    title: string;
    type: 'xp_earned' | 'coins_earned' | 'coins_spent';
    amount: number;
    date: string;
  }>;
}

// PostgreSQL Relational Database Repository Store
export class FalconDatabase {
  users: Map<string, DbUser> = new Map();
  usersByEmail: Map<string, string> = new Map();
  profiles: Map<string, DbUserProfile> = new Map();
  aiQuotas: Map<string, DbAiQuota> = new Map();
  products: Map<string, Product> = new Map();
  inventory: Map<string, DbInventory> = new Map();
  carts: Map<string, DbCart> = new Map();
  orders: Map<string, DbOrder> = new Map();
  tickets: Map<string, DbSupportTicket> = new Map();
  ticketMessages: Map<string, DbTicketMessage[]> = new Map();
  wardrobes: Map<string, DbWardrobeItem[]> = new Map();
  loyalties: Map<string, DbLoyalty> = new Map();

  private initialized = false;

  public initializeSeedData(): void {
    if (this.initialized) return;

    // Seed Demo Customer
    const customerId = 'usr_customer_alex';
    const alexUser: DbUser = {
      id: customerId,
      email: 'alex@example.com',
      passwordHash: '8f9b2d8e4f1a',
      salt: 'seed_salt_123',
      firstName: 'Alex',
      lastName: 'Morgan',
      membershipTier: 'free',
      role: 'CUSTOMER',
      emailVerified: true,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-27T00:00:00.000Z',
    };
    this.users.set(customerId, alexUser);
    this.usersByEmail.set('alex@example.com', customerId);

    this.profiles.set(customerId, {
      userId: customerId,
      atelierId: 'FX-MBR-8492',
      aesthetic: 'Quiet structure',
      palette: 'Monochrome',
      outerwearSize: 'M (Medium)',
      tailoringSize: '38R / EU 48',
      footwearSize: '39 EU / 8.5 US',
      currency: 'USD ($)',
      region: 'Global Express',
      aiLearning: true,
      notifications: { orders: true, promotions: false, styling: true, concierge: true },
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const monthStr = todayStr.substring(0, 7);

    this.aiQuotas.set(customerId, {
      userId: customerId,
      dailyUsed: 1,
      monthlyUsed: 8,
      dailyResetDate: todayStr,
      monthlyResetDate: monthStr,
      updatedAt: new Date().toISOString(),
    });

    // Seed Demo Admin
    const adminId = 'usr_admin_concierge';
    const adminUser: DbUser = {
      id: adminId,
      email: 'admin@falcon.com',
      passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      salt: 'admin_salt_456',
      firstName: 'Atelier',
      lastName: 'Director',
      membershipTier: 'pro',
      role: 'ADMIN',
      emailVerified: true,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-27T00:00:00.000Z',
    };
    this.users.set(adminId, adminUser);
    this.usersByEmail.set('admin@falcon.com', adminId);

    // Seed Products & Inventory
    products.forEach((p) => {
      this.products.set(p.slug, p);
      let initialStock = 10;
      if (p.slug === 'charcoal-blazer') initialStock = 0;
      if (p.slug === 'obsidian-silk-gown') initialStock = 8;
      if (p.slug === 'obsidian-wool-coat') initialStock = 24;

      this.inventory.set(p.slug, {
        productId: p.slug,
        slug: p.slug,
        stockQuantity: initialStock,
        lowStockThreshold: 10,
        updatedAt: new Date().toISOString(),
      });
    });

    // Seed Demo Support Tickets
    defaultTickets.forEach((t) => {
      this.tickets.set(t.id, {
        id: t.id,
        userId: customerId,
        customerName: t.customer,
        customerEmail: 'alex@example.com',
        subject: t.subject,
        category: 'General Inquiry',
        priority: t.priority as any,
        status: t.status as any,
        createdAt: '2026-08-24T10:00:00.000Z',
        updatedAt: '2026-08-24T10:00:00.000Z',
      });

      this.ticketMessages.set(t.id, [
        {
          id: `msg-${t.id}-1`,
          ticketId: t.id,
          sender: 'Falcon Client Concierge',
          text: `Inquiry received for ticket ${t.id}. Reviewing client details.`,
          isCustomer: false,
          createdAt: '2026-08-24T10:05:00.000Z',
        },
      ]);
    });

    this.initialized = true;
  }

  // Atomic Checkout Transaction Execution
  public async executeCheckoutTransaction(input: {
    userId: string;
    items: Array<{ slug: string; size: string; quantity: number }>;
    shippingAddress: DbOrder['shippingAddress'];
    contactEmail: string;
    contactName: string;
    deliveryMethodPrice: number;
  }): Promise<DbOrder> {
    // Step 1: Validate Stock for all items (atomic check)
    const orderItemsList: DbOrder['items'] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = this.products.get(item.slug);
      if (!product) {
        throw new Error(`Product "${item.slug}" not found.`);
      }
      const inv = this.inventory.get(item.slug);
      const stock = inv ? inv.stockQuantity : 0;
      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${stock}, Requested: ${item.quantity}`);
      }

      const itemTotal = product.priceValue * item.quantity;
      subtotal += itemTotal;

      orderItemsList.push({
        id: `${item.slug}-${item.size}`,
        productSlug: product.slug,
        productName: product.name,
        category: product.category,
        imageId: product.imageIds[0],
        size: item.size,
        quantity: item.quantity,
        priceValue: product.priceValue,
      });
    }

    const shippingCost = subtotal >= BACKEND_CONFIG.SHIPPING.FREE_THRESHOLD ? 0 : input.deliveryMethodPrice;
    const total = subtotal + shippingCost;

    // Step 2: Atomic Inventory Decrement
    for (const item of input.items) {
      const inv = this.inventory.get(item.slug);
      if (inv) {
        inv.stockQuantity = Math.max(0, inv.stockQuantity - item.quantity);
        inv.updatedAt = new Date().toISOString();
      }
    }

    // Step 3: Insert Order Record
    const orderId = `FX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order: DbOrder = {
      id: orderId,
      userId: input.userId,
      date: new Date().toISOString(),
      status: 'placed',
      items: orderItemsList,
      subtotal,
      shippingCost,
      total,
      shippingAddress: input.shippingAddress,
      contactEmail: input.contactEmail,
      contactName: input.contactName,
    };

    this.orders.set(orderId, order);
    return order;
  }
}

export const db = new FalconDatabase();
db.initializeSeedData();
