import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { ASSIGN_CLASS_TO_ENROLLMENT, GET_ENROLLMENTS } from '@/graphql/enrollments';

interface AssignClassParams {
  enrollmentId: string;
  classId: string;
  enrollmentName?: string;
}

export function useEnrollmentAssignClassMutation() {
  const [assignClass, { loading }] = useMutation(ASSIGN_CLASS_TO_ENROLLMENT, {
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, classId, enrollmentName }: AssignClassParams) => {
    const nameText = enrollmentName ? ` para ${enrollmentName}` : '';
    return assignClass({
      variables: {
        id: enrollmentId,
        input: { classId },
      },
    })
      .then(() => {
        notifications.show({
          title: 'Sucesso',
          message: `Turma atribuída com sucesso${nameText}!`,
          color: 'green',
        });
      })
      .catch((error) => {
        const errorNameText = enrollmentName ? ` da inscrição ${enrollmentName}` : '';
        notifications.show({
          title: 'Erro',
          message: `Erro ao atribuir turma${errorNameText}: ${error.message}`,
          color: 'red',
        });
        throw error;
      });
  };

  return { mutate, isLoading: loading };
}
