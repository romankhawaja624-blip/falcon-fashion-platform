import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct, type Product } from '../../data/products';

export type CartItem = { id: string; product: Product; size: string; quantity: number };
type CartContextValue = { items: CartItem[]; itemCount: number; subtotal: number; shipping: number; total: number; addItem: (product: Product, size: string) => void; removeItem: (id: string) => void; updateQuantity: (id: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'falcon-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Array<{ id: string; slug: string; size: string; quantity: number }>;
      return saved.map((item) => ({ ...item, product: getProduct(item.slug) }));
    } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items.map(({ product, ...item }) => ({ ...item, slug: product.slug })))); }, [items]);
  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.priceValue * item.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 1500 ? 0 : 25;
    return { items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), subtotal, shipping, total: subtotal + shipping, addItem: (product: Product, size: string) => setItems((current) => { const id = `${product.slug}-${size}`; const existing = current.find((item) => item.id === id); return existing ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id, product, size, quantity: 1 }]; }), removeItem: (id: string) => setItems((current) => current.filter((item) => item.id !== id)), updateQuantity: (id: string, quantity: number) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item)), clear: () => setItems([]) };
  }, [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used within CartProvider'); return value; }