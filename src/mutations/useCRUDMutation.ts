import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UseFormReturnType } from '@mantine/form';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';

interface UseCRUDMutationParams<T> {
  action: string;
  form: UseFormReturnType<T, (values: T) => T>;
  refetch: () => void;
  close: () => void;
  setError: (error: string) => void;
  endpoint: string;
  handleError?: (error: AxiosError) => string | undefined;
}

export default function useCRUDMutation<T>(params: UseCRUDMutationParams<T>) {
  const { action, form, refetch, close, setError, endpoint, handleError } = params;
  const { axiosInstance } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: T; id?: string }) => {
      switch (action) {
        case 'create':
          return axiosInstance.post(`${BACKEND_ADDRESS}/${endpoint}`, data);
        case 'update':
          return axiosInstance.patch(`${BACKEND_ADDRESS}/${endpoint}/${id}`, data);
        case 'delete':
          return axiosInstance.delete(`${BACKEND_ADDRESS}/${endpoint}/${id}`);
        default:
          throw new Error(`Invalid action ${action}`);
      }
    },
    onSuccess: () => {
      form.reset();
      setError('');
      refetch();
      close();
    },
    onError: (error: AxiosError | Error) => {
      if (error instanceof AxiosError) {
        const errorMessage = handleError?.(error) ?? error.response?.data.detail ?? error.message;
        setError(errorMessage);
      } else {
        setError(error.message);
      }
    },
  });
  return mutation;
}
