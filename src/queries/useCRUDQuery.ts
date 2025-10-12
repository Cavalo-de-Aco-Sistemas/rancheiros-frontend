import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function useCRUDQuery<T>(
  endpoint: string,
  params?: QueryParams,
  options?: {
    usePagination?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) {
  const { axiosInstance, authToken } = useAuth();
  const {
    usePagination = false,
    staleTime = 5 * 60 * 1000,
    gcTime = 10 * 60 * 1000,
  } = options || {};

  const queryFn = useCallback(async () => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const url = `${BACKEND_ADDRESS}/${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    const response = await axiosInstance.get(url);

    if (usePagination) {
      return response.data as PaginatedResult<T>;
    }

    return response.data as T[];
  }, [axiosInstance, endpoint, params, usePagination]);

  // Criar chave única baseada nos parâmetros para isolar cache por página
  const queryKey = useMemo(() => {
    const key = [authToken, endpoint];

    if (params) {
      // Ordenar parâmetros para garantir consistência
      const sortedParams = Object.keys(params)
        .sort()
        .reduce(
          (result, key) => {
            result[key] = params[key];
            return result;
          },
          {} as Record<string, any>
        );

      key.push(JSON.stringify(sortedParams));
    }

    if (usePagination) {
      key.push('paginated');
    }

    return key;
  }, [authToken, endpoint, params, usePagination]);

  return useQuery({
    queryKey,
    queryFn,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
}
