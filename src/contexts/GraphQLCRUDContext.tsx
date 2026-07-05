import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloError, DocumentNode, useQuery } from '@apollo/client';
import { MRT_RowData } from 'mantine-react-table';
import { useContextProvider } from './useContextProvider';
import { DEFAULT_COLUMN_FILTER_FN } from '@/utils/columnFilterDefaults';

interface Identifiable {
  id: number | string;
}

type CRUDType = MRT_RowData & Identifiable;

interface ColumnFilter {
  id: string;
  value: any;
}

const FILTER_FN_MAP: Record<string, string> = {
  greaterThan: 'gt',
  greaterThanOrEqualTo: 'gte',
  lessThan: 'lt',
  lessThanOrEqualTo: 'lte',
};

// Sorting state from Mantine React Table
export interface SortingState {
  id: string;
  desc: boolean;
}

// Simula a interface do useQuery do react-query para compatibilidade com CRUDTable
interface QueryResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: ApolloError | null;
  refetch: () => void;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
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
  sorting: SortingState[];
  setSorting: React.Dispatch<React.SetStateAction<SortingState[]>>;
  pagination?: {
    page: number;
    limit: number;
  };
  setPagination?: React.Dispatch<React.SetStateAction<{ page: number; limit: number }>>;
}

export const GraphQLCRUDContext = createContext<GraphQLCRUDContextType<CRUDType> | undefined>(
  undefined
);

interface GraphQLCRUDProviderProps {
  query: DocumentNode;
  dataKey: string; // Key to extract data from query result (e.g., 'members', 'users')
  enablePagination?: boolean; // Enable pagination and sorting support
  additionalVariables?: Record<string, any>; // Extra GraphQL variables beyond pagination
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
  enablePagination = false,
  additionalVariables,
}: PropsWithChildren<GraphQLCRUDProviderProps>) => {
  const [selected, setSelected] = useState<CRUDType | undefined>(undefined);
  const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
  const [opened, setOpened] = useState(false);

  // Estados para filtros
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Estados para ordenação e paginação
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 10,
  });

  // Reset to first page when filters change
  useEffect(() => {
    if (enablePagination && columnFilters.length > 0) {
      setPagination((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
    }
  }, [columnFilters, enablePagination]);

  // Convert sorting state to GraphQL pagination args
  const paginationVariables = useMemo(() => {
    if (!enablePagination) {
      return undefined;
    }

    // Support multiple sorting
    const sortByArray = sorting.length > 0 ? sorting.map(s => s.id) : undefined;
    const sortOrderArray = sorting.length > 0 ? sorting.map(s => (s.desc ? 'DESC' : 'ASC')) : undefined;

    // Backward compatibility: also send single sortBy/sortOrder if only one sort field
    const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
    const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined;

    // Include column filters if available
    // Filter out empty filters and ensure proper format
    const filtersToSend = columnFilters && columnFilters.length > 0
      ? columnFilters
          .filter((filter) => {
            // Filter out empty values
            if (filter.value === null || filter.value === undefined || filter.value === '') {
              return false;
            }
            // Filter out empty arrays
            if (Array.isArray(filter.value) && filter.value.length === 0) {
              return false;
            }
            return true;
          })
          .map((filter) => {
            // Normalize filter value - Mantine React Table may send different formats
            let normalizedValue = filter.value;
            let filterFn = (filter as any).filterFn || DEFAULT_COLUMN_FILTER_FN[filter.id];
            
            // If value is an object, try to extract the actual value
            if (typeof filter.value === 'object' && filter.value !== null && !Array.isArray(filter.value)) {
              // Check if it's a Mantine Select value format
              if ('value' in filter.value) {
                normalizedValue = filter.value.value;
                // Extract filterFn from object if present
                if ('filterFn' in filter.value && !filterFn) {
                  filterFn = filter.value.filterFn;
                }
              } else {
                // Keep the object as is (might be a date range or other complex filter)
                normalizedValue = filter.value;
              }
            }

            const result: { id: string; value: any; filterFn?: string } = {
              id: filter.id,
              value: normalizedValue,
            };
            
            // Include filterFn if available
            if (filterFn) {
              result.filterFn = FILTER_FN_MAP[filterFn] || filterFn;
            }
            
            return result;
          })
      : undefined;

    const result = {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(sortByArray && sortByArray.length > 0 && { sortByArray }),
        ...(sortOrderArray && sortOrderArray.length > 0 && { sortOrderArray }),
        ...(filtersToSend && filtersToSend.length > 0 && { columnFilters: filtersToSend }),
      },
    };

    return result;
  }, [enablePagination, pagination, sorting, columnFilters]);

  // Execute GraphQL query
  const variables = useMemo(
    () => ({
      ...(paginationVariables || {}),
      ...(additionalVariables || {}),
    }),
    [paginationVariables, additionalVariables]
  );

  const { data: rawData, loading, error, refetch } = useQuery(graphqlQuery, {
    variables,
    skip: false,
    fetchPolicy: 'network-only', // Always fetch from network when variables change
    notifyOnNetworkStatusChange: true,
  });

  // Transform to match expected interface (compatível com CRUDContext)
  // Handle both array response (no pagination) and paginated response (with pagination)
  const query = useMemo(() => {
    const rawDataValue = rawData?.[dataKey];
    let data: any[] = [];
    let total: number | undefined;
    let page: number | undefined;
    let limit: number | undefined;
    let totalPages: number | undefined;

    // Check if response is paginated (has data property) or direct array
    if (rawDataValue) {
      if (Array.isArray(rawDataValue)) {
        // Direct array response (no pagination)
        data = rawDataValue;
        total = rawDataValue.length;
        page = 1;
        limit = rawDataValue.length;
        totalPages = 1;
      } else if (rawDataValue.data && Array.isArray(rawDataValue.data)) {
        // Paginated response
        data = rawDataValue.data;
        total = rawDataValue.total;
        page = rawDataValue.page;
        limit = rawDataValue.limit;
        totalPages = rawDataValue.totalPages;
      }
    }

    return {
      data,
      isLoading: loading,
      isError: !!error,
      isFetching: loading,
      error: error || null,
      refetch: () => {
        refetch();
      },
      total,
      page,
      limit,
      totalPages,
    };
  }, [rawData, dataKey, loading, error, refetch]);

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
      sorting,
      setSorting,
      ...(enablePagination && {
        pagination,
        setPagination,
      }),
    }),
    [
      query,
      selected,
      action,
      open,
      close,
      opened,
      columnFilters,
      globalFilter,
      sorting,
      enablePagination,
      pagination,
    ]
  );

  return <GraphQLCRUDContext.Provider value={value}>{children}</GraphQLCRUDContext.Provider>;
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
