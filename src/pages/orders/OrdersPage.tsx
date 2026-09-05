import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { useOrders } from '../../features/orders/OrderContext';

export function OrdersPage() {
  const { orders } = useOrders();

  return (
    <main className="flow-page orders-page container" aria-labelledby="orders-title">
      <div className="flow-heading">
        <p className="eyebrow">Your Account</p>
        <h1 id="orders-title" className="orders-page__title">
          Your orders
        </h1>
        <p className="orders-page__subtitle">
          Manage your commissions, track active shipments, and view past purchases.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => {
            const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <article
                key={order.id}
                className="order-card"
              >
                <div className="order-card__info">
                  <div className="order-card__top">
                    <span
                      className={`status-pill status-pill--${order.status}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <strong className="order-card__id">
                      {order.id}
                    </strong>
                  </div>
                  <h2 className="order-card__title">
                    Placed on {formattedDate}
                  </h2>
                  <div className="order-card__meta">
                    <p className="order-card__summary">
                      {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} &mdash; Total Amount: <strong>PKR {order.total.toLocaleString()}</strong>
                    </p>
                    {order.status === 'placed' && (
                      <span className="order-card__review-tag">
                        Payment Under Review
                      </span>
                    )}
                    {order.status === 'confirmed' && (
                      <span className="order-card__verified-tag">
                        Payment Verified &amp; Paid
                      </span>
                    )}
                  </div>
                </div>
                <div className="order-card__action">
                  <Link className="button button--secondary order-card__track-btn" to={`/orders/${order.id}`}>
                    Track Order <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="orders-empty-state">
          <div className="orders-empty-state__icon-wrap">
            <Package size={32} className="orders-empty-state__icon" aria-hidden="true" />
          </div>
          <p className="eyebrow">Atelier History</p>
          <h2 className="orders-empty-state__title">
            No orders found
          </h2>
          <p className="orders-empty-state__desc">
            Start building your collection and explore current edits.
          </p>
          <Link className="button button--primary" to="/shop">
            Explore Pieces <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      )}
    </main>
  );
}
