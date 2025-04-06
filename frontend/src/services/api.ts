// Import axios for making HTTP requests
import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, // Allow sending cookies (if needed for refresh tokens)
});

// Add an interceptor to attach the access token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
  }
  return config;
});

export default api; // Export the configured axios instance
