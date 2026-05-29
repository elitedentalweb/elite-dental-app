import { CreateTaskParams, UpdateTaskParams } from '@/types/tasks';
import { nextApi } from './serverConfig';

export async function getTasks(objectId?: string) {
  const url = objectId ? `/tasks?objectId=${objectId}` : '/tasks';
  const result = await nextApi.get(url);
  return result.data;
}

export async function getTaskById(id: string) {
  const result = await nextApi.get(`/tasks/${id}`);
  return result.data;
}

export async function createTask(body: CreateTaskParams) {
  const result = await nextApi.post('/tasks', body);
  return result.data;
}

export async function updateTask(id: string, body: UpdateTaskParams) {
  const result = await nextApi.patch(`/tasks/${id}`, body);
  return result.data;
}

export async function deleteTask(id: string) {
  const result = await nextApi.delete(`/tasks/${id}`);
  return result.data;
}

export async function getObjectProgress(objectId: string) {
  const result = await nextApi.get(`/tasks/progress/${objectId}`);
  return result.data;
}
