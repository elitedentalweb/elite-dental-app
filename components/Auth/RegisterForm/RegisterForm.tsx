'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { register } from '@/services/auth';
import Link from 'next/link';
import css from './RegisterForm.module.css';

const RegisterForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nickname || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await register({
        nickname,
        email,
        password,
        adminCode: adminCode || undefined,
        inviteToken: inviteToken || undefined,
      });
      router.push('/auth/login');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['registerForm']}>
      <div className={css['block-logo']}>
        <Link href="/" className={css['logo-link']}>
          <svg width={136} height={16} className={css['svg-logo']}>
            <use href="/logo-sprite.svg#icon-auth-logo"></use>
          </svg>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className={css['form']}>
        <div>
          <h2>Register</h2>
          <p>Enter your details to create an account</p>
        </div>
        <div className={css['inputs']}>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!inviteToken && (
            <input
              type="password"
              placeholder="Admin code (optional)"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
          )}
        </div>
        {error && <p className={css['error']}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
        <p className={`${css['form-register-content']} ${css['footer']}`}>
          Already have an account?{' '}
          <Link href="/auth/login" className={css['form-register-link']}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
