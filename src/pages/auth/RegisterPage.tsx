import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthForm } from '../../components/auth/AuthForm';

export function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/verify-email');
    }, 1500);
  };

  return (
    <>
      <div className="auth-heading">
        <p className="eyebrow">The Atelier</p>
        <h1>Join the Atelier.</h1>
        <p>Experience AI-tailored high fashion.</p>
      </div>

      {submitted && (
        <p className="auth-success" role="status">
          Your demo profile is ready. Redirecting to email verification...
        </p>
      )}

      <AuthForm
        fields={[
          { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
          { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
          { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
        ]}
        submitLabel="Create account"
        onSubmit={handleRegister}
      />

      <div className="auth-links">
        <span>Already a member?</span>
        <Link to="/sign-in">Sign in</Link>
      </div>
    </>
  );
}