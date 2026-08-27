import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthForm } from '../../components/auth/AuthForm';

export function SignInPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div className="auth-heading">
        <p className="eyebrow">Member access</p>
        <h1>Welcome back.</h1>
        <p>Enter the atelier and continue your style journey.</p>
      </div>

      {submitted && (
        <p className="auth-success" role="status">
          Demo access accepted. Welcome to Falcon.
        </p>
      )}

      <AuthForm
        fields={[
          { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
        ]}
        submitLabel="Sign in"
        onSubmit={() => setSubmitted(true)}
      />

      <div className="auth-links">
        <Link to="/create-account">Join the Atelier</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </>
  );
}