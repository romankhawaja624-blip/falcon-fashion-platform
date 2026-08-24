export const routeManifest = {
  public: ['/', '/discover', '/shop', '/search', '/collections/women', '/product/:slug'],
  commerce: ['/cart', '/checkout', '/checkout/review', '/checkout/error', '/order-confirmed'],
  auth: ['/auth', '/sign-in', '/create-account', '/onboarding/style', '/admin/sign-in'],
  atelier: ['/atelier', '/atelier/wardrobe', '/atelier/wardrobe/intelligence', '/atelier/orders', '/atelier/membership', '/atelier/intelligence', '/atelier/notifications', '/atelier/settings', '/preferences'],
  ai: ['/stylist', '/stylist/builder', '/stylist/look/:slug', '/stylist/upgrade', '/assistant'],
  support: ['/help', '/support/ticket/:id', '/returns', '/legal', '/system-states'],
  admin: ['/admin', '/admin/products', '/admin/products/new', '/admin/inventory', '/admin/customers', '/admin/orders/:id', '/admin/support', '/admin/legal'],
} as const;