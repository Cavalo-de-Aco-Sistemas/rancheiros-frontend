import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Location } from '@/model/location';
import { Badge } from '@mantine/core';

const tableHeaders = ['Nome', 'Rancho'];

export function LocationsTable() {
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
      query.data?.map(({ name, ranch }) => ({
        Nome: name,
        Rancho: ranch?.name ?? '',
      })) ?? [],
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Location>): string[] => {
    const { name, ranch } = row.original;
    return [name,
      ranch?.name ?? ''];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return (
    <CRUDTable
      columns={columns}
      title="Locais de Treinamento"
      csvData={csvData}
      pdfConfig={pdfConfig}
    />
  );
}
