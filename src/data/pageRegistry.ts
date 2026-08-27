// src/data/pageRegistry.ts

export type PageStatus = "draft" | "published" | "hidden";

export interface PageMeta {
  id: string; // unique identifier
  path: string; // router path, e.g. '/collections/women'
  title: string; // human readable title
  status: PageStatus;
  navVisible: boolean; // whether shown in navigation menus
}

export const pageRegistry: PageMeta[] = [
  // Public storefront pages
  { id: "home", path: "/", title: "Home", status: "published", navVisible: true },
  { id: "shop", path: "/shop", title: "Shop", status: "published", navVisible: true },
  { id: "discover", path: "/discover", title: "Discover", status: "published", navVisible: true },
  { id: "women-collection", path: "/collections/women", title: "Women Collection", status: "published", navVisible: true },
  { id: "men-collection", path: "/collections/men", title: "Men Collection", status: "published", navVisible: true },
  { id: "kids-collection", path: "/collections/kids", title: "Kids Collection", status: "published", navVisible: true },
  { id: "youngadults-collection", path: "/collections/youngadults", title: "Young Adults Collection", status: "published", navVisible: true },
  { id: "adults-collection", path: "/collections/adults", title: "Adults Collection", status: "published", navVisible: true },
  // Category landing (dynamic, placeholder entry for visibility control)
  { id: "category-landing", path: "/collections/:audience/:category", title: "Category", status: "published", navVisible: false },
  // Subcategory landing
  { id: "subcategory-landing", path: "/collections/:audience/:category/:subcategory", title: "Subcategory", status: "published", navVisible: false },
  // Product detail
  { id: "product-detail", path: "/product/:slug", title: "Product Detail", status: "published", navVisible: false },
  // Cart & checkout
  { id: "cart", path: "/cart", title: "Cart", status: "published", navVisible: true },
  { id: "checkout", path: "/checkout", title: "Checkout", status: "published", navVisible: false },
  // Orders & wishlist
  { id: "orders", path: "/orders", title: "Orders", status: "published", navVisible: true },
  { id: "order-tracking", path: "/orders/:orderId", title: "Order Tracking", status: "published", navVisible: false },
  { id: "wishlist", path: "/wishlist", title: "Wishlist", status: "published", navVisible: true },
  // Auth pages
  { id: "sign-in", path: "/sign-in", title: "Sign In", status: "published", navVisible: false },
  { id: "register", path: "/create-account", title: "Create Account", status: "published", navVisible: false },
  { id: "forgot-password", path: "/forgot-password", title: "Forgot Password", status: "published", navVisible: false },
  { id: "reset-password", path: "/reset-password/:token", title: "Reset Password", status: "published", navVisible: false },
  { id: "email-verification", path: "/verify-email", title: "Email Verification", status: "published", navVisible: false },
  // AI Clienteling & Styling Pages
  { id: "ai-assistant", path: "/assistant", title: "AI Assistant", status: "published", navVisible: true },
  { id: "ai-stylist", path: "/stylist", title: "Falcon AI Stylist", status: "published", navVisible: true },
  { id: "outfit-builder", path: "/stylist/builder", title: "Outfit Studio", status: "published", navVisible: true },
  { id: "curated-look", path: "/stylist/look/:slug", title: "Curated Look", status: "published", navVisible: false },
  // Customer Account & Atelier Pages
  { id: "account", path: "/account", title: "Account Dashboard", status: "published", navVisible: true },
  { id: "account-membership", path: "/account/membership", title: "Membership Tier", status: "published", navVisible: true },
  { id: "account-loyalty", path: "/account/loyalty", title: "Loyalty & Rewards", status: "published", navVisible: true },
  { id: "account-settings", path: "/account/settings", title: "Account Settings", status: "published", navVisible: true },
  { id: "atelier-dashboard", path: "/atelier", title: "My Atelier", status: "published", navVisible: true },
  { id: "atelier-wardrobe", path: "/atelier/wardrobe", title: "Digital Wardrobe", status: "published", navVisible: true },
  { id: "atelier-intelligence", path: "/atelier/intelligence", title: "Style Journey", status: "published", navVisible: true },
  { id: "atelier-settings", path: "/atelier/settings", title: "Atelier Settings", status: "published", navVisible: true },
  // Admin pages
  { id: "admin-overview", path: "/admin", title: "Admin Overview", status: "published", navVisible: false },
  { id: "admin-catalog", path: "/admin/products", title: "Admin Catalog", status: "published", navVisible: false },
  { id: "admin-product-new", path: "/admin/products/new", title: "Add Product", status: "published", navVisible: false },
  { id: "admin-inventory", path: "/admin/inventory", title: "Admin Inventory", status: "published", navVisible: false },
  { id: "admin-customers", path: "/admin/customers", title: "Admin Customers", status: "published", navVisible: false },
  { id: "admin-order", path: "/admin/orders/:id", title: "Admin Order Detail", status: "published", navVisible: false },
  { id: "admin-support", path: "/admin/support", title: "Admin Support", status: "published", navVisible: false },
  { id: "admin-legal", path: "/admin/legal", title: "Admin Legal", status: "published", navVisible: false },
];

export const getPageByPath = (path: string): PageMeta | undefined => {
  // 1. Try exact match
  const exact = pageRegistry.find((p) => p.path === path);
  if (exact) return exact;

  // 2. Try dynamic parameter pattern match
  return pageRegistry.find((p) => {
    if (!p.path.includes(':')) return false;
    const regexPattern = '^' + p.path.replace(/:[^\/]+/g, '[^/]+') + '$';
    return new RegExp(regexPattern).test(path);
  });
};

export const isPageVisible = (path: string): boolean => {
  const page = getPageByPath(path);
  return page ? page.status === "published" : true; // default true if unlisted route
};
