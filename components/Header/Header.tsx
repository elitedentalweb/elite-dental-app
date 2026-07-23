'use client';
import Link from 'next/link';
import css from './Header.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuth, checkAuth, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <>
      <div className={css['header']}>
        <button className={css['burger']} onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <Link href="/" className={css['logoLink']}>
          <svg width={136} height={23} className={css['logoMobile']}>
            <use href="/logo-sprite.svg#icon-header-logo"></use>
          </svg>
          <svg width={180} height={30} className={css['logoDesktop']}>
            <use href="/logo-sprite.svg#icon-header-logo"></use>
          </svg>
        </Link>
        <div className={css['placeholder']} />
      </div>

      {isOpen && (
        <div className={css['overlay']} onClick={() => setIsOpen(false)}>
          <div className={css['sidebar']} onClick={(e) => e.stopPropagation()}>
            <button className={css['close']} onClick={() => setIsOpen(false)}>
              ✕
            </button>
            <nav className={css['nav']}>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Projects
              </Link>
              {isAdmin && (
                <Link href="/users" onClick={() => setIsOpen(false)}>
                  Users
                </Link>
              )}
            </nav>
            {isAuth ? (
              <button className={css['logout']} onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className={css['logout']}
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
