'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
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
  Snackbar,
  Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '@/app/_lib/store';
import { fetchDevices, createDevice, updateDevice, deleteDevice } from '@/app/_lib/store/slices/deviceSlice';
import { fetchLocations } from '@/app/_lib/store/slices/locationSlice';
import { Device, DeviceType, Status } from '@/app/_lib/types';

export default function DevicesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading, error } = useSelector((state: RootState) => state.devices);
  const { locations } = useSelector((state: RootState) => state.locations);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    type: 'pos' as DeviceType,
    status: 'Active' as Status,
    location: '',
    image: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      dispatch(fetchDevices(selectedLocation));
    }
  }, [dispatch, selectedLocation]);

  const handleOpenDialog = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
      setFormData({
        serialNumber: device.serialNumber,
        type: device.type,
        status: device.status,
        location: device.location,
        image: device.image || ''
      });
    } else {
      setEditingDevice(null);
      setFormData({
        serialNumber: '',
        type: 'pos',
        status: 'Active',
        location: selectedLocation,
        image: ''
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
      location: selectedLocation,
      image: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.location) {
        setSnackbar({
          open: true,
          message: 'Please select a location first',
          severity: 'error'
        });
        return;
      }

      if (editingDevice) {
        await dispatch(updateDevice({ 
          locationId: selectedLocation, 
          deviceId: editingDevice._id, 
          data: formData 
        })).unwrap();
        setSnackbar({
          open: true,
          message: 'Device updated successfully',
          severity: 'success'
        });
      } else {
        await dispatch(createDevice({ 
          locationId: selectedLocation, 
          data: formData 
        })).unwrap();
        setSnackbar({
          open: true,
          message: 'Device created successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
      if (selectedLocation) {
        dispatch(fetchDevices(selectedLocation));
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save device',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await dispatch(deleteDevice({ 
          locationId: selectedLocation, 
          deviceId: id 
        })).unwrap();
        setSnackbar({
          open: true,
          message: 'Device deleted successfully',
          severity: 'success'
        });
        if (selectedLocation) {
          dispatch(fetchDevices(selectedLocation));
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Failed to delete device',
          severity: 'error'
        });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredDevices = devices.filter(device => device.location === selectedLocation);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Devices</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!selectedLocation}
        >
          Add Device
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Select Location</InputLabel>
            <Select
              value={selectedLocation}
              label="Select Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <MenuItem value="">Select a location</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : selectedLocation ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device._id}>
                  <TableCell>{device.serialNumber}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{device.status}</TableCell>
                  <TableCell>
                    {device.image && (
                      <img 
                        src={device.image} 
                        alt={device.serialNumber} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(device)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(device._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">
          Please select a location to view its devices
        </Alert>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingDevice ? 'Edit Device' : 'Add Device'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              fullWidth
              required
              disabled={loading}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DeviceType })}
                disabled={loading}
              >
                <MenuItem value="pos">POS</MenuItem>
                <MenuItem value="kiosk">Kiosk</MenuItem>
                <MenuItem value="signage">Signage</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                disabled={loading}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="InActive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingDevice ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 