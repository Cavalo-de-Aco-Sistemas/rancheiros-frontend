import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '@/graphql/auth';

export default function useLoginMutation() {
  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  return {
    mutate: (
      credentials: { username: string; password: string },
      options?: {
        onSuccess?: (data: any) => void;
        onError?: (error: any) => void;
      }
    ) => {
      loginMutation({ variables: { input: credentials } })
        .then((result) => {
          if (options?.onSuccess) {
            options.onSuccess(result.data?.login);
          }
        })
        .catch((err) => {
          if (options?.onError) {
            options.onError(err);
          }
        });
    },
    mutateAsync: async (credentials: { username: string; password: string }) => {
      const result = await loginMutation({ variables: { input: credentials } });
      return result.data?.login;
    },
    data: data?.login,
    isPending: loading,
    loading,
    error,
  };
}
