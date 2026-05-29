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
