/* eslint-disable */
import {
  loginApi,
  logoutApi,
  register,
} from "../../services/auth";
import { refreshAccessToken } from '../../utils/authUtils';

// Action Types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN';

// Action Creators
export const updateAccessToken = (newAccessToken) => ({
  type: UPDATE_ACCESS_TOKEN,
  payload: newAccessToken,
});

export const loginAction = (usernameOrEmail, password) => async (dispatch) => {
  try {
    const response = await loginApi(usernameOrEmail, password);
    const { access, refresh, user } = response.data;
    dispatch({ type: LOGIN_SUCCESS, payload: { access, refresh, user }});
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(user));
    return { user };
  } catch (error) {
    console.error("Login error:", error);
    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || "Login failed" });
    throw error; // Propagate the error for further handling
  }
};

export const logoutUser = (refreshToken) => async (dispatch) => {
  try {
    await logoutApi(refreshToken);
    dispatch({ type: LOGOUT_SUCCESS });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
    // Optionally dispatch an action to handle logout failure
    throw error; // Propagate the error for further handling
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await register(userData);
    const { access_token, refresh_token, user } = response.data;
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { accessToken: access_token, refreshToken: refresh_token, user },
    });
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));
    return { user };
  } catch (error) {
    console.error("Registration error:", error);
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || "Registration failed",
    });
    throw error; // Propagate the error for further handling
  }
};

export const refreshAccessTokenAction = (refreshToken) => async (dispatch) => {
  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    dispatch(updateAccessToken(newAccessToken));
  } catch (error) {
    console.error('Error refreshing access token:', error);
    // Optionally dispatch an action to handle token refresh failure
    throw error; // Propagate the error for further handling
  }
};
