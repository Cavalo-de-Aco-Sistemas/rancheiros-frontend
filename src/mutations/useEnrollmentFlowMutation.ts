import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { GET_ENROLLMENTS, UPDATE_ENROLLMENT_STATUS } from '@/graphql/enrollments';
import { EnrollmentStatus } from '@/model/enrollment';

interface UpdateEnrollmentFlowParams {
  enrollmentId: string;
  status: EnrollmentStatus;
  enrollmentName?: string;
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
  const [updateStatus, { loading }] = useMutation(UPDATE_ENROLLMENT_STATUS, {
    onCompleted: (data, context) => {
      const status = data.updateEnrollmentStatus.status;
      const enrollmentName = context?.variables?.enrollmentName;
      const nameText = enrollmentName ? ` de ${enrollmentName}` : '';

      notifications.show({
        title: 'Sucesso',
        message: `Status ${nameText} alterado para ${STATUS_LABELS[status as EnrollmentStatus]}`,
        color: 'green',
      });
    },
    onError: (error, context) => {
      const enrollmentName = context?.variables?.enrollmentName;
      const nameText = enrollmentName ? ` da inscrição ${enrollmentName}` : ' da inscrição';

      notifications.show({
        title: 'Erro',
        message: `Erro ao atualizar status${nameText}: ${error.message}`,
        color: 'red',
      });
    },
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, status, enrollmentName }: UpdateEnrollmentFlowParams) => {
    return updateStatus({
      variables: {
        id: enrollmentId,
        input: { status },
        enrollmentName, // Pass enrollment name to variables for use in callbacks
      },
    });
  };

  return { mutate, isLoading: loading };
}
