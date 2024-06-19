import { useState } from 'react';
import { rpcApi } from '../services/api';

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (username, password) => {
    try {
      const response = await rpcApi.post('auth/login/', { username, password });
      const { token } = response.data; // Assuming RPC API returns a token upon successful login
      localStorage.setItem('token', token);
      setToken(token);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = () => {
    return token !== null;
  };

  return { token, login, logout, isAuthenticated };
};

export default useAuth;
