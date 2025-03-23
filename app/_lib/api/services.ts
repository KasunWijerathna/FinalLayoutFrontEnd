import axios from '../axios';

export interface Location {
  _id: string;
  title: string;
  address: string;
  status: 'active' | 'inactive';
  devices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  _id: string;
  serialNumber: string;
  type: 'pos' | 'kiosk' | 'signage';
  status: 'active' | 'inactive';
  locationId: string;
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

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await axios.get('/locations');
    return response.data;
  },

  getById: async (id: string): Promise<Location> => {
    const response = await axios.get(`/locations/${id}`);
    return response.data;
  },

  create: async (data: Omit<Location, '_id' | 'createdAt' | 'updatedAt'>): Promise<Location> => {
    const response = await axios.post('/locations', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Location>): Promise<Location> => {
    const response = await axios.patch(`/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/locations/${id}`);
  },

  validateDeviceLimit: async (locationId: string): Promise<boolean> => {
    const location = await locationService.getById(locationId);
    return location.devices.length < 10;
  }
};

export const deviceService = {
  getAll: async (): Promise<Device[]> => {
    const response = await axios.get('/devices');
    return response.data;
  },

  getById: async (id: string): Promise<Device> => {
    const response = await axios.get(`/devices/${id}`);
    return response.data;
  },

  create: async (data: Omit<Device, '_id' | 'createdAt' | 'updatedAt'>): Promise<Device> => {
    // Check device limit before creating
    const canAddDevice = await locationService.validateDeviceLimit(data.locationId);
    if (!canAddDevice) {
      throw new Error('Location has reached maximum device limit (10)');
    }
    const response = await axios.post('/devices', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Device>): Promise<Device> => {
    const response = await axios.patch(`/devices/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/devices/${id}`);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get('/dashboard/stats');
    return response.data;
  },

  getRecentLocations: async (): Promise<Location[]> => {
    const response = await axios.get('/dashboard/recent-locations');
    return response.data;
  },

  getRecentDevices: async (): Promise<Device[]> => {
    const response = await axios.get('/dashboard/recent-devices');
    return response.data;
  },
}; 