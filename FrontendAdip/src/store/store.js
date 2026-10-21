import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import ngoReducer from '../ngoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ngo: ngoReducer
  }
});

