/**
 * Generic GraphQL Mutation Hook
 * Wrapper around Apollo Client's useMutation with similar interface to useCRUDMutation
 */
import {
  ApolloError,
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useMutation,
} from '@apollo/client';
import { UseFormReturnType } from '@mantine/form';

interface UseGraphQLMutationParams<TData, TVariables extends OperationVariables, TForm> {
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  form: UseFormReturnType<TForm, (values: TForm) => TForm>;
  refetch: () => void;
  close: () => void;
  setError: (error: string) => void;
  handleError?: (error: ApolloError) => string | undefined;
  onCompleted?: (data: TData) => void;
}

export function useGraphQLMutation<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TForm = any,
>(params: UseGraphQLMutationParams<TData, TVariables, TForm>) {
  const { mutation, form, refetch, close, setError, handleError, onCompleted } = params;

  const [mutate, { loading, error, data }] = useMutation<TData, TVariables>(mutation, {
    onCompleted: (data) => {
      form.reset();
      setError('');
      refetch();
      close();
      onCompleted?.(data);
    },
    onError: (error: ApolloError) => {
      const errorMessage = handleError?.(error) ?? error.graphQLErrors[0]?.message ?? error.message;
      setError(errorMessage);
    },
  });

  return {
    mutate: (variables: TVariables) => mutate({ variables }),
    isLoading: loading,
    isError: !!error,
    error,
    data,
  };
}
