import { nextApi } from './serverConfig';

export async function getUsers() {
  const result = await nextApi.get('/users');
  return result.data;
}

export async function setUserRole(
  email: string,
  role: 'user' | 'worker' | 'admin'
) {
  const result = await nextApi.post('/users/set-role', { email, role });
  return result.data;
}

export async function approveUser(email: string) {
  const result = await nextApi.post('/users/approve', { email });
  return result.data;
}

export async function revokeUser(email: string) {
  const result = await nextApi.post('/users/revoke', { email });
  return result.data;
}

export async function deleteUser(email: string) {
  const result = await nextApi.delete('/users', { data: { email } });
  return result.data;
}
