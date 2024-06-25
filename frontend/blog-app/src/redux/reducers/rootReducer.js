import { combineReducers } from "redux";
import authReducers from "./authReducers";

const rootReducer = combineReducers({
  auth: authReducers,
  // Other reducers can be added here if needed
});

export default rootReducer;
