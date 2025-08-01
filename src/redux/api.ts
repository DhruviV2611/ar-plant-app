import axios from 'axios';
import store from './store';
import API_CONFIG from '../config/api';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.authState.token;

    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Full URL:', (config.baseURL || '') + (config.url || ''));
    console.log('Token used for API requests:', token ? 'Present' : 'Not present');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token Payload:', decoded);

        const userId = (decoded as any)?.userId || (decoded as any)?.sub || (decoded as any)?.id;
        if (userId) {
          config.headers['User-ID'] = userId;
          console.log('Added User-ID to headers:', userId);
        }
      } catch (error) {
        console.log('Token decode error:', error);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api; 