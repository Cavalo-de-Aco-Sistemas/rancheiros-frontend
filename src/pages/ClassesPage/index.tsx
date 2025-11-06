import { useState } from 'react';
import { ClassesProvider } from '@/hooks/useClasses';
import { ClassesForm } from './ClassesForm';
import { ClassesTable } from './ClassesTable';

export function ClassesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <ClassesProvider>
      <ClassesTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <ClassesForm />
    </ClassesProvider>
  );
}
