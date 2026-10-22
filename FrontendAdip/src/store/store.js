import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import ngoReducer from '../ngoSlice';
import { appReducer } from '../adminPanel/store';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ngo: ngoReducer,
    app: appReducer
  }
});
