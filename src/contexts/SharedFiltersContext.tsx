import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface SharedFiltersState {
  columnFilters: Array<{ id: string; value: any }>;
  globalFilter: string;
}

interface SharedFiltersContextType {
  filters: SharedFiltersState;
  setColumnFilters: (filters: Array<{ id: string; value: any }>) => void;
  setGlobalFilter: (filter: string) => void;
  clearFilters: () => void;
}

const SharedFiltersContext = createContext<SharedFiltersContextType | undefined>(undefined);

export function SharedFiltersProvider({ children }: { children: ReactNode }) {
  const [columnFilters, setColumnFiltersState] = useState<Array<{ id: string; value: any }>>([]);
  const [globalFilter, setGlobalFilterState] = useState<string>('');

  const setColumnFilters = useCallback((filters: Array<{ id: string; value: any }>) => {
    setColumnFiltersState(filters);
  }, []);

  const setGlobalFilter = useCallback((filter: string) => {
    setGlobalFilterState(filter);
  }, []);

  const clearFilters = useCallback(() => {
    setColumnFiltersState([]);
    setGlobalFilterState('');
  }, []);

  const value = {
    filters: {
      columnFilters,
      globalFilter,
    },
    setColumnFilters,
    setGlobalFilter,
    clearFilters,
  };

  return (
    <SharedFiltersContext.Provider value={value}>
      {children}
    </SharedFiltersContext.Provider>
  );
}

export function useSharedFilters() {
  const context = useContext(SharedFiltersContext);
  if (!context) {
    throw new Error('useSharedFilters must be used within a SharedFiltersProvider');
  }
  return context;
}
