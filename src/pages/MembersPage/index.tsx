import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import MembersForm from './MembersForm';
import { MembersTable } from './MembersTable';

export function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <CRUDProvider endpoint="members">
      <MembersTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <MembersForm />
    </CRUDProvider>
  );
}
