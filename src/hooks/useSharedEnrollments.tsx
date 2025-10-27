import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ENROLLMENTS } from '@/graphql/enrollments';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { normalizeEnrollments } from '@/utils/statusNormalizer';

interface SharedFilters {
  filter_name?: string;
  filter_phone?: string;
  filter_email?: string;
  filter_preferred_city?: string;
  filter_enrollment_date?: string;
  filter_class?: string;
  activeClassesOnly?: boolean;
}

interface SharedEnrollmentsContextType {
  // Dados brutos (todos os enrollments)
  rawEnrollments: Enrollment[];
  loading: boolean;
  error: any;
  refetch: () => void;

  // Dados filtrados para cada página
  enrollmentsForEnrollmentsPage: Enrollment[];
  enrollmentsForCallManagementPage: Enrollment[];
  enrollmentsForCertificationPage: Enrollment[];

  // Filtros compartilhados
  sharedFilters: SharedFilters;
  setSharedFilters: (filters: SharedFilters) => void;
  clearFilters: () => void;
}

const SharedEnrollmentsContext = createContext<SharedEnrollmentsContextType | undefined>(undefined);

/**
 * SharedEnrollmentsProvider
 *
 * Provider que busca os dados UMA ÚNICA VEZ e compartilha entre todas as páginas.
 * Cada página recebe os dados filtrados apropriados.
 *
 * @example
 * ```tsx
 * <SharedEnrollmentsProvider>
 *   <EnrollmentsPage />
 *   <CallManagementPage />
 *   <CertificationPage />
 * </SharedEnrollmentsProvider>
 * ```
 */
export function SharedEnrollmentsProvider({ children }: { children: ReactNode }) {
  const [sharedFilters, setSharedFiltersState] = useState<SharedFilters>({});

  const { data, loading, error, refetch } = useQuery(GET_ENROLLMENTS, {
    variables: {
      ...sharedFilters,
    },
  });

  const setSharedFilters = useCallback((filters: SharedFilters) => {
    setSharedFiltersState(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setSharedFiltersState({});
  }, []);

  const contextValue = useMemo(() => {
    // Dados brutos normalizados
    const rawData = data?.enrollments?.data || [];
    const rawEnrollments = normalizeEnrollments(rawData);

    // Filtros específicos para cada página
    const enrollmentsForEnrollmentsPage = rawEnrollments; // Todos os dados

    const enrollmentsForCallManagementPage = rawEnrollments.filter(
      (enrollment) =>
        enrollment.status !== EnrollmentStatus.CERTIFIED &&
        enrollment.status !== EnrollmentStatus.MISSED
    );

    const enrollmentsForCertificationPage = rawEnrollments.filter(
      (enrollment) => enrollment.status === EnrollmentStatus.CONFIRMED
    );

    return {
      rawEnrollments,
      loading,
      error,
      refetch,
      enrollmentsForEnrollmentsPage,
      enrollmentsForCallManagementPage,
      enrollmentsForCertificationPage,
      sharedFilters,
      setSharedFilters,
      clearFilters,
    };
  }, [data, loading, error, refetch, sharedFilters, setSharedFilters, clearFilters]);

  return (
    <SharedEnrollmentsContext.Provider value={contextValue}>
      {children}
    </SharedEnrollmentsContext.Provider>
  );
}

/**
 * Hook para acessar dados compartilhados de enrollments
 */
export function useSharedEnrollments() {
  const context = useContext(SharedEnrollmentsContext);
  if (!context) {
    throw new Error('useSharedEnrollments must be used within SharedEnrollmentsProvider');
  }
  return context;
}

/**
 * Hook específico para EnrollmentsPage
 */
export function useEnrollmentsData() {
  const {
    enrollmentsForEnrollmentsPage,
    loading,
    error,
    refetch,
    sharedFilters,
    setSharedFilters,
    clearFilters,
  } = useSharedEnrollments();

  return {
    data: enrollmentsForEnrollmentsPage,
    loading,
    error,
    refetch,
    filters: sharedFilters,
    setFilters: setSharedFilters,
    clearFilters,
  };
}

/**
 * Hook específico para CallManagementPage
 */
export function useCallManagementData() {
  const {
    enrollmentsForCallManagementPage,
    loading,
    error,
    refetch,
    sharedFilters,
    setSharedFilters,
    clearFilters,
  } = useSharedEnrollments();

  return {
    data: enrollmentsForCallManagementPage,
    loading,
    error,
    refetch,
    filters: sharedFilters,
    setFilters: setSharedFilters,
    clearFilters,
  };
}

/**
 * Hook específico para CertificationPage
 */
export function useCertificationData() {
  const {
    enrollmentsForCertificationPage,
    loading,
    error,
    refetch,
    sharedFilters,
    setSharedFilters,
    clearFilters,
  } = useSharedEnrollments();

  return {
    data: enrollmentsForCertificationPage,
    loading,
    error,
    refetch,
    filters: sharedFilters,
    setFilters: setSharedFilters,
    clearFilters,
  };
}
