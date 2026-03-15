import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AUTH_STORAGE_KEY, REMEMBER_ME_KEY } from '@/shared/constants/storage.ts';
import { getAuthStorage } from '@/shared/lib/auth-storage.ts';
import { isRecord } from '@/shared/lib/utils.ts';
import type { AuthState } from '../types/auth.ts';

function isAuthState(value: unknown): value is AuthState {
  if (!isRecord(value)) return false;
  return typeof value.token === 'string' && value.user != null && typeof value.user === 'object';
}

function loadStoredAuth(): AuthState | null {
  try {
    const storage = getAuthStorage();
    const stored = storage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isAuthState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export { type AuthState } from '../types/auth.ts';
export const authAtom = atom<AuthState | null>(loadStoredAuth());

export const rememberMeAtom = atomWithStorage<boolean>(REMEMBER_ME_KEY, false);
