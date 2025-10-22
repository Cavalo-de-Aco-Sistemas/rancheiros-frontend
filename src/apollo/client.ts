import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_BACKEND_ADDRESS 
  ? `${import.meta.env.VITE_BACKEND_ADDRESS}/graphql`
  : 'http://localhost:3000/graphql';

export const createApolloClient = (
  authToken: string | null,
  onUnauthorized: () => void
) => {
  const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        
        // Handle unauthorized errors
        if (extensions?.code === 'UNAUTHENTICATED' || message.includes('não autenticado')) {
          onUnauthorized();
        }
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      // Check for 401 status
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        onUnauthorized();
      }
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
};

