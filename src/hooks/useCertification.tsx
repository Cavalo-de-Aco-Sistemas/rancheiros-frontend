import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CERTIFICATION_ENROLLMENTS } from '@/graphql/enrollments';

/**
 * CertificationProvider
 *
 * Provider para gerenciar o estado CRUD de Inscrições para Certification Management.
 * Filtra automaticamente apenas inscrições com status CONFIRMED.
 *
 * @example
 * ```tsx
 * <CertificationProvider>
 *   <CertificationManagementTable />
 *   <CertificationManagementForm />
 * </CertificationProvider>
 * ```
 */
export function CertificationProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_CERTIFICATION_ENROLLMENTS} dataKey="enrollments">
      {children}
    </GraphQLCRUDProvider>
  );
}

/**
 * Hook para acessar o contexto de Certification
 *
 * @returns Contexto de Certification com dados filtrados por status CONFIRMED
 */
export { useGraphQLCRUD as useCertification } from '@/contexts/GraphQLCRUDContext';
