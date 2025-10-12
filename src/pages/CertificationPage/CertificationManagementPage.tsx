import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { CertificationManagementForm, CertificationManagementTable } from './index';

export function CertificationManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

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
      pageId="certification-management"
    >
      <CertificationManagementTable
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <CertificationManagementForm />
    </CRUDProvider>
  );
}
