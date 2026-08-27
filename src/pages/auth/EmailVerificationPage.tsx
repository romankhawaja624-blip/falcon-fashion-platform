import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function EmailVerificationPage() {
  const [verified, setVerified] = useState(false);

  return (
    <AuthLayout>
      <div className="auth-heading" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <Mail size={36} style={{ color: 'var(--color-champagne)', marginBottom: '0.75rem' }} />
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', textTransform: 'uppercase' }}>
          Atelier Verification
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '0.25rem 0' }}>
          Verify your email.
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          We have sent a verification code to your registered email address.
        </p>
      </div>

      {verified ? (
        <div style={{
          background: 'var(--color-surface, #141416)',
          border: '1px solid var(--color-outline-muted)',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          <CheckCircle2 size={32} style={{ color: 'var(--color-champagne)', marginBottom: '0.75rem' }} />
          <h2 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            Email Address Verified
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Your member account is fully active. Continue to personal style onboarding.
          </p>
          <Link className="button button--primary" to="/onboarding/style" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
            Continue Onboarding &rarr;
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <label style={{ display: 'block' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              6-Digit Verification Code
            </span>
            <input
              type="text"
              placeholder="e.g. 849201"
              maxLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--color-surface-low)',
                border: '1px solid var(--color-outline-muted)',
                color: '#fff',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem',
                letterSpacing: '0.2em',
                textAlign: 'center',
              }}
            />
          </label>

          <Button onClick={() => setVerified(true)} style={{ width: '100%' }}>
            Verify & Activate Account
          </Button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setVerified(true)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Resend verification code
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/sign-in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
