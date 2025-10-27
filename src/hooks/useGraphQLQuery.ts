/**
 * Generic GraphQL Query Hook
 * Wrapper around Apollo Client's useQuery with similar interface to useCRUDQuery
 */
import { DocumentNode, OperationVariables, TypedDocumentNode, useQuery } from '@apollo/client';

interface UseGraphQLQueryOptions {
  variables?: Record<string, any>;
  skip?: boolean;
  pollInterval?: number;
}

export function useGraphQLQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: UseGraphQLQueryOptions) {
  const { variables, skip, pollInterval } = options || {};

  const { data, loading, error, refetch, fetchMore } = useQuery<TData, TVariables>(query, {
    variables: variables as TVariables,
    skip,
    pollInterval,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  return {
    data,
    isLoading: loading,
    isError: !!error,
    error,
    refetch,
    fetchMore,
  };
}
