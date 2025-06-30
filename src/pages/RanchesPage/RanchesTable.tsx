import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Ranch } from '@/model/ranch';

const tableHeaders = ['Nome'];

export function RanchesTable() {
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
      query.data?.map(({ name }) => ({
        Nome: name,
      })) ?? [],
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Ranch>) => {
    const { name } = row.original;
    return [name];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return <CRUDTable columns={columns} title="Ranchos" csvData={csvData} pdfConfig={pdfConfig} />;
}
