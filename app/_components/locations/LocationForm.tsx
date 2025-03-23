'use client';

import { useState } from 'react';
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
import { Location } from '@/app/_lib/types';

type LocationStatus = 'Active' | 'Inactive';

interface LocationFormProps {
  initialData?: Location | null;
  onSubmit: (data: Partial<Location>) => Promise<void>;
  onCancel: () => void;
}

export function LocationForm({ initialData, onSubmit, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    address: initialData?.address || '',
    status: (initialData?.status || 'Active') as LocationStatus,
  });

  const handleStatusChange = (e: SelectChangeEvent<LocationStatus>) => {
    setFormData({ ...formData, status: e.target.value as LocationStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          multiline
          rows={3}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select<LocationStatus>
            value={formData.status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'} Location
          </Button>
        </Box>
      </Stack>
    </Box>
  );
} 