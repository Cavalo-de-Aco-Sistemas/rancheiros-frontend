import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Ranch } from '@/model/ranch';
import { extractData } from '@/utils/dataUtils';

const tableHeaders = ['Nome'];

interface RanchesTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function RanchesTable({
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 10,
}: RanchesTableProps = {}) {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Ranch>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        Cell: ({ row }) =>
          row.original.name && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.name}
            </Badge>
          ),
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      extractData(query.data).map(({ name }: any) => ({
        Nome: name,
      })),
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Ranch>) => {
    const { name } = row.original;
    return [name];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  // Paginação client-side
  const allData = useMemo(() => {
    return extractData(query.data) as unknown as Ranch[];
  }, [query.data]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allData.slice(startIndex, endIndex);
  }, [allData, currentPage, pageSize]);

  const pagination = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    total: allData.length,
    totalPages: Math.ceil(allData.length / pageSize),
  }), [allData.length, currentPage, pageSize]);

  return (
    <CRUDTable 
      columns={columns} 
      title="Ranchos" 
      csvData={csvData} 
      pdfConfig={pdfConfig} 
      data={paginatedData}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyStateMessage="Nenhum rancho encontrado"
      emptyStateDescription="Os ranchos aparecerão aqui conforme forem sendo criados"
    />
  );
}
