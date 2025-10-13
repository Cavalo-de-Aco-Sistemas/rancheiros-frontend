import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { EnrollmentsForm } from './EnrollmentsForm';
import { EnrollmentsTable } from './EnrollmentsTable';

export function EnrollmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <CRUDProvider 
      endpoint="enrollments" 
      pageId="enrollments-overview" 
      enableFilters
      usePagination
      params={{
        page: currentPage,
        limit: pageSize,
      }}
    >
      <EnrollmentsTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <EnrollmentsForm />
    </CRUDProvider>
  );
}
