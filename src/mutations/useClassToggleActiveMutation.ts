import { useApolloClient, useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { GET_CLASSES, UPDATE_CLASS } from '@/graphql/classes';

interface ToggleClassActiveParams {
  classId: string;
  active: boolean;
}

export function useClassToggleActiveMutation() {
  const client = useApolloClient();
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
    // Try to read current class fields from cache to build a realistic optimistic response
    const classesData = client.readQuery<{ classes: any[] }>({ query: GET_CLASSES });
    const cachedClass = classesData?.classes?.find((c) => c.id === classId);

    return updateClass({
      variables: {
        id: classId,
        input: { active },
      },
      optimisticResponse: {
        updateClass: {
          __typename: 'Class',
          id: classId,
          // Preserve existing fields from cache when available to avoid placeholder flicker
          date: cachedClass?.date ?? null,
          mapsLink: cachedClass?.mapsLink ?? null,
          updated_at: cachedClass?.updated_at ?? null,
          deleted: cachedClass?.deleted ?? false,
          location: cachedClass?.location
            ? { __typename: 'Location', id: cachedClass.location.id, name: cachedClass.location.name }
            : { __typename: 'Location', id: '', name: '' },
          active,
        },
      },
    });
  };

  return { toggleActive, loading };
}
