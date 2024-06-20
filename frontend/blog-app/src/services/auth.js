import axios from "axios";

// Assuming you have an axios instance configured for your RPC API
export const rpcApi = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const login = async (username, password) => {
  try {
    const response = await fetch("/api/rpc_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return { token: data.token, user: data.user };
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = async () => {
  try {
    // eslint-disable-next-line no-unused-vars
    const response = await rpcApi.post("/api/rpc_logout");
    localStorage.removeItem("token");
    // Perform any additional logout operations if necessary
  } catch (error) {
    throw new Error("Logout failed");
  }
};

export const register = async (username, password) => {
  try {
    const response = await rpcApi.post("/api/rpc_register", {
      username,
      password,
    });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    return { token, user };
  } catch (error) {
    throw new Error("Registration failed");
  }
};
