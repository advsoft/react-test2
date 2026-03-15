import { AUTH_STORAGE_KEY } from '@/shared/constants/storage.ts';
import { getAuthStorage } from '@/shared/lib/auth-storage.ts';
import { isRecord } from '@/shared/lib/utils.ts';

export function getStoredToken(): string | null {
  try {
    const storage = getAuthStorage();
    const stored = storage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) return null;
    const token = parsed.token;
    return typeof token === 'string' ? token : null;
  } catch {
    return null;
  }
}
