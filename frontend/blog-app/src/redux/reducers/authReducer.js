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

  // Check for expiration time
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  if (payload.exp && payload.exp > currentTime) {
    return true;
  } else {
    return false;
  }
};

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: isAccessTokenValid(),
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("accessToken", payload.access);
      localStorage.setItem("refreshToken", payload.refresh);
      console.log(type, payload);
      return {
        ...state,
        isAuthenticated: true,
        accessToken: payload.access,
        refreshToken: payload.refresh,
        user: payload.user,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        error: action.payload.error,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case REGISTER_SUCCESS:
      console.log(type, payload);
      return {
        ...state,
        isAuthenticated: true,
        accessToken: payload.access,
        refreshToken: payload.refresh,
        user: payload.user,
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

export default authReducer;
