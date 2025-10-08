import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';

interface AssignClassParams {
  enrollmentId: string;
  classId: string;
}

export function useEnrollmentAssignClassMutation() {
  const { axiosInstance, authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, classId }: AssignClassParams) => {
      await axiosInstance.patch(`${BACKEND_ADDRESS}/enrollments/${enrollmentId}/assign-class`, {
        classId,
      });
    },
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Turma atribuída com sucesso!',
        color: 'green',
      });
      // Invalida todas as queries relacionadas a enrollments
      queryClient.invalidateQueries({ queryKey: [authToken, 'enrollments'] });
      queryClient.invalidateQueries({ queryKey: [authToken, 'classes'] });
      
      // Força refetch imediato
      queryClient.refetchQueries({ queryKey: [authToken, 'enrollments'] });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || 'Erro ao atribuir turma.';
      notifications.show({
        title: 'Erro',
        message: errorMessage,
        color: 'red',
      });
    },
  });
}
