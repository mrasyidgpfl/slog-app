import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../actions/authActions";

const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
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
