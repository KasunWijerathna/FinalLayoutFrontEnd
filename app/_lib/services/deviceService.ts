import { Device } from '../types';
import { api } from './api';

class DeviceService {
  async getAll(): Promise<Device[]> {
    const response = await api.get('/devices');
    return response.data;
  }

  async getById(id: string): Promise<Device> {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  }

  async create(data: FormData): Promise<Device> {
    const response = await api.post('/devices', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async update(id: string, data: FormData): Promise<Device> {
    const response = await api.patch(`/devices/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/devices/${id}`);
  }
}

export const deviceService = new DeviceService(); 