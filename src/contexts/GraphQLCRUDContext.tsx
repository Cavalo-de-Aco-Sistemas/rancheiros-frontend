import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { ApolloError, DocumentNode, useQuery } from '@apollo/client';
import { MRT_RowData } from 'mantine-react-table';
import { useContextProvider } from './useContextProvider';

interface Identifiable {
  id: number | string;
}

type CRUDType = MRT_RowData & Identifiable;

interface ColumnFilter {
  id: string;
  value: any;
}

// Simula a interface do useQuery do react-query para compatibilidade com CRUDTable
interface QueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: ApolloError | null;
  refetch: () => void;
}

export interface GraphQLCRUDContextType<T extends CRUDType> {
  query: QueryResult<T>;
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>;
  setAction: React.Dispatch<React.SetStateAction<'create' | 'update' | 'delete'>>;
  action: 'create' | 'update' | 'delete';
  open: () => void;
  opened: boolean;
  close: () => void;
  selected?: T;
  columnFilters: ColumnFilter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const GraphQLCRUDContext = createContext<
  GraphQLCRUDContextType<CRUDType> | undefined
>(undefined);

interface GraphQLCRUDProviderProps {
  query: DocumentNode;
  dataKey: string; // Key to extract data from query result (e.g., 'members', 'users')
}

/**
 * GraphQLCRUDProvider
 * 
 * Provider para CRUD usando Apollo Client/GraphQL, compatível com CRUDTable.
 * 
 * @example
 * ```tsx
 * import { GET_MEMBERS } from '@/graphql/members';
 * 
 * <GraphQLCRUDProvider query={GET_MEMBERS} dataKey="members">
 *   <MembersTable />
 *   <MembersForm />
 * </GraphQLCRUDProvider>
 * ```
 */
export const GraphQLCRUDProvider = ({
  children,
  query: graphqlQuery,
  dataKey,
}: PropsWithChildren<GraphQLCRUDProviderProps>) => {
  const [selected, setSelected] = useState<CRUDType | undefined>(undefined);
  const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
  const [opened, setOpened] = useState(false);

  // Estados para filtros
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Execute GraphQL query
  const { data: rawData, loading, error, refetch } = useQuery(graphqlQuery);

  // Transform to match expected interface (compatível com CRUDContext)
  const query = useMemo(
    () => ({
      data: rawData?.[dataKey] || [],
      isLoading: loading,
      isError: !!error,
      isFetching: loading,
      error: error || null,
      refetch: () => {
        refetch();
      },
    }),
    [rawData, dataKey, loading, error, refetch]
  );

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);

  const value = useMemo(
    () => ({
      query,
      setSelected,
      setAction,
      open,
      close,
      selected,
      action,
      opened,
      columnFilters,
      setColumnFilters,
      globalFilter,
      setGlobalFilter,
    }),
    [
      query,
      selected,
      action,
      opened,
      columnFilters,
      globalFilter,
    ]
  );

  return (
    <GraphQLCRUDContext.Provider value={value}>{children}</GraphQLCRUDContext.Provider>
  );
};

/**
 * useGraphQLCRUD
 * 
 * Hook para acessar o contexto CRUD do GraphQL.
 * Compatível com useCRUD() do CRUDContext.
 * 
 * @example
 * ```tsx
 * const { query, selected, action, open, close } = useGraphQLCRUD();
 * ```
 */
export const useGraphQLCRUD = (): GraphQLCRUDContextType<CRUDType> => {
  return useContextProvider(GraphQLCRUDContext, 'useGraphQLCRUD', 'GraphQLCRUDProvider');
};

