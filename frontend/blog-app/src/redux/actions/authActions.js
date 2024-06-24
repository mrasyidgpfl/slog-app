/* eslint-disable */
import {
  loginApi,
  logoutApi,
  register,
} from "../../services/auth";

// Action Types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const loginAction = (usernameOrEmail, password) => async (dispatch) => {
  try {
    const response = await loginApi(usernameOrEmail, password); // Call login API
    const { access, refresh } = response.data;
    dispatch({ type: LOGIN_SUCCESS, payload: { access, refresh } });
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Optionally handle login failure
  }
};

export const logoutUser = (refreshToken) => async (dispatch) => {
  try {
    const response = await logoutApi(refreshToken); // Call logout API with refresh token
    // const message = response.data
    dispatch({ type: LOGOUT_SUCCESS, payload: null});
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Optionally handle logout failure
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await register(
      userData.username,
      userData.password,
      userData.email,
      userData.first_name,
      userData.last_name,
      userData.role,
    );
    const { access_token, refresh_token, user } = response.data;
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("accessToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { accessToken: access_token, refreshToken: refresh_token, user },
    });
    return { response };
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || "Registration failed",
    });
    throw error;
  }
};
