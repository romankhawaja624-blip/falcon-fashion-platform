import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckoutProgress } from '../../components/checkout/CheckoutProgress';
import { OrderSummary } from '../../components/checkout/OrderSummary';
import { PaymentForm } from '../../components/checkout/PaymentForm';
import { ShippingForm } from '../../components/checkout/ShippingForm';
import { useCart } from '../../features/cart/CartContext';
import { useCheckout, type CheckoutStep } from '../../features/checkout/CheckoutContext';
import { useOrders } from '../../features/orders/OrderContext';
import { useNotifications } from '../../features/notifications/NotificationContext';
import { useToast } from '../../features/toast/ToastContext';
import { Button } from '../../components/ui/Button';

function getStep(pathname: string): CheckoutStep {
  if (pathname.endsWith('/payment')) return 'payment';
  if (pathname.endsWith('/review')) return 'review';
  return 'shipping';
}

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { step, setStep, shipping, payment, selectedDelivery, resetCheckout } = useCheckout();
  const { createOrder } = useOrders();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routeStep = getStep(location.pathname);

  useEffect(() => {
    if (step !== routeStep) setStep(routeStep);
  }, [routeStep, setStep, step]);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (!items.length && !isSubmitting) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate, isSubmitting]);

  const submitOrder = async () => {
    if (!shipping || !payment) return;
    setIsSubmitting(true);
    try {
      // Create mock delay for realistic feel
      await new Promise((resolve) => setTimeout(resolve, 800));
      const order = createOrder(items, shipping, selectedDelivery);

      // Create notification
      addNotification({
        type: 'order',
        title: `Order #${order.id} placed`,
        body: `Thank you for your commission. Delivery expected: ${order.delivery.estimate}.`,
        timestamp: new Date().toISOString(),
      });

      showToast(`Order #${order.id} placed successfully`, 'success');

      clear();
      resetCheckout();
      navigate(`/checkout/success/${order.id}`);
    } catch {
      setIsSubmitting(false);
      showToast('There was an issue submitting your order.', 'error');
      navigate('/checkout/error');
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-header container">
        <Link className="wordmark" to="/">Falcon</Link>
        <span className="secure-label">Secure checkout</span>
      </header>
      <div className="checkout-layout container">
        <div className="checkout-main">
          <CheckoutProgress current={routeStep} />
          {routeStep === 'shipping' && (
            <section>
              <p className="eyebrow">01 / Delivery</p>
              <h1>Shipping information</h1>
              <ShippingForm />
            </section>
          )}
          {routeStep === 'payment' && (
            <section>
              <p className="eyebrow">02 / Payment</p>
              <h1>Payment information</h1>
              <PaymentForm />
            </section>
          )}
          {routeStep === 'review' && (
            <section>
              <p className="eyebrow">03 / Confirmation</p>
              <h1>Review your order</h1>
              <div className="review-panel" style={{ background: 'var(--color-surface-low)', border: '1px solid var(--color-outline-muted)', padding: '24px' }}>
                <p style={{ margin: '0 0 16px', lineHeight: '24px' }}>
                  Shipping to <strong>{shipping.firstName} {shipping.lastName}</strong> at {shipping.address}, {shipping.city}, {shipping.postalCode}.
                </p>
                <p style={{ margin: '0 0 24px', color: 'var(--color-text-muted)', lineHeight: '24px' }}>
                  Your payment method has been securely prepared. Click below to place your order.
                </p>
                <Button onClick={submitOrder} disabled={isSubmitting} style={{ width: '100%' }}>
                  {isSubmitting ? 'Placing order...' : 'Place order'}
                </Button>
              </div>
            </section>
          )}
        </div>
        <OrderSummary compact />
      </div>
    </main>
  );
}