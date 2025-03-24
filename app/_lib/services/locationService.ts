import { Location } from '../types';
import { api } from '../api/services';

class LocationService {
  async getAll(): Promise<Location[]> {
    const response = await api.get('/api/locations');
    return response.data;
  }

  async getById(id: string): Promise<Location> {
    const response = await api.get(`/api/locations/${id}`);
    return response.data;
  }

  async create(data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    const response = await api.post('/api/locations', data);
    return response.data;
  }

  async update(id: string, data: Partial<Location>): Promise<Location> {
    const response = await api.patch(`/api/locations/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/api/locations/${id}`);
  }
}

export const locationService = new LocationService(); 