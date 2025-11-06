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
    refetchQueries: [{ query: GET_ENROLLMENTS }],
  });

  const mutate = ({ enrollmentId, status, enrollmentName }: UpdateEnrollmentFlowParams) => {
    const successNameText = enrollmentName ? ` de ${enrollmentName}` : '';
    const errorNameText = enrollmentName ? ` da inscrição ${enrollmentName}` : ' da inscrição';
    return updateStatus({
      variables: {
        id: enrollmentId,
        input: { status },
      },
    })
      .then((result) => {
        const updatedStatus: EnrollmentStatus = result.data.updateEnrollmentStatus.status as EnrollmentStatus;
        notifications.show({
          title: 'Sucesso',
          message: `Status ${successNameText} alterado para ${STATUS_LABELS[updatedStatus]}`,
          color: 'green',
        });
      })
      .catch((error) => {
        notifications.show({
          title: 'Erro',
          message: `Erro ao atualizar status${errorNameText}: ${error.message}`,
          color: 'red',
        });
        throw error;
      });
  };

  return { mutate, isLoading: loading };
}
