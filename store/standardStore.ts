import { create } from 'zustand';
import {
  getStandards,
  getStandardById,
  createStandard,
  updateStandard,
  deleteStandard,
} from '@/services/standards';
import { Standard, CreateStandard, UpdateStandard } from '@/types/standard';

type StandardStore = {
  standards: Standard[];
  currentStandard: Standard | null;
  isLoading: boolean;

  fetchStandards: () => Promise<void>;
  fetchStandardById: (id: string) => Promise<void>;
  createStandard: (standard: CreateStandard) => Promise<void>;
  updateStandard: (id: string, standard: UpdateStandard) => Promise<void>;
  deleteStandard: (id: string) => Promise<void>;
};

export const useStandardStore = create<StandardStore>((set, get) => ({
  standards: [],
  currentStandard: null,
  isLoading: false,

  fetchStandards: async () => {
    set({ isLoading: true });
    try {
      const data = await getStandards();
      set({ standards: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStandardById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await getStandardById(id);
      set({ currentStandard: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createStandard: async (standard) => {
    set({ isLoading: true });
    try {
      const newStandard = await createStandard(standard);
      set({ standards: [newStandard, ...get().standards] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateStandard: async (id, standard) => {
    set({ isLoading: true });
    try {
      const updated = await updateStandard(id, standard);
      set({
        standards: get().standards.map((el) => (el._id === id ? updated : el)),
        currentStandard: updated,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStandard: async (id) => {
    set({ isLoading: true });
    try {
      await deleteStandard(id);
      set({ standards: get().standards.filter((el) => el._id !== id) });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
