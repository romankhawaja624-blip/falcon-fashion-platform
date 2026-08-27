import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrders, type OrderStatus } from '../../features/orders/OrderContext';
import { OrderTimeline } from '../../components/admin/OrderTimeline';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { ArrowLeft, RefreshCw, Truck, ShieldCheck, Mail, ExternalLink, Package } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

export function AdminOrderPage() {
  const { id = 'FX-1048' } = useParams();
  const { orders, getOrderById, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const realOrder = getOrderById(id);

  // Fallback demo order if ID is FX-1048 or not found in real store orders
  const order = realOrder ?? {
    id: 'FX-1048',
    date: '2026-08-24T10:30:00.000Z',
    status: 'preparing' as OrderStatus,
    items: [
      {
        id: 'item-1',
        productSlug: 'obsidian-wool-coat',
        productName: 'The Obsidian Wool Coat',
        category: 'Outerwear',
        imageId: 'obsidian-wool-coat-main',
        size: 'M',
        quantity: 1,
        priceValue: 1480,
      },
    ],
    subtotal: 1480,
    shippingCost: 0,
    total: 1480,
    delivery: {
      id: 'express',
      label: 'Express Atelier Delivery',
      estimate: '2–3 business days',
      price: 0,
    },
    shippingAddress: {
      firstName: 'Alex',
      lastName: 'Morgan',
      address: '740 Park Avenue',
      unit: 'Apt 12B',
      city: 'New York',
      region: 'NY',
      postalCode: '10021',
      country: 'United States',
    },
    contactEmail: 'alex@example.com',
    contactName: 'Alex Morgan',
  };

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    if (realOrder) {
      updateOrderStatus(realOrder.id, newStatus);
    }
    showToast(`Order ${order.id} status updated to "${newStatus}"`, 'success');
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'placed', label: 'Order Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing in Atelier' },
    { value: 'shipped', label: 'Dispatched / Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Order Management / {order.id}
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Fulfillment Details
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Inspect client purchase, itemized invoice, and update fulfillment progress.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="text-link" to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
        </div>
      </header>

      {/* Order Selector Header Bar */}
      {orders.length > 0 && (
        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Storefront Placed Orders ({orders.length}):</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  border: `1px solid ${o.id === order.id ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                  background: o.id === order.id ? 'var(--color-champagne)' : 'var(--color-surface-low, #1c1c1f)',
                  color: o.id === order.id ? '#000' : 'var(--color-text)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  textDecoration: 'none',
                }}
              >
                {o.id}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Banner */}
      <section style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Fulfillment Controls</span>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0.25rem 0' }}>
            Current Status: <span style={{ color: 'var(--color-champagne)', textTransform: 'capitalize' }}>{currentStatus.replace(/_/g, ' ')}</span>
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Advance Status:</span>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            aria-label="Update order status"
            style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-champagne)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="admin-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <article className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Client Record</p>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>{order.contactName}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
            {order.contactEmail}<br />
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem' }}>Atelier Registered Client</span>
          </p>
          <Link className="button button--secondary" to="/admin/support" style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={14} /> Open Support Desk
          </Link>
        </article>

        <article className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Shipping Destination</p>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>{order.delivery.label}</h2>
          <address style={{ fontStyle: 'normal', color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
            {order.shippingAddress.address} {order.shippingAddress.unit && `, ${order.shippingAddress.unit}`}<br />
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </address>
        </article>

        <article className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Financial Summary</p>
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '0.25rem 0' }}>
            ${order.total.toLocaleString()}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Subtotal: ${order.subtotal.toLocaleString()}<br />
            Shipping: {order.shippingCost === 0 ? 'Complimentary' : `$${order.shippingCost}`}<br />
            Payment Status: <strong style={{ color: '#28a745' }}>Paid in Full</strong>
          </p>
        </article>
      </section>

      {/* Itemized Order Line Items */}
      <section style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: '0 0 0.5rem 0' }}>Itemized Manifest</p>
        <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0 0 1rem 0' }}>
          Ordered Silhouettes ({order.items.length})
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '60px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                  <RemoteImage assetId={item.imageId} alt={item.productName} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{item.productName}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Category: {item.category} / Size: <strong>{item.size}</strong> / Qty: <strong>{item.quantity}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1.1rem' }}>
                  ${(item.priceValue * item.quantity).toLocaleString()}
                </span>
                <Link className="text-link" to={`/product/${item.productSlug}`} style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  View PDP <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fulfillment Progress Bar */}
      <section className="admin-panel" style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem' }}>
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>Fulfillment Timeline</p>
        <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0.25rem 0 1.5rem 0' }}>
          Atelier Delivery Progress
        </h3>
        <OrderTimeline />
      </section>
    </div>
  );
}