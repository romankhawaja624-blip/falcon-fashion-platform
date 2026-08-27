import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { AuthLayout } from '../../layouts/AuthLayout';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (data?: Record<string, string>) => {
    if (data?.email) setEmail(data.email);
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <div className="auth-heading" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', textTransform: 'uppercase' }}>
          Account Recovery
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '0.25rem 0' }}>
          Reset your password.
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Enter your registered email address and we will issue a secure atelier reset link.
        </p>
      </div>

      {submitted ? (
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
            Reset Link Issued
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            We have sent password recovery instructions to <strong>{email || 'your email address'}</strong>.
          </p>
          <Link className="button button--secondary" to="/reset-password/demo-token-8492" style={{ fontSize: '0.8rem' }}>
            Simulate Reset Link Click &rarr;
          </Link>
        </div>
      ) : (
        <AuthForm
          fields={[{ name: 'email', label: 'Registered Email Address', type: 'email', autoComplete: 'email' }]}
          submitLabel="Request Reset Link"
          onSubmit={handleSubmit}
        />
      )}

      <div className="auth-links" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/sign-in" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
