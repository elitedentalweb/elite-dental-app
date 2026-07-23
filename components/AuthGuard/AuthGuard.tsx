'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import PendingPage from '../PendingPage/PendingPage';

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/forgot-password',
];

const standardsRoutes = ['/standards'];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuth, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) return null;

  if (publicRoutes.includes(pathname)) return <>{children}</>;

  if (!isAuth) {
    router.push('/auth/login');
    return null;
  }

  if (!user?.isApproved) return <PendingPage />;

  const isStandardsRoute = standardsRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isStandardsRoute && user.role !== 'admin' && user.role !== 'worker') {
    router.push('/');
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
