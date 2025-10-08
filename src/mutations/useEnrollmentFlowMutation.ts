import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { EnrollmentStatus, Enrollment } from '@/model/enrollment';
import { useOptimizedQueries } from '@/hooks/useOptimizedQueries';

interface UpdateEnrollmentFlowParams {
  enrollmentId: string;
  status: EnrollmentStatus;
}

const STATUS_LABELS = {
  [EnrollmentStatus.WAITING]: 'Lista de Espera',
  [EnrollmentStatus.CALLED]: 'Chamado',
  [EnrollmentStatus.CONFIRMED]: 'Confirmado',
  [EnrollmentStatus.DROPPED]: 'Cancelado',
  [EnrollmentStatus.IGNORED]: 'Ignorado',
  [EnrollmentStatus.CERTIFIED]: 'Certificado',
  [EnrollmentStatus.MISSED]: 'Faltou',
};

export function useEnrollmentFlowMutation() {
  const { axiosInstance } = useAuth();
  const { invalidateQuery, updateQueryData, getQueryData, cancelQueries } = useOptimizedQueries();

  return useMutation({
    mutationFn: async ({ enrollmentId, status }: UpdateEnrollmentFlowParams) => {
      const response = await axiosInstance.patch(`${BACKEND_ADDRESS}/enrollments/${enrollmentId}/status`, {
        status,
      });
      return { enrollmentId, status, updatedEnrollment: response.data };
    },
    onMutate: async ({ enrollmentId, status }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await cancelQueries('enrollments');

      // Snapshot previous value
      const previousEnrollments = getQueryData<Enrollment>('enrollments');

      // Optimistically update the enrollment status
      updateQueryData<Enrollment>('enrollments', (old) => {
        if (!old) return old;
        return old.map((enrollment) =>
          enrollment.id === enrollmentId
            ? { ...enrollment, status }
            : enrollment
        );
      });

      return { previousEnrollments };
    },
    onSuccess: (data, { status }) => {
      notifications.show({
        title: 'Sucesso',
        message: `Status alterado para ${STATUS_LABELS[status]}`,
        color: 'green',
      });
      
      // Only invalidate enrollments query - classes don't need to be refetched for status changes
      invalidateQuery('enrollments');
    },
    onError: (error: AxiosError, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousEnrollments) {
        updateQueryData<Enrollment>('enrollments', () => context.previousEnrollments!);
      }
      
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
