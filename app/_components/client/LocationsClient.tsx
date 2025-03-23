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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { locationService } from '@/app/_lib/services/locationService';
import { Location, Status, Device } from '@/app/_lib/types';

export default function LocationsClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    status: 'Active' as Status,
    devices: [] as Device[],
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAll();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        title: location.title,
        address: location.address,
        status: location.status,
        devices: location.devices,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        title: '',
        address: '',
        status: 'Active',
        devices: [],
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
      status: 'Active',
      devices: [],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingLocation) {
        await locationService.update(editingLocation.id, formData);
      } else {
        await locationService.create(formData);
      }
      handleCloseDialog();
      fetchLocations();
    } catch (err) {
      setError('Failed to save location');
      console.error('Error saving location:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationService.delete(id);
        fetchLocations();
      } catch (err) {
        setError('Failed to delete location');
        console.error('Error deleting location:', err);
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
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.title}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.status}</TableCell>
                <TableCell>{location.devices.length}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(location)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(location.id)}>
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
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingLocation ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 