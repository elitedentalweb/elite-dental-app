import { nextApi } from './serverConfig';
import { CreateStandard, UpdateStandard } from '@/types/standard';

export async function getStandards() {
  const result = await nextApi.get('/standards');
  return result.data;
}

export async function getStandardById(id: string) {
  const result = await nextApi.get(`/standards/${id}`);
  return result.data;
}

export async function createStandard(body: CreateStandard) {
  const result = await nextApi.post('/standards', body);
  return result.data;
}

export async function updateStandard(id: string, body: UpdateStandard) {
  const result = await nextApi.patch(`/standards/${id}`, body);
  return result.data;
}

export async function deleteStandard(id: string) {
  const result = await nextApi.delete(`/standards/${id}`);
  return result.data;
}
