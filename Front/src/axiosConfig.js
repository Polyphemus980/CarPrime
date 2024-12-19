// src/axiosConfig.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
