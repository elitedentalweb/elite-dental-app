import { nextApi } from './serverConfig';

export async function sendInvite(email: string) {
  const result = await nextApi.post('/invites', { email });
  return result.data;
}
