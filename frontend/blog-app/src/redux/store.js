/* eslint-disable */
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import authReducers from "./reducers/authReducers";

const store = configureStore({
  reducer: {
    auth: authReducers,
    // Add other reducers if you have them
    // reducer: rootReducer, // You might not need this line if rootReducer is already combining authReducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
