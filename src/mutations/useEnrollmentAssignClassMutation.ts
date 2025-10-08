import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { BACKEND_ADDRESS } from '@/utils/constants';
import { Enrollment, Class } from '@/model/enrollment';
import { useOptimizedQueries } from '@/hooks/useOptimizedQueries';

interface AssignClassParams {
  enrollmentId: string;
  classId: string;
}

export function useEnrollmentAssignClassMutation() {
  const { axiosInstance } = useAuth();
  const { invalidateQuery, updateQueryData, getQueryData, cancelQueries } = useOptimizedQueries();

  return useMutation({
    mutationFn: async ({ enrollmentId, classId }: AssignClassParams) => {
      const response = await axiosInstance.patch(`${BACKEND_ADDRESS}/enrollments/${enrollmentId}/assign-class`, {
        classId,
      });
      return { enrollmentId, classId, updatedEnrollment: response.data };
    },
    onMutate: async ({ enrollmentId, classId }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await cancelQueries('enrollments');

      // Snapshot previous value
      const previousEnrollments = getQueryData<Enrollment>('enrollments');

      // Get the class data for optimistic update
      const classes = getQueryData<Class>('classes');
      const assignedClass = classes?.find(cls => cls.id === classId);

      // Optimistically update the enrollment with the assigned class
      updateQueryData<Enrollment>('enrollments', (old) => {
        if (!old) return old;
        return old.map((enrollment) =>
          enrollment.id === enrollmentId
            ? { ...enrollment, class: assignedClass || null }
            : enrollment
        );
      });

      return { previousEnrollments };
    },
    onSuccess: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Turma atribuída com sucesso!',
        color: 'green',
      });
      
      // Only invalidate enrollments query - classes data doesn't change when assigning
      invalidateQuery('enrollments');
    },
    onError: (error: AxiosError, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousEnrollments) {
        updateQueryData<Enrollment>('enrollments', () => context.previousEnrollments!);
      }
      
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
