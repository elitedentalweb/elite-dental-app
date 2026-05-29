import { create } from 'zustand';
import { User } from '@/types/user';
import { me, logout as logoutService } from '@/services/auth';

type AuthStore = {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuth: true,
      isLoading: false,
    }),

  logout: async () => {
    try {
      await logoutService();
    } finally {
      set({ user: null, isAuth: false });
    }
  },

  checkAuth: async () => {
    try {
      const data = await me();
      console.log('ME RESPONSE:', data);

      set({ user: data.user, isAuth: true, isLoading: false });
    } catch {
      set({ user: null, isAuth: false, isLoading: false });
    }
  },
}));
