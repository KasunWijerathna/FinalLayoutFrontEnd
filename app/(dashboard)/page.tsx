'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/_lib/store';
import { Box, Typography, Grid, Button, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import { fetchLocations } from '@/app/_lib/store/slices/locationSlice';
import { Location } from '@/app/_lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { locations, loading } = useSelector((state: RootState) => state.locations);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    dispatch(fetchLocations());
  }, [dispatch, token, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome back, {user?.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/locations/new')}
        >
          Add New Location
        </Button>
      </Box>

      <Grid container spacing={3}>
        {locations.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">
                  No locations found
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                  Start by adding your first location
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          locations.map((location: Location) => (
            <Grid item xs={12} sm={6} md={4} key={location.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {location.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {location.address}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip
                      label={location.status}
                      color={location.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2">
                    Devices: {location.devices?.length || 0}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => router.push(`/locations/${location.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => router.push(`/locations/${location.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 