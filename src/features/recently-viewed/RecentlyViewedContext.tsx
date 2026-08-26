import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProduct, type Product } from '../../data/products';

type RecentlyViewedContextValue = {
  recentSlugs: string[];
  recentProducts: Product[];
  trackView: (slug: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | undefined>(undefined);
const STORAGE_KEY = 'falcon_recently_viewed';

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['obsidian-wool-coat', 'graphite-tailored-trousers'];
    } catch {
      return ['obsidian-wool-coat', 'graphite-tailored-trousers'];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSlugs));
  }, [recentSlugs]);

  const trackView = (slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 8); // keep last 8 items
    });
  };

  const recentProducts = recentSlugs.map((slug) => getProduct(slug)).filter(Boolean);

  return (
    <RecentlyViewedContext.Provider value={{ recentSlugs, recentProducts, trackView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
