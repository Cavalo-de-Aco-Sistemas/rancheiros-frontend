import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_USERS } from '@/graphql/users';

/**
 * UsersProvider
 *
 * Provider para gerenciar o estado CRUD de Usuários usando GraphQL.
 *
 * @example
 * ```tsx
 * <UsersProvider>
 *   <UsersTable />
 *   <UsersForm />
 * </UsersProvider>
 * ```
 */
export function UsersProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_USERS} dataKey="users">
      {children}
    </GraphQLCRUDProvider>
  );
}
