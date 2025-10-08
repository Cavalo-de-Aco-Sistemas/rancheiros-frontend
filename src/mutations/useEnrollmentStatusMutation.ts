import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { EnrollmentStatus } from '@/model/enrollment';
import { notifications } from '@mantine/notifications';

interface UpdateEnrollmentStatusParams {
  enrollmentId: string;
  status: EnrollmentStatus;
}

const STATUS_LABELS = {
  [EnrollmentStatus.WAITING]: 'Espera',
  [EnrollmentStatus.CALLED]: 'Chamar',
  [EnrollmentStatus.CONFIRMED]: 'Confirmar',
  [EnrollmentStatus.DROPPED]: 'Cancelado',
  [EnrollmentStatus.IGNORED]: 'Ignorado',
  [EnrollmentStatus.CERTIFIED]: 'Certificado',
  [EnrollmentStatus.MISSED]: 'Faltou',
};

export function useEnrollmentStatusMutation() {
  const { axiosInstance, authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, status }: UpdateEnrollmentStatusParams) => {
      const response = await axiosInstance.patch(`${BACKEND_ADDRESS}/enrollments/${enrollmentId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: (_, { status }) => {
      // Invalidar e refetch da query de enrollments
      queryClient.invalidateQueries({
        queryKey: [authToken, 'enrollments'],
      });
      
      notifications.show({
        title: 'Status atualizado',
        message: `Status alterado para ${STATUS_LABELS[status]}`,
        color: 'green',
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível atualizar o status',
        color: 'red',
      });
    },
  });
}
