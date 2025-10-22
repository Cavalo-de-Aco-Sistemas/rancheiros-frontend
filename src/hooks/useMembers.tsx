import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_MEMBERS } from '@/graphql/members';

/**
 * MembersProvider
 * 
 * Provider para gerenciar o estado CRUD de Membros usando GraphQL.
 * Encapsula a query GraphQL e fornece o contexto para componentes filhos.
 * 
 * @example
 * ```tsx
 * <MembersProvider>
 *   <MembersTable />
 *   <MembersForm />
 * </MembersProvider>
 * ```
 */
export function MembersProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_MEMBERS} dataKey="members">
      {children}
    </GraphQLCRUDProvider>
  );
}

