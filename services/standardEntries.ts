import { nextApi } from './serverConfig';
import {
  CreateStandardEntry,
  UpdateStandardEntry,
} from '@/types/standardEntry';

export async function getStandardEntries(standardId?: string) {
  const url = standardId
    ? `/standard-entries?standardId=${standardId}`
    : '/standard-entries';
  const result = await nextApi.get(url);
  return result.data;
}

export async function getStandardEntryById(id: string) {
  const result = await nextApi.get(`/standard-entries/${id}`);
  return result.data;
}

export async function createStandardEntry(body: CreateStandardEntry) {
  const result = await nextApi.post('/standard-entries', body);
  return result.data;
}

export async function updateStandardEntry(
  id: string,
  body: UpdateStandardEntry
) {
  const result = await nextApi.patch(`/standard-entries/${id}`, body);
  return result.data;
}

export async function deleteStandardEntry(id: string) {
  const result = await nextApi.delete(`/standard-entries/${id}`);
  return result.data;
}
