import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from '@/app/_lib/api/services';
import { Location } from '@/app/_lib/types';

interface LocationState {
  locations: Location[];
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  locations: [],
  currentLocation: null,
  loading: false,
  error: null,
};

export const fetchLocations = createAsyncThunk(
  'locations/fetchAll',
  async () => {
    const response = await locationService.getAll();
    return response;
  }
);

export const fetchLocationById = createAsyncThunk(
  'locations/fetchById',
  async (id: string) => {
    const response = await locationService.getById(id);
    return response;
  }
);

export const createLocation = createAsyncThunk(
  'locations/create',
  async (locationData: Omit<Location, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await locationService.create(locationData);
    return response;
  }
);

export const updateLocation = createAsyncThunk(
  'locations/update',
  async ({ id, data }: { id: string; data: Partial<Location> }) => {
    const response = await locationService.update(id, data);
    return response;
  }
);

export const deleteLocation = createAsyncThunk(
  'locations/delete',
  async (id: string) => {
    await locationService.delete(id);
    return id;
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
    clearCurrentLocation: (state) => {
      state.currentLocation = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all locations
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch locations';
      });

    // Fetch location by ID
    builder
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch location';
      });

    // Create location
    builder
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations.push(action.payload);
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create location';
      });

    // Update location
    builder
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.locations.findIndex(loc => loc._id === action.payload._id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
        if (state.currentLocation?._id === action.payload._id) {
          state.currentLocation = action.payload;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update location';
      });

    // Delete location
    builder
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = state.locations.filter(loc => loc._id !== action.payload);
        if (state.currentLocation?._id === action.payload) {
          state.currentLocation = null;
        }
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete location';
      });
  },
});

export const { clearLocationError, clearCurrentLocation } = locationSlice.actions;
export default locationSlice.reducer; 