// src/redux/slices/authSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/authUtils";
import {
  loginAction,
  logoutUser,
  registerUser,
  refreshAccessTokenAction,
} from "../actions/authActions";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated:
    !!localStorage.getItem("accessToken") &&
    !isTokenExpired(localStorage.getItem("accessToken")),
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Additional reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.success, (state, action) => {
        const { access, refresh, user } = action.payload;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.isAuthenticated = true;
        state.user = user;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(loginAction.failure, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.error || "Login failed";
      })
      .addCase(logoutUser.success, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      })
      .addCase(registerUser.success, (state, action) => {
        const { access, refresh, user } = action.payload;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.isAuthenticated = true;
        state.user = user;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(registerUser.failure, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.error || "Registration failed";
      })
      .addCase(refreshAccessTokenAction, (state, action) => {
        const newAccessToken = action.payload;
        state.accessToken = newAccessToken;
        localStorage.setItem("accessToken", newAccessToken);
      });
  },
});

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
