import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Location } from '@/model/location';
import { extractData } from '@/utils/dataUtils';

const tableHeaders = ['Nome', 'Rancho'];

interface LocationsTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function LocationsTable({
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 10,
}: LocationsTableProps = {}) {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Location>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
      },
      {
        accessorKey: 'ranch.name',
        header: 'Rancho',
        Cell: ({ row }) =>
          row.original.ranch?.name && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.ranch.name}
            </Badge>
          ),
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      extractData(query.data).map(({ name, ranch }: any) => ({
        Nome: name,
        Rancho: ranch?.name ?? '',
      })),
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Location>): string[] => {
    const { name, ranch } = row.original;
    return [name, ranch?.name ?? ''];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  // Paginação client-side
  const allData = useMemo(() => {
    return extractData(query.data) as unknown as Location[];
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
      title="Locais de Treinamento"
      csvData={csvData}
      pdfConfig={pdfConfig}
      data={paginatedData}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyStateMessage="Nenhum local de treinamento encontrado"
      emptyStateDescription="Os locais de treinamento aparecerão aqui conforme forem sendo criados"
    />
  );
}
