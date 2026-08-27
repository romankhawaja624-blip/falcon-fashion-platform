// FALCON Checkout & Order Abstraction Backend Service
import { db, type DbOrder } from '../database/db';

export interface PaymentProvider {
  processPayment(amount: number, details: Record<string, string>): Promise<{ success: boolean; transactionId: string }>;
}

export class MockPaymentProvider implements PaymentProvider {
  async processPayment(amount: number): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };
  }
}

const paymentProvider: PaymentProvider = new MockPaymentProvider();

export async function processCheckout(input: {
  userId: string;
  items: Array<{ slug: string; size: string; quantity: number }>;
  shippingAddress: DbOrder['shippingAddress'];
  contactEmail: string;
  contactName: string;
  deliveryMethod: { id: string; label: string; estimate: string; price: number };
}): Promise<DbOrder> {
  if (!input.items || input.items.length === 0) {
    throw new Error('Cannot process checkout with an empty bag.');
  }

  // Execute Atomic Transaction: Validate stock -> Price snapshot -> Order creation -> Decrement stock
  const order = await db.executeCheckoutTransaction({
    userId: input.userId,
    items: input.items,
    shippingAddress: input.shippingAddress,
    contactEmail: input.contactEmail,
    contactName: input.contactName,
    deliveryMethodPrice: input.deliveryMethod.price,
  });

  // Process Payment
  const paymentResult = await paymentProvider.processPayment(order.total, {});
  if (!paymentResult.success) {
    throw new Error('Payment processing failed. Transaction rolled back.');
  }

  return order;
}

export function getOrderById(orderId: string): DbOrder | null {
  return db.orders.get(orderId) ?? null;
}

export function updateOrderStatus(orderId: string, status: DbOrder['status']): DbOrder {
  const order = db.orders.get(orderId);
  if (!order) {
    throw new Error(`Order "${orderId}" not found.`);
  }
  order.status = status;
  return order;
}
