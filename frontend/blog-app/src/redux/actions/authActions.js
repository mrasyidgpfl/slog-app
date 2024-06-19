import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from "../../services/auth";

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiLogin(username, password);
      return response; // Assuming apiLogin returns user data or token
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiLogout();
  return {}; // Return an empty object, or adjust as needed
});

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await apiRegister(username, password);
      return response; // Assuming apiRegister returns user data or token
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
