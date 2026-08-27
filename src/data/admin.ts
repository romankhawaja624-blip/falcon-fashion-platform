export const adminNav = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Add Product', to: '/admin/products/new' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Customers', to: '/admin/customers' },
  { label: 'Orders', to: '/admin/orders/FX-1048' },
  { label: 'Support', to: '/admin/support' },
  { label: 'Legal', to: '/admin/legal' },
];

export const adminProducts = [
  { sku: 'FX-OB-001', name: 'The Obsidian Wool Coat', category: 'Outerwear', stock: 24, status: 'In stock', price: '$1,480' },
  { sku: 'FX-OB-002', name: 'The Obsidian Silk Gown', category: 'Eveningwear', stock: 8, status: 'Low stock', price: '$2,240' },
  { sku: 'FX-OB-003', name: 'Architectural Blazer', category: 'Tailoring', stock: 0, status: 'Out of stock', price: '$1,250' },
];

export const adminCustomers = [
  { name: 'Alex Morgan', email: 'alex@example.com', tier: 'Premium', orders: 12, status: 'Active' },
  { name: 'Mina Park', email: 'mina@example.com', tier: 'Atelier', orders: 8, status: 'Active' },
  { name: 'Jon Bell', email: 'jon@example.com', tier: 'Standard', orders: 3, status: 'Review' },
];

export const supportTickets = [
  { id: 'SUP-2084', subject: 'Payment confirmation', customer: 'Alex Morgan', priority: 'Normal', status: 'Open' },
  { id: 'SUP-2081', subject: 'Sizing consultation', customer: 'Mina Park', priority: 'High', status: 'Assigned' },
  { id: 'SUP-2079', subject: 'Delivery update', customer: 'Jon Bell', priority: 'Normal', status: 'Resolved' },
];