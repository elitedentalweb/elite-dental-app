'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { nextApi } from '@/services/serverConfig';
import css from './ResetPasswordForm.module.css';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await nextApi.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch {
      setError('Invalid or expired reset link');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={css['form']}>
        <p className={css['successText']}>
          Password reset successfully! Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={css['form']}>
      <div className={css['formHeader']}>
        <h2>Reset Password</h2>
        <p>Enter your new password</p>
      </div>
      <div className={css['inputs']}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className={css['error']}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
