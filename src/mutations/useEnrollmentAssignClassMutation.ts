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
    onCompleted: (data, { context }) => {
      const enrollmentName = context?.enrollmentName;
      const nameText = enrollmentName ? ` para ${enrollmentName}` : '';

      notifications.show({
        title: 'Sucesso',
        message: `Turma atribuída com sucesso${nameText}!`,
        color: 'green',
      });
    },
    onError: (error, { context }) => {
      const enrollmentName = context?.enrollmentName;
      const nameText = enrollmentName ? ` da inscrição ${enrollmentName}` : '';

      notifications.show({
        title: 'Erro',
        message: `Erro ao atribuir turma${nameText}: ${error.message}`,
        color: 'red',
      });
    },
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, classId, enrollmentName }: AssignClassParams) => {
    return assignClass({
      variables: {
        id: enrollmentId,
        input: { classId },
      },
      context: {
        enrollmentName, // Pass enrollment name via context for use in callbacks
      },
    });
  };

  return { mutate, isLoading: loading };
}
