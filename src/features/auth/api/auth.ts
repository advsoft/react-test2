import axios from 'axios';
import { apiClient } from '@/shared/api/client.ts';
import type { LoginResponse } from '../types/auth.ts';

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Ошибка авторизации');
  }
}
