'use client';
import Link from 'next/link';
import css from './LoginForm.module.css';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { login } from '@/services/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, rememberMe });
      await checkAuth();
      toast.success('Welcome back!');
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 404) {
        toast.error('Account not found. Please register.');
      } else if (err?.response?.status === 401) {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css['loginForm']}>
      <div className={css['block-logo']}>
        <Link href="/" className={css['logo-link']}>
          <svg width={136} height={16} className={css['svg-logo']}>
            <use href="/logo-sprite.svg#icon-auth-logo"></use>
          </svg>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className={css['form']}>
        <div>
          <h2>Log in</h2>
          <p>Enter your email address and password to log in</p>
        </div>
        <div className={css['inputs']}>
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
        </div>
        <div className={css['remember']}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className={css['forgotLink']}>
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Log in'}
        </button>
        <p className={`${css['form-login-content']} ${css['footer']}`}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className={css['form-register-link']}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
