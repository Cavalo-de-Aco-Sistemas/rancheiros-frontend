import { useState } from 'react';
import { CRUDProvider } from '@/contexts/CRUDContext';
import { LocationsForm } from './LocationsForm';
import { LocationsTable } from './LocationsTable';

export function LocationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <CRUDProvider endpoint="locations">
      <LocationsTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <LocationsForm />
    </CRUDProvider>
  );
}
