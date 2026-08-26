import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer, RotateCcw, ShieldCheck } from 'lucide-react';
import { useOrders, type OrderStatus } from '../../features/orders/OrderContext';
import { useCart } from '../../features/cart/CartContext';
import { useToast } from '../../features/toast/ToastContext';
import { getProduct, getProductStock } from '../../data/products';
import { RemoteImage } from '../../components/ui/RemoteImage';
import { Button } from '../../components/ui/Button';

const stages: { status: OrderStatus; label: string }[] = [
  { status: 'placed', label: 'Order placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'out_for_delivery', label: 'Out for delivery' },
  { status: 'delivered', label: 'Delivered' },
];

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <main className="tracking-page container" style={{ paddingBlock: '156px 120px', textAlign: 'center' }}>
        <p className="eyebrow">Tracking</p>
        <h1>Order not found</h1>
        <p style={{ margin: '24px auto', color: 'var(--color-text-muted)', maxWidth: '480px' }}>
          We couldn't find an order matching that identifier. Please check the URL or your order list.
        </p>
        <Link className="button button--primary" to="/shop">Return to shop</Link>
      </main>
    );
  }

  const currentStageIndex = stages.findIndex((s) => s.status === order.status);
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleReorderAll = () => {
    let addedCount = 0;
    let outOfStockCount = 0;

    order.items.forEach((item) => {
      const product = getProduct(item.productSlug);
      const stock = getProductStock(item.productSlug);

      if (stock > 0) {
        const res = addItem(product, item.size);
        if (res.success !== false) {
          addedCount += item.quantity;
        } else {
          outOfStockCount++;
        }
      } else {
        outOfStockCount++;
      }
    });

    if (addedCount > 0 && outOfStockCount === 0) {
      showToast(`All ${addedCount} pieces re-added to your cart`, 'success');
    } else if (addedCount > 0 && outOfStockCount > 0) {
      showToast(`Added ${addedCount} available pieces. ${outOfStockCount} item(s) out of stock.`, 'info');
    } else {
      showToast(`Items from this order are currently out of stock.`, 'error');
    }
  };

  return (
    <main className="tracking-page container" aria-labelledby="tracking-title" style={{ paddingBlock: '156px 120px' }}>
      <div className="flow-heading" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
        <div>
          <p className="eyebrow">Order / {order.id}</p>
          <h1 id="tracking-title" style={{ margin: '8px 0' }}>
            {order.status === 'delivered' ? 'Your order has been delivered.' : 'Your order is on its way.'}
          </h1>
          <p>Ordered on {formattedDate}. Estimated delivery: {order.delivery.estimate}.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }} className="no-print">
          <Button variant="secondary" onClick={handlePrintReceipt} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <Printer size={16} aria-hidden="true" />
            Print receipt
          </Button>
          <Button variant="primary" onClick={handleReorderAll} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
            <RotateCcw size={16} aria-hidden="true" />
            Reorder all pieces
          </Button>
        </div>
      </div>

      <section className="tracking-timeline no-print" aria-label="Order progress" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', margin: '64px 0', borderBlockStart: '1px solid var(--color-outline-muted)' }}>
        {stages.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          return (
            <div
              className={`tracking-stage ${isActive ? 'tracking-stage--active' : ''}`}
              key={stage.status}
              style={{
                borderBlockStart: `2px solid ${isActive ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                marginTop: '-2px',
                padding: '20px 12px',
                color: isActive ? 'var(--color-champagne)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '.08em',
              }}
            >
              <b style={{ display: 'block', marginBottom: '4px' }}>
                {String(index + 1).padStart(2, '0')}
              </b>
              <span>{stage.label}</span>
            </div>
          );
        })}
      </section>

      {/* Main Order Details & Printable Archival Receipt */}
      <section className="tracking-details printable-receipt" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBlock: '48px' }}>
        <div style={{ border: '1px solid var(--color-outline-muted)', padding: '28px', background: 'var(--color-surface-low)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Shipment & Client</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-champagne)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={14} aria-hidden="true" /> Certified Atelier Record
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, margin: '16px 0 12px' }}>
            {order.delivery.label}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '24px', margin: '0 0 20px' }}>
            Delivered via Falcon partner logistics to:
          </p>
          <address style={{ fontStyle: 'normal', color: 'var(--color-text)', fontSize: '15px', lineHeight: '24px' }}>
            <strong>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</strong><br />
            {order.shippingAddress.address}
            {order.shippingAddress.unit && `, ${order.shippingAddress.unit}`}<br />
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </address>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            Contact Email: {order.contactEmail}
          </p>
        </div>

        <div style={{ border: '1px solid var(--color-outline-muted)', padding: '28px', background: 'var(--color-surface-low)' }}>
          <p className="eyebrow">Itemized Invoice</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, margin: '16px 0 20px' }}>
            Archival Receipt
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {order.items.map((item) => (
              <div className="tracking-item" key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <RemoteImage assetId={item.imageId} />
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '16px', color: 'var(--color-text)' }}>{item.productName}</span>
                  <span style={{ display: 'block', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase' }}>
                    Size {item.size} / Qty {item.quantity}
                  </span>
                </div>
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 400 }}>
                  ${(item.priceValue * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-outline-muted)', marginTop: '24px', paddingTop: '16px', display: 'grid', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>${order.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Delivery ({order.delivery.label})</span>
              <span>{order.shippingCost === 0 ? 'Complimentary' : `$${order.shippingCost}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', borderTop: '1px solid var(--color-outline-muted)', paddingTop: '12px', marginTop: '4px' }}>
              <span>Total Paid</span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                ${order.total.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="no-print">
        <Link className="text-link" to="/orders">&larr; Back to all orders</Link>
        <span>/</span>
        <Link className="text-link" to="/shop">Continue shopping &rarr;</Link>
      </div>
    </main>
  );
}