/* eslint-disable */
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Base URL for API endpoints

export const loginApi = async (usernameOrEmail, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, {
      username_or_email: usernameOrEmail,
      password: password,
    });
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const logoutApi = async (refreshToken) => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log(accessToken, refreshToken)

    // Function to check if access token is expired
    const isAccessTokenExpired = () => {
      const accessTokenExpiration = JSON.parse(atob(accessToken.split('.')[1])).exp;
      return accessTokenExpiration < Date.now() / 1000;
    };

    // If access token is expired, refresh it using the refresh token
    if (isAccessTokenExpired()) {
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      accessToken = response.data.refresh;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", response.data.refresh)
    }

    // Proceed with the logout API call
    const response = await axios.post(
      `${API_BASE_URL}/logout/`,
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logout API error:", error);
    throw error;
  }
};

export const register = async ({
  username,
  password,
  email,
  first_name,
  last_name,
  role,
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/`, {
      username,
      password,
      email,
      first_name,
      last_name,
      role,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(
      error.response?.data?.message || "Registration failed"
    );
  }
};
