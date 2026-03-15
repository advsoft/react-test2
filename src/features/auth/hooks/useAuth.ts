import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/auth.ts';
import { AUTH_STORAGE_KEY, REMEMBER_ME_KEY } from '@/shared/constants/storage.ts';
import { ROUTES } from '@/shared/constants/routes.ts';
import type { AuthUser } from '../types/auth.ts';
import { authAtom, rememberMeAtom } from '../stores/authStore.ts';

export function useAuth() {
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const rememberMe = useAtomValue(rememberMeAtom);
  const setRememberMe = useSetAtom(rememberMeAtom);
  const navigate = useNavigate();

  const login = useCallback(
    async (username: string, password: string, remember: boolean) => {
      const response = await apiLogin({ username, password });
      const user: AuthUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      };
      const state = { token: response.accessToken, user };

      setRememberMe(remember);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      setAuth(state);
      navigate(ROUTES.PRODUCTS);
    },
    [navigate, setAuth, setRememberMe]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    setAuth(null);
    navigate(ROUTES.LOGIN);
  }, [navigate, setAuth]);

  return { auth, rememberMe, setRememberMe, login, logout };
}
