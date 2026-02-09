import { useState } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CERTIFICATION_ENROLLMENTS } from '@/graphql/enrollments';
import { CertificationManagementForm, CertificationManagementTable } from './index';

export function CertificationManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <GraphQLCRUDProvider query={GET_CERTIFICATION_ENROLLMENTS} dataKey="enrollments" enablePagination>
      <CertificationManagementTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <CertificationManagementForm />
    </GraphQLCRUDProvider>
  );
}
