import { create } from 'zustand';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getObjectProgress,
} from '@/services/tasks';
import { CreateTaskParams, UpdateTaskParams } from '@/types/tasks';

export interface TaskType {
  _id: string;
  objectId: string;
  title: string;
  description: string;
  photos: string[];
  total: number;
  current: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

type TaskStore = {
  tasks: TaskType[];
  currentTask: TaskType | null;
  progressMap: Record<string, number>;
  isLoading: boolean;
  fetchTasks: (objectId?: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  fetchObjectProgress: (objectId: string) => Promise<void>;

  createTask: (task: CreateTaskParams) => Promise<void>;
  updateTask: (id: string, task: UpdateTaskParams) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentTask: null,
  progressMap: {},
  isLoading: false,

  fetchTasks: async (objectId) => {
    set({ isLoading: true });
    try {
      const data = await getTasks(objectId);
      set({ tasks: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTaskById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await getTaskById(id);
      set({ currentTask: data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchObjectProgress: async (objectId) => {
    try {
      const data = await getObjectProgress(objectId);
      set({
        progressMap: {
          ...get().progressMap,
          [objectId]: data.progress,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  createTask: async (task) => {
    set({ isLoading: true });
    try {
      const newTask = await createTask(task);
      set({ tasks: [newTask, ...get().tasks] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (id, task) => {
    set({ isLoading: true });
    try {
      const updated = await updateTask(id, task);
      set({
        tasks: get().tasks.map((el) => (el._id === id ? updated : el)),
        currentTask: updated,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true });
    try {
      await deleteTask(id);
      set({ tasks: get().tasks.filter((el) => el._id !== id) });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
