'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Device } from '../types';

export function useDevices(locationId: string) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`/api/locations/${locationId}/devices`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      toast.error('Failed to load devices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createDevice = async (data: FormData) => {
    try {
      const response = await fetch(`/api/locations/${locationId}/devices`, {
        method: 'POST',
        body: data, // Using FormData for file upload
      });

      if (!response.ok) throw new Error('Failed to create device');
      const newDevice = await response.json();
      setDevices(prev => [...prev, newDevice]);
      toast.success('Device created successfully');
      return newDevice;
    } catch (error) {
      toast.error('Failed to create device');
      throw error;
    }
  };

  const updateDevice = async (deviceId: string, data: FormData) => {
    try {
      const response = await fetch(`/api/locations/${locationId}/devices/${deviceId}`, {
        method: 'PUT',
        body: data, // Using FormData for file upload
      });

      if (!response.ok) throw new Error('Failed to update device');
      const updatedDevice = await response.json();
      setDevices(prev => prev.map(dev => dev.id === deviceId ? updatedDevice : dev));
      toast.success('Device updated successfully');
      return updatedDevice;
    } catch (error) {
      toast.error('Failed to update device');
      throw error;
    }
  };

  const deleteDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/locations/${locationId}/devices/${deviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete device');
      setDevices(prev => prev.filter(dev => dev.id !== deviceId));
      toast.success('Device deleted successfully');
    } catch (error) {
      toast.error('Failed to delete device');
      throw error;
    }
  };

  return {
    devices,
    loading,
    createDevice,
    updateDevice,
    deleteDevice,
    refetch: fetchDevices,
  };
} 