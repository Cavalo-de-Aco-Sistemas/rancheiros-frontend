import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { Credentials } from '@/model/models';

export default function useLoginMutation() {
  // we do not use the global axios instance configured with auth
  // because we don't have the auth done yet here
  const axiosInstance: AxiosInstance = useMemo(() => {
    return axios.create({
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  }, []);

  const mutation = useMutation({
    mutationFn: async (credentials: Credentials) => {
      return (await axiosInstance.post(`${BACKEND_ADDRESS}/auth/login`, credentials)).data;
    },
  });
  return mutation;
}
