import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { router } from 'expo-router';
import { API_URL } from '@/constants/urls';

const api = axios.create({
  baseURL: API_URL || 'http://localhost:4000',
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('API returned 401 Unauthorized. Clearing session and redirecting.');
      // Token expired or invalid — clear store to force login
      useAuthStore.getState().clear();
      
      try {
        router.replace('/');
      } catch (e) {
        console.error('Failed to route after 401', e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
