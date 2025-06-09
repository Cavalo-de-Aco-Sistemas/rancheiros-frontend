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

  return useQuery({ queryKey: [authToken, endpoint], queryFn });
}
