import { login, logout as rpcLogout, register } from "../../services/auth";

// Action Types
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

// Action Creators
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const { token, user } = await login(
      credentials.username,
      credentials.password,
    );
    dispatch({ type: LOGIN_SUCCESS, payload: { token, user } });
    return { token, user };
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: { error: error.message } });
    throw error; // Rethrow the error to handle it in the component
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await rpcLogout();
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error("Logout error:", error.message);
    // Handle logout error if needed
  }
};

export const registerUser = (credentials) => async (dispatch) => {
  try {
    const { token, user } = await register(
      credentials.username,
      credentials.password,
    );
    dispatch({ type: REGISTER_SUCCESS, payload: { token, user } });
    return { token, user };
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: { error: error.message } });
    throw error; // Rethrow the error to handle it in the component
  }
};
