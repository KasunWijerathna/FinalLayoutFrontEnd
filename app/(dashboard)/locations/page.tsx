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
import { fetchLocations, createLocation, updateLocation, deleteLocation } from '@/app/_lib/store/slices/locationSlice';
import { Location, Status } from '@/app/_lib/types';

export default function LocationsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading, error } = useSelector((state: RootState) => state.locations);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    status: 'active' as Status,
    devices: [] as string[]
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Ensure locations is always an array
  const locationsArray = Array.isArray(locations) ? locations : [];

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        title: location.title,
        address: location.address,
        status: location.status,
        devices: location.devices
      });
    } else {
      setEditingLocation(null);
      setFormData({
        title: '',
        address: '',
        status: 'active',
        devices: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLocation(null);
    setFormData({
      title: '',
      address: '',
      status: 'active',
      devices: []
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingLocation) {
        await dispatch(updateLocation({ id: editingLocation._id, data: formData })).unwrap();
        setSnackbar({
          open: true,
          message: 'Location updated successfully',
          severity: 'success'
        });
      } else {
        await dispatch(createLocation(formData)).unwrap();
        setSnackbar({
          open: true,
          message: 'Location created successfully',
          severity: 'success'
        });
      }
      handleCloseDialog();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to save location',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await dispatch(deleteLocation(id)).unwrap();
        setSnackbar({
          open: true,
          message: 'Location deleted successfully',
          severity: 'success'
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Failed to delete location',
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
        <Typography variant="h4">Locations</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Location
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
              <TableCell>Title</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Devices</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locationsArray.map((location) => (
              <TableRow key={location._id}>
                <TableCell>{location.title}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.status}</TableCell>
                <TableCell>{location.devices.length}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(location)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(location._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingLocation ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
            />
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingLocation ? 'Update' : 'Create'}
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