import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import { router } from 'expo-router';
import { API_URL } from '@/constants/urls';

// ── Refresh queue ─────────────────────────────────────────────────────────────
// Holds requests that arrived while a token refresh was already in flight.
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token!);
  });
  failedQueue = [];
}

function handleSessionExpired() {
  const { activeRole, clear } = useAuthStore.getState();
  clear();
  const roleLabel = activeRole === 'employer' ? 'employer' : 'worker';
  toast.error(`Your ${roleLabel} session expired. Please log in again.`);
  try {
    router.replace('/');
  } catch {
    // router may not be ready during early app lifecycle
  }
}

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: API_URL || 'http://localhost:4000',
  timeout: 30000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config as AxiosRequestConfig & { _retry?: boolean };

    const isTokenExpired =
      err.response?.status === 401 &&
      err.response?.data?.code === 'TOKEN_EXPIRED';

    // Pass through all non-token-expiry 401s untouched
    if (!isTokenExpired) {
      return Promise.reject(err);
    }

    // Don't recurse on the refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      processQueue(err, null);
      isRefreshing = false;
      handleSessionExpired();
      return Promise.reject(err);
    }

    // A refresh is already in flight — queue this request until it resolves
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      });
    }

    // Prevent retrying a request that already went through a refresh cycle
    if (originalRequest._retry) {
      handleSessionExpired();
      return Promise.reject(err);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      isRefreshing = false;
      handleSessionExpired();
      return Promise.reject(err);
    }

    try {
      const res = await api.post<{ data: { token: string } }>('/auth/refresh', {
        refresh_token: refreshToken,
      });
      const newToken = res.data.data.token;

      useAuthStore.getState().setToken(newToken);
      processQueue(null, newToken);

      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      handleSessionExpired();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
