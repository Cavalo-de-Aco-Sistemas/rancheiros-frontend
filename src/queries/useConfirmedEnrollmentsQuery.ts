import { useQuery } from '@apollo/client';
import { GET_CONFIRMED_ENROLLMENTS_BY_CLASS } from '@/graphql/enrollments';

export function useConfirmedEnrollmentsQuery(classId: string) {
  const { data, loading, error, refetch } = useQuery(GET_CONFIRMED_ENROLLMENTS_BY_CLASS, {
    variables: { classId },
    skip: !classId, // Só executa se classId estiver definido
    fetchPolicy: 'cache-and-network',
  });

  return {
    data: data?.confirmedEnrollmentsByClass || [],
    isLoading: loading,
    isError: !!error,
    error,
    refetch,
  };
}
