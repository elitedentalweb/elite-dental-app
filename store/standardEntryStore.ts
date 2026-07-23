import { create } from 'zustand';
import {
  getStandardEntries,
  getStandardEntryById,
  createStandardEntry,
  updateStandardEntry,
  deleteStandardEntry,
} from '@/services/standardEntries';
import {
  StandardEntry,
  CreateStandardEntry,
  UpdateStandardEntry,
} from '@/types/standardEntry';

type StandardEntryStore = {
  entries: StandardEntry[];
  currentEntry: StandardEntry | null;
  isLoading: boolean;

  fetchEntries: (standardId?: string) => Promise<void>;
  fetchEntryById: (id: string) => Promise<void>;
  createEntry: (entry: CreateStandardEntry) => Promise<void>;
  updateEntry: (id: string, entry: UpdateStandardEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
};

export const useStandardEntryStore = create<StandardEntryStore>((set, get) => ({
  entries: [],
  currentEntry: null,
  isLoading: false,

  fetchEntries: async (standardId) => {
    set({ isLoading: true });
    try {
      const data = await getStandardEntries(standardId);
      set({ entries: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEntryById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await getStandardEntryById(id);
      set({ currentEntry: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createEntry: async (entry) => {
    set({ isLoading: true });
    try {
      const newEntry = await createStandardEntry(entry);
      set({ entries: [newEntry, ...get().entries] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateEntry: async (id, entry) => {
    set({ isLoading: true });
    try {
      const updated = await updateStandardEntry(id, entry);
      set({
        entries: get().entries.map((el) => (el._id === id ? updated : el)),
        currentEntry: updated,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true });
    try {
      await deleteStandardEntry(id);
      set({ entries: get().entries.filter((el) => el._id !== id) });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
