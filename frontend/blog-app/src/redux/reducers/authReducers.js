import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../actions/authActions";

const isAccessTokenValid = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return false;
  }

  // Decode the token payload
  const payloadBase64Url = accessToken.split(".")[1];
  if (!payloadBase64Url) {
    return false;
  }

  const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payloadJson = atob(payloadBase64);
  const payload = JSON.parse(payloadJson);

  // Store user data in localStorage if access token is valid
  if (payload.exp && payload.exp > Math.floor(Date.now() / 1000)) {
    localStorage.setItem("user", JSON.stringify(payload.user));
    return true;
  }

  return false;
};

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: isAccessTokenValid(),
  user: isAccessTokenValid ? localStorage.getItem("user") : null,
  error: null,
};

const authReducers = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("accessToken", payload.access);
      localStorage.setItem("refreshToken", payload.refresh);
      localStorage.setItem("user", payload.user);
      return {
        ...state,
        isAuthenticated: true,
        accessToken: payload.access,
        refreshToken: payload.refresh,
        user: payload.user, // Store user object directly from payload
      };
    case LOGIN_FAILURE:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear user data on logout
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: payload.access,
        refreshToken: payload.refresh,
        user: payload.user, // Store user object directly from payload
        error: null,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default authReducers;
