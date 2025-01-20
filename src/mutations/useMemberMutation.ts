import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UseFormReturnType } from '@mantine/form';
import { useAuth } from '@/contexts/AuthContext';
import { MemberDto } from '@/model/member';
import { BACKEND_ADDRESS } from '@/utils/constants';

interface UseMemberMutationParams {
  action: string;
  form: UseFormReturnType<MemberDto, (values: MemberDto) => MemberDto>;
  refetch: () => void;
  close: () => void;
  setError: (error: string) => void;
}

export default function useMemberMutation(params: UseMemberMutationParams) {
  const { action, form, refetch, close, setError } = params;
  const { axiosInstance } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: MemberDto; id?: number }) => {
      switch (action) {
        case 'create':
          return axiosInstance.post(`${BACKEND_ADDRESS}/members`, data);
        case 'update':
          return axiosInstance.patch(`${BACKEND_ADDRESS}/members/${id}`, data);
        case 'delete':
          return axiosInstance.delete(`${BACKEND_ADDRESS}/members/${id}`);
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
        if (error.status === 409) {
          setError('O campo cônjuge deve ser único.');
        } else if (error.status === 422) {
          setError('O item não pode ser excluído pois é referenciado por outros itens');
        } else {
          setError(error.response?.data.detail ?? error.message);
        }
      } else {
        setError(error.message);
      }
    },
  });
  return mutation;
}
