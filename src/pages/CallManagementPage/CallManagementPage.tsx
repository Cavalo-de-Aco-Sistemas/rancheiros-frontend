import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { CallManagementForm, CallManagementTable } from './index';

export function CallManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <CRUDProvider
      endpoint="enrollments"
      params={{
        status: 'waiting,called,confirmed,ignored,dropped',
        activeClassesOnly: true,
        page: currentPage,
        limit: pageSize,
      }}
      usePagination
      enableFilters
      pageId="call-management"
    >
            <CallManagementTable
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              pageSize={pageSize}
            />
      <CallManagementForm />
    </CRUDProvider>
  );
}
