'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { locationService } from '@/app/_lib/services/locationService';
import { deviceService } from '@/app/_lib/services/deviceService';
import { Location, Device } from '@/app/_lib/types';

export default function DashboardClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsData, devicesData] = await Promise.all([
        locationService.getAll(),
        deviceService.getAll(),
      ]);
      setLocations(locationsData);
      setDevices(devicesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
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

  const activeLocations = locations.filter(loc => loc.status === 'Active').length;
  const activeDevices = devices.filter(dev => dev.status === 'Active').length;
  const totalDevices = devices.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Locations
              </Typography>
              <Typography variant="h4">
                {locations.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activeLocations} Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Devices
              </Typography>
              <Typography variant="h4">
                {totalDevices}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activeDevices} Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Devices per Location
              </Typography>
              <Typography variant="h4">
                {locations.length > 0 ? (totalDevices / locations.length).toFixed(1) : '0'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Max 10 devices per location
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Locations List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Locations
            </Typography>
            <List>
              {locations.slice(0, 5).map((location) => (
                <Box key={location.id}>
                  <ListItem>
                    <ListItemText
                      primary={location.title}
                      secondary={`${location.address} • ${location.devices.length} devices`}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Devices List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Devices
            </Typography>
            <List>
              {devices.slice(0, 5).map((device) => (
                <Box key={device.id}>
                  <ListItem>
                    <ListItemText
                      primary={device.serialNumber}
                      secondary={`${device.type} • ${device.status} • ${locations.find(loc => loc.id === device.locationId)?.title || 'N/A'}`}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 