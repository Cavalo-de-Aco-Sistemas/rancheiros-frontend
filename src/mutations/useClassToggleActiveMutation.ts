import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedQueries } from '@/hooks/useOptimizedQueries';
import { Class } from '@/model/class';
import { BACKEND_ADDRESS } from '@/utils/constants';

interface ToggleClassActiveParams {
  classId: string;
  active: boolean;
}

export function useClassToggleActiveMutation() {
  const { axiosInstance } = useAuth();
  const { invalidateQuery, updateQueryData, getQueryData, cancelQueries } = useOptimizedQueries();

  return useMutation({
    mutationFn: async ({ classId, active }: ToggleClassActiveParams) => {
      const response = await axiosInstance.patch(`${BACKEND_ADDRESS}/classes/${classId}`, {
        active,
      });
      return { classId, active, updatedClass: response.data };
    },
    onMutate: async ({ classId, active }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await cancelQueries('classes');

      // Snapshot previous value
      const previousClasses = getQueryData<Class>('classes');

      // Optimistically update the class active status
      updateQueryData<Class>('classes', (old) => {
        if (!old) {
          return [];
        }
        return old.map((classItem) =>
          classItem.id === classId
            ? { ...classItem, active }
            : classItem
        );
      });

      return { previousClasses };
    },
    onSuccess: (_data, { active }) => {
      notifications.show({
        title: 'Sucesso',
        message: `Turma ${active ? 'ativada' : 'desativada'} com sucesso`,
        color: 'green',
      });
      
      // Invalidate classes query to ensure data consistency
      invalidateQuery('classes');
    },
    onError: (error: any, { classId }, context) => {
      // Revert optimistic update on error
      if (context?.previousClasses) {
        updateQueryData<Class>('classes', () => context.previousClasses);
      }

      notifications.show({
        title: 'Erro',
        message: `Erro ao ${active ? 'ativar' : 'desativar'} turma: ${error.response?.data?.message || error.message}`,
        color: 'red',
      });
    },
  });
}
