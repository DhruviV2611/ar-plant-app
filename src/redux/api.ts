import axios from 'axios';
import store from './store';
import API_CONFIG from '../config/api';
import { jwtDecode } from 'jwt-decode';


const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.authState.token;
    console.log('Token used for API requests:', token); // Debug log
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      const decoded = jwtDecode(token);
        console.log('Decoded Token Payload:', decoded);
    }
     
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      store.dispatch({ type: 'LOGOUT' });
    }
    return Promise.reject(error);
  }
);

export default api;