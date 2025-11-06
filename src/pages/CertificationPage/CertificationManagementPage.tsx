import { useState } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CERTIFICATION_ENROLLMENTS } from '@/graphql/enrollments';
import { CertificationManagementForm, CertificationManagementTable } from './index';

export function CertificationManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  return (
    <GraphQLCRUDProvider query={GET_CERTIFICATION_ENROLLMENTS} dataKey="enrollments">
      <CertificationManagementTable
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <CertificationManagementForm />
    </GraphQLCRUDProvider>
  );
}
