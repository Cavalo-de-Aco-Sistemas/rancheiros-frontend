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
   * Invalidate all queries for a specific endpoint
   * This will invalidate all variations (with different params, pageId, etc.)
   */
  const invalidateQuery = (endpoint: string) => {
    queryClient.invalidateQueries({
      queryKey: [authToken, endpoint],
      exact: false, // Changed to false to match all queries starting with [authToken, endpoint]
    });
  };

  /**
   * Update query data optimistically for all queries with the same endpoint
   * Useful for immediate UI updates across all pages
   */
  const updateQueryData = <T>(endpoint: string, updater: (oldData: T[] | undefined) => T[]) => {
    // Get all queries that start with [authToken, endpoint]
    const queries = queryClient.getQueryCache().findAll({
      queryKey: [authToken, endpoint],
      exact: false,
    });
    
    // Update each query's data
    queries.forEach(query => {
      const currentData = queryClient.getQueryData(query.queryKey);
      
      // Check if data is paginated or simple array
      if (currentData && typeof currentData === 'object' && 'data' in currentData) {
        // Paginated data
        const paginatedData = currentData as any;
        const updatedData = updater(paginatedData.data);
        queryClient.setQueryData(query.queryKey, {
          ...paginatedData,
          data: updatedData
        });
      } else {
        // Simple array data
        queryClient.setQueryData(query.queryKey, updater);
      }
    });
  };

  /**
   * Get current query data without triggering a fetch
   * Returns data from the first matching query
   */
  const getQueryData = <T>(endpoint: string): T[] | undefined => {
    const queries = queryClient.getQueryCache().findAll({
      queryKey: [authToken, endpoint],
      exact: false,
    });
    
    if (queries.length > 0) {
      const currentData = queryClient.getQueryData(queries[0].queryKey);
      
      // Check if data is paginated or simple array
      if (currentData && typeof currentData === 'object' && 'data' in currentData) {
        // Paginated data - return the data array
        return (currentData as any).data;
      } else {
        // Simple array data
        return currentData as T[];
      }
    }
    return undefined;
  };

  /**
   * Cancel ongoing queries to prevent race conditions
   */
  const cancelQueries = (endpoint: string) => {
    return queryClient.cancelQueries({ 
      queryKey: [authToken, endpoint],
      exact: false,
    });
  };

  return {
    invalidateQuery,
    updateQueryData,
    getQueryData,
    cancelQueries,
  };
}