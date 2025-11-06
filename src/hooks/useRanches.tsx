import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_RANCHES } from '@/graphql/ranches';

/**
 * RanchesProvider
 *
 * Provider para gerenciar o estado CRUD de Ranchos usando GraphQL.
 *
 * @example
 * ```tsx
 * <RanchesProvider>
 *   <RanchesTable />
 *   <RanchesForm />
 * </RanchesProvider>
 * ```
 */
export function RanchesProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_RANCHES} dataKey="ranches">
      {children}
    </GraphQLCRUDProvider>
  );
}
