'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  DevicesOther as DeviceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { dashboardService, Location, Device } from '@/app/_lib/api/services';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLocations: 0,
    activeLocations: 0,
    totalDevices: 0,
    activeDevices: 0,
    issues: 0,
  });
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, locationsData, devicesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentLocations(),
          dashboardService.getRecentDevices(),
        ]);
        setStats(statsData);
        setRecentLocations(locationsData);
        setRecentDevices(devicesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const LocationCard = ({ location }: { location: Location }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div">
              {location.title}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {location.address}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {location.devices.length} devices
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {location.status === 'active' ? (
              <CheckCircleIcon color="success" />
            ) : (
              <WarningIcon color="warning" />
            )}
            <IconButton 
              size="small"
              onClick={() => router.push(`/locations/${location._id}`)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const DeviceCard = ({ device }: { device: Device }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div">
              {device.serialNumber}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {device.type.toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {device.status === 'active' ? (
              <CheckCircleIcon color="success" />
            ) : (
              <WarningIcon color="warning" />
            )}
            <IconButton 
              size="small"
              onClick={() => router.push(`/devices/${device._id}`)}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Locations"
            value={stats.totalLocations}
            icon={<LocationIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Locations"
            value={stats.activeLocations}
            icon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Devices"
            value={stats.totalDevices}
            icon={<DeviceIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Devices"
            value={stats.activeDevices}
            icon={<CheckCircleIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Locations
            </Typography>
            {recentLocations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Devices
            </Typography>
            {recentDevices.map((device) => (
              <DeviceCard key={device._id} device={device} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 