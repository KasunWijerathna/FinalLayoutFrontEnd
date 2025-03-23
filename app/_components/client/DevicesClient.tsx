'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { deviceService } from '@/app/_lib/services/deviceService';
import { locationService } from '@/app/_lib/services/locationService';
import { Device, Status, Location } from '@/app/_lib/types';

export default function DevicesClient() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    type: 'pos' as 'pos' | 'kiosk' | 'signage',
    status: 'Active' as Status,
    locationId: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchDevices();
    fetchLocations();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.getAll();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleOpenDialog = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
      setFormData({
        serialNumber: device.serialNumber,
        type: device.type,
        status: device.status,
        locationId: device.locationId,
        image: null,
      });
    } else {
      setEditingDevice(null);
      setFormData({
        serialNumber: '',
        type: 'pos',
        status: 'Active',
        locationId: '',
        image: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDevice(null);
    setFormData({
      serialNumber: '',
      type: 'pos',
      status: 'Active',
      locationId: '',
      image: null,
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, image: event.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('serialNumber', formData.serialNumber);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('locationId', formData.locationId);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingDevice) {
        await deviceService.update(editingDevice.id, formDataToSend);
      } else {
        await deviceService.create(formDataToSend);
      }
      handleCloseDialog();
      fetchDevices();
    } catch (err) {
      setError('Failed to save device');
      console.error('Error saving device:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await deviceService.delete(id);
        fetchDevices();
      } catch (err) {
        setError('Failed to delete device');
        console.error('Error deleting device:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Devices</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Device
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.serialNumber}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>
                  {locations.find(loc => loc.id === device.locationId)?.title || 'N/A'}
                </TableCell>
                <TableCell>
                  {device.imageUrl && (
                    <img
                      src={device.imageUrl}
                      alt={device.serialNumber}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(device)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(device.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDevice ? 'Edit Device' : 'Add Device'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Serial Number"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pos' | 'kiosk' | 'signage' })}
                >
                  <MenuItem value="pos">POS</MenuItem>
                  <MenuItem value="kiosk">Kiosk</MenuItem>
                  <MenuItem value="signage">Signage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.locationId}
                  label="Location"
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.image.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingDevice ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 