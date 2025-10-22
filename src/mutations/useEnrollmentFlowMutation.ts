import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { UPDATE_ENROLLMENT_STATUS, GET_ENROLLMENTS } from '@/graphql/enrollments';
import { EnrollmentStatus } from '@/model/enrollment';

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
  const [updateStatus, { loading }] = useMutation(UPDATE_ENROLLMENT_STATUS, {
    onCompleted: (data) => {
      const status = data.updateEnrollmentStatus.status;
      notifications.show({
        title: 'Sucesso',
        message: `Status alterado para ${STATUS_LABELS[status as EnrollmentStatus]}`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro',
        message: `Erro ao atualizar status da inscrição: ${error.message}`,
        color: 'red',
      });
    },
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, status }: UpdateEnrollmentFlowParams) => {
    return updateStatus({
      variables: {
        id: enrollmentId,
        input: { status },
      },
    });
  };

  return { mutate, isLoading: loading };
}
