'use client';
import { useState } from 'react';
import { nextApi } from '@/services/serverConfig';
import css from './ForgotPasswordForm.module.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await nextApi.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={css['form']}>
        <p className={css['successText']}>
          If this email exists, a reset link has been sent. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={css['form']}>
      <div className={css['formHeader']}>
        <h2>Forgot Password</h2>
        <p>Enter your email and we&apos;ll send you a reset link</p>
      </div>
      <div className={css['inputs']}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p className={css['error']}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
