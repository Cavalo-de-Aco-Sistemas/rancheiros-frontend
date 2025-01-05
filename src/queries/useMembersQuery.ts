import { useCallback } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Member } from '@/model/member';
import { BACKEND_ADDRESS } from '@/utils/constants';

export default function useMembersQuery(): UseQueryResult<Member[], Error> {
  const { axiosInstance } = useAuth();

  const queryFn = useCallback(async (): Promise<Member[]> => {
    const raw = (await axiosInstance.get(`${BACKEND_ADDRESS}/members`)).data;
    return raw as Member[];
  }, [axiosInstance]);

  return useQuery({ queryKey: ['members'], queryFn });
}
