import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook for optimized query management
 * Provides utilities for efficient cache invalidation and updates
 */
export function useOptimizedQueries() {
  const queryClient = useQueryClient();
  const { authToken } = useAuth();

  /**
   * Invalidate specific queries with exact matching
   * More efficient than broad invalidation
   */
  const invalidateQuery = (endpoint: string) => {
    queryClient.invalidateQueries({
      queryKey: [authToken, endpoint],
      exact: true,
    });
  };

  /**
   * Update query data optimistically
   * Useful for immediate UI updates
   */
  const updateQueryData = <T>(endpoint: string, updater: (oldData: T[] | undefined) => T[]) => {
    queryClient.setQueryData([authToken, endpoint], updater);
  };

  /**
   * Get current query data without triggering a fetch
   */
  const getQueryData = <T>(endpoint: string): T[] | undefined => {
    return queryClient.getQueryData([authToken, endpoint]);
  };

  /**
   * Cancel ongoing queries to prevent race conditions
   */
  const cancelQueries = (endpoint: string) => {
    return queryClient.cancelQueries({ queryKey: [authToken, endpoint] });
  };

  return {
    invalidateQuery,
    updateQueryData,
    getQueryData,
    cancelQueries,
  };
}