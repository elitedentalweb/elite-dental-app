export interface CreateObjectParams {
  title: string;
  client: string;
  location: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  status?: 'active' | 'completed';
  photosBefore?: string[];
  photosAfter?: string[];
}

export interface UpdateObjectParams {
  title?: string;
  client?: string;
  location?: string;
  description?: string;
  manualProgress?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: 'active' | 'completed';
  photosBefore?: string[];
  photosAfter?: string[];
}
