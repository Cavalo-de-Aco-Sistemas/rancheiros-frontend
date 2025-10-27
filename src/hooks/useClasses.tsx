import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CLASSES } from '@/graphql/classes';

/**
 * ClassesProvider
 *
 * Provider para gerenciar o estado CRUD de Classes usando GraphQL.
 *
 * @example
 * ```tsx
 * <ClassesProvider>
 *   <ClassesTable />
 *   <ClassesForm />
 * </ClassesProvider>
 * ```
 */
export function ClassesProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_CLASSES} dataKey="classes">
      {children}
    </GraphQLCRUDProvider>
  );
}
