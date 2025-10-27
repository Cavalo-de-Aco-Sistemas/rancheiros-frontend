import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_LOCATIONS } from '@/graphql/locations';

/**
 * LocationsProvider
 *
 * Provider para gerenciar o estado CRUD de Locais usando GraphQL.
 *
 * @example
 * ```tsx
 * <LocationsProvider>
 *   <LocationsTable />
 *   <LocationsForm />
 * </LocationsProvider>
 * ```
 */
export function LocationsProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_LOCATIONS} dataKey="locations">
      {children}
    </GraphQLCRUDProvider>
  );
}
