import { AUTH_STORAGE_KEY } from '@/shared/constants/storage.ts';
import { getAuthStorage } from '@/shared/lib/auth-storage.ts';

export function getStoredToken(): string | null {
  try {
    const storage = getAuthStorage();
    const stored = storage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return null;
    const token = (parsed as Record<string, unknown>).token;
    return typeof token === 'string' ? token : null;
  } catch {
    return null;
  }
}
