import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService, Device } from '@/app/_lib/api/services';

interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
};

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (locationId: string) => {
    const response = await deviceService.getAll();
    return response;
  }
);

export const createDevice = createAsyncThunk(
  'devices/create',
  async ({ locationId, data }: { locationId: string; data: Omit<Device, '_id' | 'createdAt' | 'updatedAt'> }) => {
    const response = await deviceService.create(data);
    return response;
  }
);

export const updateDevice = createAsyncThunk(
  'devices/update',
  async ({ locationId, deviceId, data }: { locationId: string; deviceId: string; data: Partial<Device> }) => {
    const response = await deviceService.update(deviceId, data);
    return response;
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async ({ locationId, deviceId }: { locationId: string; deviceId: string }) => {
    await deviceService.delete(deviceId);
    return deviceId;
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch devices by location
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      });

    // Create device
    builder
      .addCase(createDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices.push(action.payload);
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create device';
      });

    // Update device
    builder
      .addCase(updateDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.devices.findIndex(device => device._id === action.payload._id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update device';
      });

    // Delete device
    builder
      .addCase(deleteDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = state.devices.filter(device => device._id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete device';
      });
  },
});

export const { clearDeviceError } = deviceSlice.actions;
export default deviceSlice.reducer; 