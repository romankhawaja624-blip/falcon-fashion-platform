import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProduct, type Product } from '../../data/products';

type WishlistContextValue = {
  wishlistSlugs: string[];
  wishlistItems: Product[];
  toggleWishlist: (slug: string) => boolean;
  isInWishlist: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = 'falcon_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['obsidian-silk-gown'];
    } catch {
      return ['obsidian-silk-gown'];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistSlugs));
  }, [wishlistSlugs]);

  const toggleWishlist = (slug: string): boolean => {
    let isAdded = false;
    setWishlistSlugs((prev) => {
      if (prev.includes(slug)) {
        isAdded = false;
        return prev.filter((s) => s !== slug);
      } else {
        isAdded = true;
        return [slug, ...prev];
      }
    });
    return isAdded;
  };

  const isInWishlist = (slug: string) => wishlistSlugs.includes(slug);

  const removeFromWishlist = (slug: string) => {
    setWishlistSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const clearWishlist = () => setWishlistSlugs([]);

  const wishlistItems = wishlistSlugs.map((slug) => getProduct(slug)).filter(Boolean);

  return (
    <WishlistContext.Provider
      value={{
        wishlistSlugs,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
