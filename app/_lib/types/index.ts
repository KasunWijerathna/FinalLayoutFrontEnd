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
export type Status = 'Active' | 'InActive';

export interface Device {
  _id: string;
  serialNumber: string;
  type: DeviceType;
  status: Status;
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
} 