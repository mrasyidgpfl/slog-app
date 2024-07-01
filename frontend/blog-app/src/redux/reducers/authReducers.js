import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  UPDATE_ACCESS_TOKEN,
} from "../actions/authActions";
import { isTokenExpired } from "../../utils/authUtils";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated:
    !!localStorage.getItem("accessToken") &&
    !isTokenExpired(localStorage.getItem("accessToken")),
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};

const authReducers = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("accessToken", payload.access);
      localStorage.setItem("refreshToken", payload.refresh);
      localStorage.setItem("user", JSON.stringify(payload.user));
      return {
        ...state,
        isAuthenticated: true,
        accessToken: payload.access,
        refreshToken: payload.refresh,
        user: payload.user,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,
        error: action.payload?.error || null,
      };
    case REGISTER_SUCCESS:
      localStorage.setItem("accessToken", payload.access_token);
      localStorage.setItem("refreshToken", payload.refresh_token);
      localStorage.setItem("user", JSON.stringify(payload.user));
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
    case UPDATE_ACCESS_TOKEN:
      localStorage.setItem("accessToken", payload);
      return {
        ...state,
        accessToken: payload,
      };
    default:
      return state;
  }
};

export default authReducers;
