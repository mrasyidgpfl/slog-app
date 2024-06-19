import axios from "axios";

// Configure Axios instance for REST API calls
export const restApi = axios.create({
  baseURL: "http://localhost:8000/api/", // Replace with REST API base URL
  headers: {
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

// Configure Axios instance for RPC API calls
export const rpcApi = axios.create({
  baseURL: "http://localhost:8000/rpc/", // Replace with RPC API base URL
  headers: {
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});
