import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../features/checkout/CheckoutContext';
import { Button } from '../ui/Button';

function validateCardNumber(num: string) {
  const sanitized = num.replace(/\s+/g, '');
  return /^\d{13,19}$/.test(sanitized);
}

function validateExpiration(exp: string) {
  const sanitized = exp.replace(/\s+/g, '');
  if (!/^\d{4}$|^\d{2}\/\d{2}$/.test(sanitized)) return false;
  const parts = sanitized.split('/');
  let month = 0, year = 0;
  if (parts.length === 2) {
    month = parseInt(parts[0], 10);
    year = parseInt(parts[1], 10) + 2000;
  } else {
    month = parseInt(sanitized.slice(0, 2), 10);
    year = parseInt(sanitized.slice(2, 4), 10) + 2000;
  }
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

function validateCVC(cvc: string) {
  const sanitized = cvc.replace(/\s+/g, '');
  return /^\d{3,4}$/.test(sanitized);
}

export function PaymentForm() {
  const { payment, setPayment, setStep } = useCheckout();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    if (!data.cardholder) errs.cardholder = 'Cardholder name is required.';
    if (!data.cardNumber) {
      errs.cardNumber = 'Card number is required.';
    } else if (!validateCardNumber(data.cardNumber)) {
      errs.cardNumber = 'Card number must be between 13 and 19 digits.';
    }
    if (!data.expiration) {
      errs.expiration = 'Expiration date is required.';
    } else if (!validateExpiration(data.expiration)) {
      errs.expiration = 'Invalid expiration date (use MM / YY).';
    }
    if (!data.securityCode) {
      errs.securityCode = 'Security code is required.';
    } else if (!validateCVC(data.securityCode)) {
      errs.securityCode = 'CVC must be 3 or 4 digits.';
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setPayment(data);
      setStep('review');
      navigate('/checkout/review');
    }
  };

  return (
    <form className="checkout-form" onSubmit={submit} noValidate>
      <p className="security-note">Secure payment details are used for this prototype only and are never stored.</p>
      <div className="form-grid">
        <label className="form-field form-field--wide">
          <span>Cardholder name *</span>
          <input
            name="cardholder"
            defaultValue={payment.cardholder}
            autoComplete="cc-name"
            required
            aria-invalid={!!errors.cardholder}
          />
          {errors.cardholder && <small style={{ color: 'var(--color-error)' }} role="alert">{errors.cardholder}</small>}
        </label>
        <label className="form-field form-field--wide">
          <span>Card number *</span>
          <input
            name="cardNumber"
            defaultValue={payment.cardNumber}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            required
            aria-invalid={!!errors.cardNumber}
          />
          {errors.cardNumber && <small style={{ color: 'var(--color-error)' }} role="alert">{errors.cardNumber}</small>}
        </label>
        <label className="form-field">
          <span>Expiration *</span>
          <input
            name="expiration"
            defaultValue={payment.expiration}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            required
            aria-invalid={!!errors.expiration}
          />
          {errors.expiration && <small style={{ color: 'var(--color-error)' }} role="alert">{errors.expiration}</small>}
        </label>
        <label className="form-field">
          <span>Security code *</span>
          <input
            name="securityCode"
            defaultValue={payment.securityCode}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVC"
            required
            aria-invalid={!!errors.securityCode}
          />
          {errors.securityCode && <small style={{ color: 'var(--color-error)' }} role="alert">{errors.securityCode}</small>}
        </label>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="form-error" role="alert" style={{ color: 'var(--color-error)', marginTop: '24px' }}>
          Please complete your payment details correctly.
        </p>
      )}
      <Button type="submit" style={{ marginTop: '32px' }}>Review order</Button>
    </form>
  );
}