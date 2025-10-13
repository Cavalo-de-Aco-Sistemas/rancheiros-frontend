import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { Enrollment } from '@/model/enrollment';

export function useConfirmedEnrollmentsQuery(classId: string) {
  const { axiosInstance, authToken } = useAuth();

  const queryFn = useCallback(async () => {
    const url = `${BACKEND_ADDRESS}/enrollments/confirmed/class/${classId}`;
    const response = await axiosInstance.get(url);
    return response.data as Enrollment[];
  }, [axiosInstance, classId]);

  const queryKey = useMemo(() => {
    return [authToken, 'enrollments', 'confirmed', 'class', classId];
  }, [authToken, classId]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!classId, // Só executa se classId estiver definido
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
  });
}
