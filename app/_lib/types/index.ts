export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Location {
  id: string;
  title: string;
  address: string;
  status: 'active' | 'inactive';
  devices: string[];
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = 'pos' | 'kiosk' | 'signage';

export interface Device {
  id: string;
  serialNumber: string;
  name: string;
  type: DeviceType;
  locationId: string;
  status: 'active' | 'inactive';
  image?: string;
  createdAt: string;
  updatedAt: string;
} 