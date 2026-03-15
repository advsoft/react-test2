import { atomWithStorage } from 'jotai/utils';
import { PRODUCTS_SORT_KEY } from '@/shared/constants/storage.ts';
import type { SortOrder } from '../api/products.ts';

const ALLOWED_SORT_FIELDS = ['title', 'brand', 'sku', 'rating', 'price'] as const;

type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

export interface ProductsSortState {
  sortBy: string | undefined;
  order: SortOrder;
}

const DEFAULT_SORT: ProductsSortState = { sortBy: undefined, order: 'asc' };

const SORT_FIELD_SET = new Set<string>(ALLOWED_SORT_FIELDS);

function isSortField(value: string): value is SortField {
  return SORT_FIELD_SET.has(value);
}

function isProductsSortState(value: unknown): value is { sortBy?: string; order?: string } {
  if (!value || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return (
    (o.sortBy === undefined || typeof o.sortBy === 'string') &&
    (o.order === undefined || typeof o.order === 'string')
  );
}

function validateSort(parsed: unknown): ProductsSortState {
  if (!isProductsSortState(parsed)) return DEFAULT_SORT;
  const { sortBy, order } = parsed;
  const validSortBy = sortBy && isSortField(sortBy) ? sortBy : undefined;
  const validOrder = order === 'desc' ? 'desc' : 'asc';
  return { sortBy: validSortBy, order: validOrder };
}

export const productsSortAtom = atomWithStorage<ProductsSortState>(
  PRODUCTS_SORT_KEY,
  DEFAULT_SORT,
  {
    getItem: (key, initialValue) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return initialValue;
        return validateSort(JSON.parse(stored));
      } catch {
        return initialValue;
      }
    },
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  }
);
