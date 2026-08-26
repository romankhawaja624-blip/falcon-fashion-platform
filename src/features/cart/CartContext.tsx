import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct, getProductStock, type Product } from '../../data/products';

export type CartItem = {
  id: string;
  product: Product;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (product: Product, size: string) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => { success: boolean; message?: string };
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'falcon-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Array<{
        id: string;
        slug: string;
        size: string;
        quantity: number;
      }>;
      return saved.map((item) => ({ ...item, product: getProduct(item.slug) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(items.map(({ product, ...item }) => ({ ...item, slug: product.slug })))
    );
  }, [items]);

  const addItem = (product: Product, size: string) => {
    const stock = getProductStock(product.slug);
    if (stock <= 0) {
      return { success: false, message: 'This piece is currently out of stock.' };
    }

    const id = `${product.slug}-${size}`;
    let success = true;
    let message = '';

    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        if (existing.quantity >= stock) {
          success = false;
          message = `Cannot add more. Only ${stock} units are available.`;
          return current;
        }
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { id, product, size, quantity: 1 }];
    });

    return { success, message: success ? undefined : message };
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.id !== id));
      return { success: true };
    }

    const item = items.find((i) => i.id === id);
    if (!item) return { success: false, message: 'Item not found in cart.' };

    const stock = getProductStock(item.product.slug);
    if (quantity > stock) {
      setItems((current) =>
        current.map((i) => (i.id === id ? { ...i, quantity: stock } : i))
      );
      return {
        success: false,
        message: `Quantity capped at available stock of ${stock} units.`,
      };
    }

    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const clear = () => setItems([]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 25;
    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}