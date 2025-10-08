import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';

export default function useCRUDQuery<T>(endpoint: string) {
  const { axiosInstance, authToken } = useAuth();

  const queryFn = useCallback(async () => {
    const response = await axiosInstance.get(`${BACKEND_ADDRESS}/${endpoint}`);
    return response.data as T[];
  }, [axiosInstance, endpoint]);

  return useQuery({ 
    queryKey: [authToken, endpoint], 
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache is kept for 10 minutes after last use
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
    retry: 2, // Retry failed requests up to 2 times
  });
}
