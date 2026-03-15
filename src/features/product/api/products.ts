import axios from 'axios';
import { apiClient } from '@/shared/api/client.ts';
import type { ProductsResponse } from '../types/product.ts';

export type SortOrder = 'asc' | 'desc';

export interface ProductsParams {
  search?: string;
  sortBy?: string;
  order?: SortOrder;
  skip?: number;
  limit?: number;
}

export async function fetchProducts(params: ProductsParams): Promise<ProductsResponse> {
  const { search, sortBy, order, skip = 0, limit = 30 } = params;

  try {
    const endpoint = search ? '/products/search' : '/products';
    const requestParams: Record<string, string | number> = {
      skip,
      limit,
    };
    if (search) {
      requestParams.q = search;
    }
    if (sortBy) {
      requestParams.sortBy = sortBy;
      requestParams.order = order ?? 'asc';
    }

    const { data } = await apiClient.get<ProductsResponse>(endpoint, {
      params: requestParams,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Ошибка загрузки товаров');
  }
}
