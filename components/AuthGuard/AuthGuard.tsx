'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import PendingPage from '../PendingPage/PendingPage';

const publicRoutes = ['/auth/login', '/auth/register'];

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

  return <>{children}</>;
};

export default AuthGuard;
