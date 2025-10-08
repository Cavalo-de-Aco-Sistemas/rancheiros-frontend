import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { EnrollmentStatus } from '@/model/enrollment';

interface UpdateEnrollmentFlowParams {
  enrollmentId: string;
  status: EnrollmentStatus;
}

export function useEnrollmentFlowMutation() {
  const { axiosInstance } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, status }: UpdateEnrollmentFlowParams) => {
      await axiosInstance.patch(`${BACKEND_ADDRESS}/enrollments/${enrollmentId}/status`, {
        status,
      });
    },
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Status da inscrição atualizado com sucesso!',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || 'Erro ao atualizar status da inscrição.';
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      });
    },
  });
}
