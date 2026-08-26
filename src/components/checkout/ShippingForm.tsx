import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../features/checkout/CheckoutContext';
import { DELIVERY_METHODS } from '../../features/orders/OrderContext';
import { Button } from '../ui/Button';

const contactFields: [string, string, string][] = [
  ['firstName', 'First name', 'given-name'],
  ['lastName', 'Last name', 'family-name'],
  ['email', 'Email address', 'email'],
  ['phone', 'Phone number', 'tel'],
];

const addressFields: [string, string, string, boolean][] = [
  ['address', 'Address', 'address-line1', true],
  ['unit', 'Apartment / Suite', 'address-line2', false],
  ['city', 'City', 'address-level2', false],
  ['region', 'State / Province', 'address-level1', false],
  ['postalCode', 'Postal code', 'postal-code', false],
  ['country', 'Country / Region', 'country', false],
];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ShippingForm() {
  const { shipping, setShipping, setStep, selectedDelivery, setSelectedDelivery } = useCheckout();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Record<string, string>) => {
    const errs: Record<string, string> = {};
    for (const [key, label] of contactFields) {
      if (!data[key]) errs[key] = `${label} is required.`;
    }
    if (data.email && !validateEmail(data.email)) errs.email = 'Please enter a valid email address.';
    for (const [key, label] of addressFields) {
      if (key !== 'unit' && !data[key]) errs[key] = `${label} is required.`;
    }
    return errs;
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setShipping(data);
      setStep('payment');
      navigate('/checkout/payment');
    }
  };

  return (
    <form className="checkout-form" onSubmit={submit} noValidate>
      {/* Contact */}
      <fieldset className="checkout-fieldset" style={{ border: 0, padding: 0, margin: '0 0 48px' }}>
        <legend style={{ display: 'block', marginBottom: '24px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Contact information
        </legend>
        <div className="form-grid">
          {contactFields.map(([key, label, autoComplete]) => (
            <label
              className={`form-field ${key === 'email' || key === 'phone' ? 'form-field--wide' : ''}`}
              key={key}
            >
              <span>{label} *</span>
              <input
                name={key}
                defaultValue={shipping[key]}
                type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                autoComplete={autoComplete}
                required
                aria-invalid={key in errors}
                aria-describedby={errors[key] ? `${key}-error` : undefined}
              />
              {errors[key] && (
                <small id={`${key}-error`} style={{ color: 'var(--color-error)' }} role="alert">{errors[key]}</small>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Shipping address */}
      <fieldset className="checkout-fieldset" style={{ border: 0, padding: 0, margin: '0 0 48px' }}>
        <legend style={{ display: 'block', marginBottom: '24px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Shipping address
        </legend>
        <div className="form-grid">
          {addressFields.map(([key, label, autoComplete, wide]) => (
            <label
              className={`form-field ${key === 'address' || wide ? 'form-field--wide' : ''}`}
              key={key}
            >
              <span>{label}{key !== 'unit' ? ' *' : ''}</span>
              <input
                name={key}
                defaultValue={shipping[key]}
                type="text"
                autoComplete={autoComplete}
                required={key !== 'unit'}
                aria-invalid={key in errors}
                aria-describedby={errors[key] ? `${key}-error` : undefined}
              />
              {errors[key] && (
                <small id={`${key}-error`} style={{ color: 'var(--color-error)' }} role="alert">{errors[key]}</small>
              )}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Delivery method */}
      <fieldset className="checkout-fieldset" style={{ border: 0, padding: 0, margin: '0 0 48px' }}>
        <legend style={{ display: 'block', marginBottom: '24px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Delivery method
        </legend>
        <div style={{ display: 'grid', gap: '12px' }}>
          {DELIVERY_METHODS.map((method) => (
            <label
              key={method.id}
              className={`delivery-option${selectedDelivery.id === method.id ? ' delivery-option--selected' : ''}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${selectedDelivery.id === method.id ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                padding: '16px 20px',
                cursor: 'pointer',
                gap: '16px',
                transition: 'border-color var(--motion-standard)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="radio"
                  name="delivery"
                  value={method.id}
                  checked={selectedDelivery.id === method.id}
                  onChange={() => setSelectedDelivery(method)}
                  style={{ accentColor: 'var(--color-champagne)', width: '16px', height: '16px' }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', fontWeight: 400 }}>{method.label}</strong>
                  <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em' }}>{method.estimate}</span>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                {method.price === 0 ? 'Complimentary' : `$${method.price}`}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {Object.keys(errors).length > 0 && (
        <p className="form-error" role="alert" style={{ color: 'var(--color-error)', marginBottom: '24px' }}>
          Please review the highlighted fields above.
        </p>
      )}

      <Button type="submit">Continue to payment</Button>
    </form>
  );
}
