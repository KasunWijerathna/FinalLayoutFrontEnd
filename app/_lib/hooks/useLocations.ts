'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Location } from '../types';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      toast.error('Failed to load locations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (data: Partial<Location>) => {
    try {
      if (data.devices && data.devices.length > 10) {
        throw new Error('Maximum 10 devices allowed per location');
      }

      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create location');
      const newLocation = await response.json();
      setLocations(prev => [...prev, newLocation]);
      toast.success('Location created successfully');
      return newLocation;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create location');
      throw error;
    }
  };

  const updateLocation = async (id: string, data: Partial<Location>) => {
    try {
      if (data.devices && data.devices.length > 10) {
        throw new Error('Maximum 10 devices allowed per location');
      }

      const response = await fetch(`/api/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update location');
      const updatedLocation = await response.json();
      setLocations(prev => prev.map(loc => loc.id === id ? updatedLocation : loc));
      toast.success('Location updated successfully');
      return updatedLocation;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update location');
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete location');
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast.success('Location deleted successfully');
    } catch (error) {
      toast.error('Failed to delete location');
      throw error;
    }
  };

  return {
    locations,
    loading,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations,
  };
} 