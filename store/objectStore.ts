import { create } from 'zustand';
import {
  getObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
} from '@/services/objects';
import { CreateObjectParams, UpdateObjectParams } from '@/types/objects';

export interface ObjectType {
  _id: string;
  title: string;
  client: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  photosBefore: string[];
  photosAfter: string[];
  createdAt: string;
  updatedAt: string;
}

type ObjectStore = {
  objects: ObjectType[];
  currentObject: ObjectType | null;
  isLoading: boolean;

  fetchObjects: () => Promise<void>;
  fetchObjectById: (id: string) => Promise<void>;
  createObject: (object: CreateObjectParams) => Promise<void>;
  updateObject: (id: string, object: UpdateObjectParams) => Promise<void>;
  deleteObject: (id: string) => Promise<void>;
};

export const useObjectStore = create<ObjectStore>((set, get) => ({
  objects: [],
  currentObject: null,
  isLoading: false,

  fetchObjects: async () => {
    set({ isLoading: true });
    try {
      const data = await getObjects();
      set({ objects: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchObjectById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await getObjectById(id);
      set({ currentObject: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createObject: async (object) => {
    set({ isLoading: true });
    try {
      const newObject = await createObject(object);
      set({ objects: [newObject, ...get().objects] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateObject: async (id, object) => {
    set({ isLoading: true });
    try {
      const updated = await updateObject(id, object);
      set({
        objects: get().objects.map((el) => (el._id === id ? updated : el)),
        currentObject: updated,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteObject: async (id) => {
    set({ isLoading: true });
    try {
      await deleteObject(id);
      set({ objects: get().objects.filter((el) => el._id !== id) });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
