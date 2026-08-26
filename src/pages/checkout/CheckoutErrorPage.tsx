import { Link } from 'react-router-dom';

export function CheckoutErrorPage() {
  return (
    <main className="error-page container" aria-labelledby="error-title">
      <p className="eyebrow">Checkout / Attention</p>
      <h1 id="error-title">We couldn&apos;t complete that payment.</h1>
      <p>
        Your order has not been placed. Return to payment and try another method, or revisit your cart.
      </p>
      <div className="error-page__actions">
        <Link className="button button--primary" to="/checkout/payment">
          Try payment again
        </Link>
        <Link className="button button--secondary" to="/checkout/payment">
          Change payment method
        </Link>
        <Link className="text-link" to="/cart" style={{ marginInlineStart: '8px' }}>
          Return to cart &rarr;
        </Link>
      </div>
    </main>
  );
}