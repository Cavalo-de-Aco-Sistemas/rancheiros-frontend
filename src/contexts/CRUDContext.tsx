import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { MRT_RowData } from 'mantine-react-table';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { useContextProvider } from './useContextProvider';

interface Identifiable {
  id: string;
}

type CRUDType = MRT_RowData & Identifiable;

export interface CRUDContextType<T extends CRUDType> {
  query: UseQueryResult<T[], Error>;
  setSelected: React.Dispatch<React.SetStateAction<T | undefined>>;
  setAction: React.Dispatch<React.SetStateAction<'create' | 'update' | 'delete'>>;
  action: 'create' | 'update' | 'delete';
  open: () => void;
  opened: boolean;
  close: () => void;
  selected?: T;
}

export const CRUDContext = createContext<CRUDContextType<CRUDType> | undefined>(undefined);

interface CRUDProviderProps {
  endpoint: string;
}

export const CRUDProvider = ({ children, endpoint }: PropsWithChildren<CRUDProviderProps>) => {
  const [selected, setSelected] = useState<CRUDType | undefined>(undefined);
  const [action, setAction] = useState<'create' | 'update' | 'delete'>('create');
  const [opened, setOpened] = useState(false);
  const query = useCRUDQuery<CRUDType>(endpoint);

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
    }),
    [query, setSelected, setAction, open, close, selected, action, opened]
  );

  return <CRUDContext.Provider value={value}>{children}</CRUDContext.Provider>;
};

export const useCRUD = (): CRUDContextType<CRUDType> => {
  return useContextProvider(CRUDContext, 'useCRUD', 'CRUDProvider');
};
