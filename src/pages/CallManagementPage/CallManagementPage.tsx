import { useState } from 'react';
import { GraphQLCRUDProvider } from '@/contexts/GraphQLCRUDContext';
import { GET_CALL_MANAGEMENT_ENROLLMENTS } from '@/graphql/enrollments';
import { CallManagementForm, CallManagementTable } from './index';

export function CallManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <GraphQLCRUDProvider query={GET_CALL_MANAGEMENT_ENROLLMENTS} dataKey="enrollments">
      <CallManagementTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <CallManagementForm />
    </GraphQLCRUDProvider>
  );
}
