export interface Standard {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStandard {
  title: string;
  description: string;
}

export interface UpdateStandard {
  title?: string;
  description?: string;
}
