import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/user";

// Thunk login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      return response.data.body.token;
    } catch {
      return rejectWithValue("Invalid email or password");
    }
  },
);

// Thunk récupération profil
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.body;
    } catch {
      return rejectWithValue("Erreur lors de la récupération du profil");
    }
  },
);

// Thunk modification pseudo
export const updateUserName = createAsyncThunk(
  "auth/updateUserName",
  async ({ token, userName }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/profile`,
        { userName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return userName;
    } catch {
      return rejectWithValue("Erreur lors de la mise à jour du pseudo");
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // Fetch profile
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
    // Update username
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      state.user.userName = action.payload;
    });
  },
});

export const { logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
