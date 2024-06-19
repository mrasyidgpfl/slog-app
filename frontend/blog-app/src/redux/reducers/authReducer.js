import { createReducer } from "@reduxjs/toolkit";
import { login, logout } from "../actions/authActions";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // Assuming the payload contains user info
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
    .addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    });
});

export default authReducer;
