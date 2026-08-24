import { Link } from 'react-router-dom';
import { useCart } from '../../features/cart/CartContext';
import { RemoteImage } from '../ui/RemoteImage';

export function OrderSummary({ compact = false }: { compact?: boolean }) {
  const { items, subtotal, shipping, total } = useCart();
  return <aside className={`order-summary ${compact ? 'order-summary--compact' : ''}`} aria-labelledby="summary-title"><div className="order-summary__heading"><h2 id="summary-title">Order summary</h2><span>{items.length} {items.length === 1 ? 'piece' : 'pieces'}</span></div><div className="order-summary__items">{items.map((item) => <div className="order-summary__item" key={item.id}><RemoteImage assetId={item.product.imageIds[0]} /><div><p>{item.product.name}</p><span>Size {item.size} / Qty {item.quantity}</span></div><strong>${(item.product.priceValue * item.quantity).toLocaleString()}</strong></div>)}</div><div className="order-summary__totals"><p><span>Subtotal</span><strong>${subtotal.toLocaleString()}</strong></p><p><span>Shipping</span><strong>{shipping ? `$${shipping}` : 'Complimentary'}</strong></p><p className="order-summary__total"><span>Total</span><strong>${total.toLocaleString()}</strong></p></div>{!compact && <Link className="text-link" to="/shop">Continue shopping</Link>}</aside>;
}