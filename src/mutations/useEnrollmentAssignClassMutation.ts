import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { ASSIGN_CLASS_TO_ENROLLMENT, GET_ENROLLMENTS } from '@/graphql/enrollments';

interface AssignClassParams {
  enrollmentId: string;
  classId: string;
}

export function useEnrollmentAssignClassMutation() {
  const [assignClass, { loading }] = useMutation(ASSIGN_CLASS_TO_ENROLLMENT, {
    onCompleted: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Turma atribuída com sucesso!',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro',
        message: `Erro ao atribuir turma: ${error.message}`,
        color: 'red',
      });
    },
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, classId }: AssignClassParams) => {
    return assignClass({
      variables: {
        id: enrollmentId,
        input: { classId },
      },
    });
  };

  return { mutate, isLoading: loading };
}
