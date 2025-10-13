import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { MRT_RowData } from 'mantine-react-table';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { useContextProvider } from './useContextProvider';

interface Identifiable {
  id: number;
}

type CRUDType = MRT_RowData & Identifiable;

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CRUDContextType<T extends CRUDType> {
  query: UseQueryResult<T[] | PaginatedResult<T>, Error>;
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>;
  setAction: React.Dispatch<React.SetStateAction<'create' | 'update' | 'delete'>>;
  action: 'create' | 'update' | 'delete';
  open: () => void;
  opened: boolean;
  close: () => void;
  selected?: T;
  // Filtros
  columnFilters: ColumnFilter[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const CRUDContext = createContext<CRUDContextType<CRUDType> | undefined>(undefined);

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

interface ColumnFilter {
  id: string;
  value: any;
}

interface CRUDProviderProps {
  endpoint: string;
  params?: QueryParams;
  usePagination?: boolean;
  pageId?: string; // Identificador único para a página
  enableFilters?: boolean; // Habilita filtros de colunas
}

export const CRUDProvider = ({
  children,
  endpoint,
  params,
  usePagination = false,
  pageId,
  enableFilters = false,
}: PropsWithChildren<CRUDProviderProps>) => {
  const [selected, setSelected] = useState<CRUDType | undefined>(undefined);
  const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
  const [opened, setOpened] = useState(false);
  
  // Estados para filtros
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  // Criar parâmetros únicos incluindo o pageId e filtros
  const uniqueParams = useMemo(() => {
    let finalParams = { ...params };
    
    if (pageId) {
      finalParams._pageId = pageId;
    }
    
    // Adicionar filtros de colunas se habilitado
    if (enableFilters) {
      // Adicionar filtro global
      if (globalFilter) {
        finalParams.search = globalFilter;
      }
      
      // Adicionar filtros de colunas
      columnFilters.forEach(filter => {
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          finalParams[`filter_${filter.id}`] = filter.value;
        }
      });
    }
    
    return finalParams;
  }, [params, pageId, enableFilters, globalFilter, columnFilters]);

  const query = useCRUDQuery<CRUDType>(endpoint, uniqueParams, { usePagination });

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
    [query, setSelected, setAction, open, close, selected, action, opened, columnFilters, globalFilter]
  );

  return <CRUDContext.Provider value={value}>{children}</CRUDContext.Provider>;
};

export const useCRUD = (): CRUDContextType<CRUDType> => {
  return useContextProvider(CRUDContext, 'useCRUD', 'CRUDProvider');
};
