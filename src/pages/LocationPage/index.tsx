import { useState } from 'react';
import { LocationsProvider } from '@/hooks/useLocations';
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
    <LocationsProvider>
      <LocationsTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <LocationsForm />
    </LocationsProvider>
  );
}
