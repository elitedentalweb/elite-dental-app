export interface StandardEntry {
  _id: string;
  title: string;
  description: string;
  photos: string[];
  standardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStandardEntry {
  title: string;
  description: string;
  photos: string[];
  standardId: string;
}

export interface UpdateStandardEntry {
  title?: string;
  description?: string;
  photos?: string[];
  standardId?: string;
}
