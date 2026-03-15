import { useAtomValue, useSetAtom } from 'jotai';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { productsSortAtom } from '../stores/productsStore.ts';
import { fetchProducts, type SortOrder } from '../api/products.ts';

const PRODUCTS_QUERY_KEY = 'products';

const DEFAULT_PAGE_SIZE = 10;

export function useProducts() {
  const [search, setSearch] = useState('');
  const { sortBy, order } = useAtomValue(productsSortAtom);
  const setProductsSort = useSetAtom(productsSortAtom);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, debouncedSearch, sortBy, order, skip],
    queryFn: () =>
      fetchProducts({
        search: debouncedSearch || undefined,
        sortBy,
        order,
        skip,
        limit: DEFAULT_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const setSearchWithDebounce = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const setSort = useCallback(
    (field: string | undefined, dir: SortOrder) => {
      setProductsSort({ sortBy: field, order: dir });
      setPage(1);
    },
    [setProductsSort]
  );

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isFetching,
    error,
    search,
    setSearch: setSearchWithDebounce,
    sortBy,
    order,
    setSort,
    page,
    setPage,
    pageSize: DEFAULT_PAGE_SIZE,
    refetch,
  };
}
