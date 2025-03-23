import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService } from '@/app/_lib/api/services';
import { Device } from '@/app/_lib/types';

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
  async () => {
    const response = await deviceService.getAll();
    return response;
  }
);

export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async (device: Omit<Device, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await deviceService.create(device);
    return response;
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }: { id: string; data: Partial<Device> }) => {
    const response = await deviceService.update(id, data);
    return response;
  }
);

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  async (id: string) => {
    await deviceService.delete(id);
    return id;
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch devices
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
      })
      // Create device
      .addCase(createDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      })
      // Update device
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(device => device._id === action.payload._id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      // Delete device
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(device => device._id !== action.payload);
      });
  },
});

export default deviceSlice.reducer; 