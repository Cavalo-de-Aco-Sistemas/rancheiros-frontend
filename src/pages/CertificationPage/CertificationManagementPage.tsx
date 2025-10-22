import { useState } from 'react';
import { CertificationManagementForm, CertificationManagementTable } from './index';

export function CertificationManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  return (
    <>
      <CertificationManagementTable
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <CertificationManagementForm />
    </>
  );
}
