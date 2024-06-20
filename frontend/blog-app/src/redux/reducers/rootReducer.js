import { combineReducers } from "redux";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  // Other reducers can be added here if needed
});

export default rootReducer;
