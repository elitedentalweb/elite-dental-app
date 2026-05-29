import { create } from 'zustand';
import {
  getUsers,
  approveUser,
  deleteUser,
  setUserRole,
} from '@/services/users';
import { User } from '@/types/user';

type UserStore = {
  users: User[];
  isLoading: boolean;

  fetchUsers: () => Promise<void>;
  approveUser: (email: string) => Promise<void>;
  deleteUser: (email: string) => Promise<void>;
  setRole: (email: string, role: 'user' | 'worker' | 'admin') => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const data = await getUsers();
      set({ users: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  setRole: async (email, role) => {
    try {
      await setUserRole(email, role);
      set({
        users: get().users.map((el) =>
          el.email === email ? { ...el, role } : el
        ),
      });
    } catch (error) {
      console.log(error);
    }
  },

  approveUser: async (email) => {
    set({ isLoading: true });
    try {
      await approveUser(email);
      set({
        users: get().users.map((el) =>
          el.email === email ? { ...el, isApproved: true } : el
        ),
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (email) => {
    set({ isLoading: true });
    try {
      await deleteUser(email);
      set({
        users: get().users.filter((el) => el.email !== email),
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
