import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import deviceReducer from './slices/deviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    locations: locationReducer,
    devices: deviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 