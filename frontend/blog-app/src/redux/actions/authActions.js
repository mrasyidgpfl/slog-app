import {
  loginApi,
  logoutApi,
  logoutLocally,
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
    console.log(response);
    const { access, refresh } = response.data;
    console.log(access, refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    dispatch({ type: LOGIN_SUCCESS, payload: { access, refresh } });
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Optionally handle login failure
  }
};

export const logoutUser = (refreshToken) => async (dispatch) => {
  try {
    await logoutApi(refreshToken); // Call logout API with refresh token
    dispatch({ type: LOGOUT_SUCCESS }); // Dispatch logout success action
  } catch (error) {
    console.error("Logout error:", error);
    throw error; // Optionally handle logout failure
  }
};

export const logoutLocallyUser = () => (dispatch) => {
  logoutLocally(); // Call client-side logout
  dispatch({ type: LOGOUT_SUCCESS }); // Dispatch action upon successful logout
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    const { token, user } = await register(
      userData.username,
      userData.password,
      userData.email,
      userData.first_name,
      userData.last_name,
      userData.role,
    );
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { token, user },
    });

    return { token, user }; // Return token and user for handling in component
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || "Registration failed",
    });
    throw error;
  }
};
