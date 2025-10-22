import { useState } from 'react';
import { UsersProvider } from '@/hooks/useUsers';
import { UsersForm } from './UsersForm';
import { UsersTable } from './UsersTable';

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página quando mudar o tamanho
  };

  return (
    <UsersProvider>
      <UsersTable
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        pageSize={pageSize}
      />
      <UsersForm />
    </UsersProvider>
  );
}
