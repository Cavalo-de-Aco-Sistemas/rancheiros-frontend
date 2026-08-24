import { ReactNode } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_ACTION_LOGS } from '@/graphql/actionLogs';

/**
 * ActionLogsProvider
 *
 * Provider para o log de ações (somente leitura) usando GraphQL.
 *
 * @example
 * ```tsx
 * <ActionLogsProvider>
 *   <ActionLogTable />
 * </ActionLogsProvider>
 * ```
 */
export function ActionLogsProvider({ children }: { children: ReactNode }) {
  return (
    <GraphQLCRUDProvider query={GET_ACTION_LOGS} dataKey="actionLogs" enablePagination>
      {children}
    </GraphQLCRUDProvider>
  );
}
