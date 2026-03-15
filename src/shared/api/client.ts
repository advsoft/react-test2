import axios from 'axios';
import { API_BASE } from '@/shared/constants/api.ts';
import { getStoredToken } from '@/shared/lib/auth-token.ts';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
