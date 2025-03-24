import axios from '../axios';
import { Location, Status } from '@/app/_lib/types';

export interface Device {
  _id: string;
  serialNumber: string;
  type: 'pos' | 'kiosk' | 'signage';
  status: Status;
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalLocations: number;
  activeLocations: number;
  totalDevices: number;
  activeDevices: number;
  issues: number;
}

export const api = axios;

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get('/api/locations');
    return response.data.data;
  },

  getById: async (id: string): Promise<Location> => {
    const response = await api.get(`/api/locations/${id}`);
    return response.data;
  },

  create: async (data: Omit<Location, '_id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
    const response = await api.post('/api/locations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Location>): Promise<Location> => {
    const response = await api.put(`/api/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/locations/${id}`);
  },

  validateDeviceLimit: async (locationId: string): Promise<boolean> => {
    const location = await locationService.getById(locationId);
    return location.devices.length < 10;
  }
};

export const deviceService = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get('/api/devices');
    return response.data.data;
  },

  getById: async (id: string): Promise<Device> => {
    const response = await api.get(`/api/devices/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Device, '_id' | 'createdAt' | 'updatedAt'>): Promise<Device> => {
    const response = await api.post('/api/devices', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Device>): Promise<Device> => {
    const response = await api.put(`/api/devices/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/devices/${id}`);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard/stats');
    return response.data.data;
  },

  getRecentLocations: async (): Promise<Location[]> => {
    const response = await api.get('/api/dashboard/recent-locations');
    return response.data.data;
  },

  getRecentDevices: async (): Promise<Device[]> => {
    const response = await api.get('/api/dashboard/recent-devices');
    return response.data.data;
  },
}; 