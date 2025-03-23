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
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { RootState, AppDispatch } from '@/app/_lib/store';
import { fetchDevices, createDevice, updateDevice, deleteDevice } from '@/app/_lib/store/slices/deviceSlice';
import { Device, DeviceType, Status } from '@/app/_lib/types';

type DeviceFormData = Omit<Device, '_id' | 'createdAt' | 'updatedAt'>;

export default function DevicesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { devices, loading } = useSelector((state: RootState) => state.devices);
  const { locations } = useSelector((state: RootState) => state.locations);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    serialNumber: '',
    name: '',
    type: 'pos',
    locationId: '',
    status: 'active',
    image: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    dispatch(fetchDevices());
  }, [dispatch, token, router]);

  const handleOpenDialog = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
      setFormData({
        serialNumber: device.serialNumber,
        name: device.name,
        type: device.type,
        locationId: device.locationId,
        status: device.status,
        image: device.image || '',
      });
    } else {
      setEditingDevice(null);
      setFormData({
        serialNumber: '',
        name: '',
        type: 'pos',
        locationId: '',
        status: 'active',
        image: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDevice(null);
    setFormData({
      serialNumber: '',
      name: '',
      type: 'pos',
      locationId: '',
      status: 'active',
      image: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingDevice) {
        await dispatch(updateDevice({ id: editingDevice._id, data: formData })).unwrap();
        setSnackbar({
          open: true,
          message: 'Device updated successfully',
          severity: 'success'
        });
      } else {
        await dispatch(createDevice(formData)).unwrap();
        setSnackbar({
          open: true,
          message: 'Device created successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save device');
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
        await dispatch(deleteDevice(id)).unwrap();
        setSnackbar({
          open: true,
          message: 'Device deleted successfully',
          severity: 'success'
        });
      } catch (err) {
        setError('Failed to delete device');
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device._id}>
                <TableCell>{device.serialNumber}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type.toUpperCase()}</TableCell>
                <TableCell>
                  {locations.find(loc => loc._id === device.locationId)?.title || 'Unknown Location'}
                </TableCell>
                <TableCell>{device.status}</TableCell>
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
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DeviceType })}
              >
                <MenuItem value="pos">POS</MenuItem>
                <MenuItem value="kiosk">Kiosk</MenuItem>
                <MenuItem value="signage">Signage</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.locationId}
                label="Location"
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              >
                {locations.map((location) => (
                  <MenuItem key={location._id} value={location._id}>
                    {location.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingDevice ? 'Update' : 'Create'}
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