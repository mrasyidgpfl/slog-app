// src/services/auth.js
import { rpcApi } from "./api";

export const login = async (username, password) => {
  try {
    const response = await rpcApi.post("auth/login/", { username, password });
    const { token, user } = response.data; // Assuming the response includes token and user data
    localStorage.setItem("token", token);
    return { token, user };
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  // Perform any additional logout operations if necessary
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const register = async (username, password) => {
  try {
    const response = await rpcApi.post("auth/register/", {
      username,
      password,
    });
    const { token, user } = response.data; // Assuming the response includes token and user data
    localStorage.setItem("token", token);
    return { token, user };
  } catch (error) {
    throw new Error("Registration failed");
  }
};
