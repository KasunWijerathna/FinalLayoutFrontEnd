export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = 'pos' | 'kiosk' | 'signage';
export type Status = 'Active' | 'InActive';

export interface Device {
  _id: string;
  serialNumber: string;
  name: string;
  type: DeviceType;
  status: Status;
  locationId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  title: string;
  address: string;
  status: Status;
  devices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
} 