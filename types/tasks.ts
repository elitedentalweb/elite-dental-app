export interface CreateTaskParams {
  objectId: string;
  title: string;
  description?: string;
  photos?: string[];
  total: number;
}

export interface UpdateTaskParams {
  title?: string;
  description?: string;
  photos?: string[];
  total?: number;
  current?: number;
}
