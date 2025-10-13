import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { CertificationManagementForm, CertificationManagementTable } from './index';

export function CertificationManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  return (
    <CRUDProvider
      endpoint="enrollments"
      params={{
        status: 'confirmed',
        activeClassesOnly: true,
        page: currentPage,
        limit: pageSize,
      }}
      usePagination
      enableFilters
      pageId="certification-management"
    >
            <CertificationManagementTable
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              currentPage={currentPage}
              pageSize={pageSize}
            />
      <CertificationManagementForm />
    </CRUDProvider>
  );
}
