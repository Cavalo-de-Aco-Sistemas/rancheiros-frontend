import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { RanchesForm } from './RanchesForm';
import { RanchesTable } from './RanchesTable';

export function RanchesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <CRUDProvider endpoint="ranches">
      <RanchesTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <RanchesForm />
    </CRUDProvider>
  );
}
