import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from '../cart/CartContext';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export type DeliveryMethod = {
  id: string;
  label: string;
  estimate: string;
  price: number;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: 'standard', label: 'Standard Atelier Delivery', estimate: '5–7 business days', price: 0 },
  { id: 'express', label: 'Express Atelier Delivery', estimate: '2–3 business days', price: 35 },
];

export type Order = {
  id: string;
  date: string; // ISO string
  status: OrderStatus;
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
  delivery: DeliveryMethod;
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
};

type OrderContextValue = {
  orders: Order[];
  createOrder: (
    cartItems: CartItem[],
    shipping: Record<string, string>,
    delivery: DeliveryMethod
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = 'falcon_orders';

function generateOrderId(): string {
  return `FX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Order[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (
    cartItems: CartItem[],
    shipping: Record<string, string>,
    delivery: DeliveryMethod
  ): Order => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.priceValue * item.quantity,
      0
    );
    const order: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: 'placed',
      items: cartItems.map((item) => ({
        id: item.id,
        productSlug: item.product.slug,
        productName: item.product.name,
        category: item.product.category,
        imageId: item.product.imageIds[0],
        size: item.size,
        quantity: item.quantity,
        priceValue: item.product.priceValue,
      })),
      subtotal,
      shippingCost: delivery.price,
      total: subtotal + delivery.price,
      delivery,
      shippingAddress: {
        firstName: shipping.firstName ?? '',
        lastName: shipping.lastName ?? '',
        address: shipping.address ?? '',
        unit: shipping.unit,
        city: shipping.city ?? '',
        region: shipping.region ?? '',
        postalCode: shipping.postalCode ?? '',
        country: shipping.country ?? '',
      },
      contactEmail: shipping.email ?? '',
      contactName: `${shipping.firstName ?? ''} ${shipping.lastName ?? ''}`.trim(),
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const getOrderById = (id: string) => orders.find((o) => o.id === id);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const value = useContext(OrderContext);
  if (!value) throw new Error('useOrders must be used within OrderProvider');
  return value;
}
