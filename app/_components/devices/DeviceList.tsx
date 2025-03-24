'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/_lib/store';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Device } from '@/app/_lib/types';
import { DeviceForm } from './DeviceForm';
import {
  fetchDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from '@/app/_lib/store/slices/deviceSlice';
import { locationService } from '@/app/_lib/api/services';

interface DeviceListProps {
  locationId: string;
}

export function DeviceList({ locationId }: DeviceListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.devices);
  const devices = items[locationId] || [];
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    dispatch(fetchDevices(locationId));
    // Fetch locations
    const fetchLocations = async () => {
      try {
        const response = await locationService.getAll();
        setLocations(response);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, [dispatch, locationId]);

  const handleCreateDevice = async (data: FormData) => {
    await dispatch(createDevice({ locationId, data }));
    setIsCreateDialogOpen(false);
  };

  const handleUpdateDevice = async (deviceId: string, data: FormData) => {
    await dispatch(updateDevice({ locationId, deviceId, data }));
    setEditingDevice(null);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    await dispatch(deleteDevice({ locationId, deviceId }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Devices</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={devices.length >= 10}
          >
            Add Device
          </Button>
        </Box>

        <List>
          {devices.map((device) => (
            <ListItem key={device.id} divider>
              <ListItemText
                primary={device.serialNumber}
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">
                      {device.type}
                    </Typography>
                    <Chip
                      label={device.status}
                      size="small"
                      color={device.status === 'Active' ? 'success' : 'default'}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => setEditingDevice(device)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog
        open={isCreateDialogOpen || !!editingDevice}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingDevice(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingDevice ? 'Edit Device' : 'Add New Device'}
        </DialogTitle>
        <DialogContent>
          <DeviceForm
            initialData={editingDevice}
            locations={locations}
            onSubmit={async (data) => {
              if (editingDevice) {
                await handleUpdateDevice(editingDevice.id, data);
              } else {
                await handleCreateDevice(data);
              }
            }}
            onCancel={() => {
              setIsCreateDialogOpen(false);
              setEditingDevice(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 