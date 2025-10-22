import { useState } from 'react';
import { RanchesProvider } from '@/hooks/useRanches';
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
    <RanchesProvider>
      <RanchesTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <RanchesForm />
    </RanchesProvider>
  );
}
