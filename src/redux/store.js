import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const token = localStorage.getItem("token");

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: null,
      token: token || null,
      isAuthenticated: !!token,
      error: null,
      loading: false,
    },
  },
  devTools: true,
});
