import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    // ekhane amra pore slice gulo add korbo
    auth: authReducer,
  },
});

// TypeScript use korle nicher line gulo proyojon
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;