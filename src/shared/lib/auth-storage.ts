import { REMEMBER_ME_KEY } from '@/shared/constants/storage.ts';

export function getAuthStorage(): Storage {
  try {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY);
    return rememberMe === 'true' ? localStorage : sessionStorage;
  } catch {
    return sessionStorage;
  }
}
