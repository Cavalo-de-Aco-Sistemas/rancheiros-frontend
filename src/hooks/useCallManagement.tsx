import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CALL_MANAGEMENT_ENROLLMENTS } from '@/graphql/enrollments';

/**
 * CallManagementProvider
 * 
 * Provider para gerenciar o estado CRUD de Inscrições para Call Management.
 * Usa query específica que busca todos os enrollments (filtro aplicado na tabela).
 * 
 * @example
 * ```tsx
 * <CallManagementProvider>
 *   <CallManagementTable />
 *   <CallManagementForm />
 * </CallManagementProvider>
 * ```
 */
export function CallManagementProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_CALL_MANAGEMENT_ENROLLMENTS} dataKey="enrollments">
      {children}
    </GraphQLCRUDProvider>
  );
}

/**
 * Hook para acessar o contexto de Call Management
 * 
 * @returns Contexto de Call Management com dados filtrados (exclui CERTIFIED e MISSED)
 */
export { useGraphQLCRUD as useCallManagement } from '@/contexts/GraphQLCRUDContext';
