import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { UPDATE_CLASS, GET_CLASSES } from '@/graphql/classes';

interface ToggleClassActiveParams {
  classId: string;
  active: boolean;
}

export function useClassToggleActiveMutation() {
  const [updateClass, { loading }] = useMutation(UPDATE_CLASS, {
    onCompleted: (data) => {
      const active = data.updateClass.active;
      notifications.show({
        title: 'Sucesso',
        message: `Turma ${active ? 'ativada' : 'desativada'} com sucesso`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro',
        message: `Erro ao atualizar turma: ${error.message}`,
        color: 'red',
      });
    },
    refetchQueries: [{ query: GET_CLASSES }],
    awaitRefetchQueries: true,
  });

  const toggleActive = ({ classId, active }: ToggleClassActiveParams) => {
    return updateClass({
      variables: {
        id: classId,
        input: { active },
      },
      optimisticResponse: {
        updateClass: {
          __typename: 'Class',
          id: classId,
          active,
          date: new Date().toISOString(),
          mapsLink: '',
          updated_at: new Date().toISOString(),
          deleted: false,
          location: {
            __typename: 'Location',
            id: '',
            name: '',
          },
          enrollments: [],
        },
      },
    });
  };

  return { toggleActive, loading };
}
