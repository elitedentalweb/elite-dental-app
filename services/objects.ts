import { CreateObjectParams, UpdateObjectParams } from '@/types/objects';
import { nextApi } from './serverConfig';

export async function getObjects() {
  const result = await nextApi.get('/objects');
  return result.data;
}

export async function getObjectById(id: string) {
  const result = await nextApi.get(`/objects/${id}`);
  return result.data;
}

export async function createObject(body: CreateObjectParams) {
  const result = await nextApi.post('/objects', body);
  return result.data;
}

export async function updateObject(id: string, body: UpdateObjectParams) {
  const result = await nextApi.patch(`/objects/${id}`, body);
  return result.data;
}

export async function deleteObject(id: string) {
  const result = await nextApi.delete(`/objects/${id}`);
  return result.data;
}

export async function updateManualProgress(id: string, manualProgress: number) {
  const result = await nextApi.patch(`/objects/${id}/progress`, {
    manualProgress,
  });
  return result.data;
}
