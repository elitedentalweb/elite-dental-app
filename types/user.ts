export type User = {
  _id: string;
  email: string;
  nickname: string;
  role: 'admin' | 'user' | 'worker';
  isApproved: boolean;
};

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  nickname: string;
  email: string;
  password: string;
  adminCode?: string;
}
