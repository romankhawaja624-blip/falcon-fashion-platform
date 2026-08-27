import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { AuthLayout } from '../../layouts/AuthLayout';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

export function ResetPasswordPage() {
  const { token = 'demo-token' } = useParams();
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleReset = () => {
    setComplete(true);
    showToast('Your password has been updated successfully.', 'success');
    setTimeout(() => {
      navigate('/sign-in');
    }, 2500);
  };

  return (
    <AuthLayout>
      <div className="auth-heading" style={{ marginBottom: '1.5rem' }}>
        <p className="eyebrow" style={{ color: 'var(--color-champagne)', textTransform: 'uppercase' }}>
          Secure Authentication
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2rem', margin: '0.25rem 0' }}>
          Set new password.
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Create a new strong password for your Falcon Atelier member account.
        </p>
      </div>

      {complete ? (
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
            Password Updated
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Redirecting you to sign in...
          </p>
          <Link className="button button--primary" to="/sign-in">
            Sign In Now &rarr;
          </Link>
        </div>
      ) : (
        <AuthForm
          fields={[
            { name: 'password', label: 'New Password', type: 'password', autoComplete: 'new-password' },
            { name: 'confirmPassword', label: 'Confirm New Password', type: 'password', autoComplete: 'new-password' },
          ]}
          submitLabel="Update Password"
          onSubmit={handleReset}
        />
      )}
    </AuthLayout>
  );
}
