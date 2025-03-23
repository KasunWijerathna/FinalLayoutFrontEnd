'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { Device } from '@/app/_lib/types';

type DeviceStatus = 'Active' | 'Inactive' | 'Maintenance';

interface DeviceFormProps {
  initialData?: Device | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function DeviceForm({ initialData, onSubmit, onCancel }: DeviceFormProps) {
  const [serialNumber, setSerialNumber] = useState(initialData?.serialNumber || '');
  const [type, setType] = useState(initialData?.type || '');
  const [status, setStatus] = useState<DeviceStatus>(
    (initialData?.status as DeviceStatus) || 'Active'
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    serialNumber: '',
    type: '',
  });

  useEffect(() => {
    if (initialData) {
      setSerialNumber(initialData.serialNumber);
      setType(initialData.type);
      setStatus((initialData.status as DeviceStatus) || 'Active');
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {
      serialNumber: '',
      type: '',
    };

    if (!serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    if (!type.trim()) {
      newErrors.type = 'Device type is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('serialNumber', serialNumber.trim());
      formData.append('type', type.trim());
      formData.append('status', status);
      if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<DeviceStatus>) => {
    setStatus(event.target.value as DeviceStatus);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          error={!!errors.serialNumber}
          helperText={errors.serialNumber}
          disabled={loading}
          required
        />

        <TextField
          fullWidth
          label="Device Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          error={!!errors.type}
          helperText={errors.type}
          disabled={loading}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select<DeviceStatus>
            value={status}
            label="Status"
            onChange={handleStatusChange}
            disabled={loading}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={loading}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {initialData ? 'Update' : 'Create'} Device
          </Button>
        </Box>
      </Stack>
    </Box>
  );
} 