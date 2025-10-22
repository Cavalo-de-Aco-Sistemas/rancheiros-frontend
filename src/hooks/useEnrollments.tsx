import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_ENROLLMENTS } from '@/graphql/enrollments';

/**
 * EnrollmentsProvider
 * 
 * Provider para gerenciar o estado CRUD de Inscrições usando GraphQL.
 * 
 * @example
 * ```tsx
 * <EnrollmentsProvider>
 *   <EnrollmentsTable />
 *   <EnrollmentsForm />
 * </EnrollmentsProvider>
 * ```
 */
export function EnrollmentsProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_ENROLLMENTS} dataKey="enrollments">
      {children}
    </GraphQLCRUDProvider>
  );
}

