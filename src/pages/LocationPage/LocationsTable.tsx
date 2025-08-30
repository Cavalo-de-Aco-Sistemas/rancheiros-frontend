import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Location } from '@/model/location';

const tableHeaders = ['Nome'];

export function LocationsTable() {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Location>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
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

  const rowMapper = useCallback((row: MRT_Row<Location>) => {
    const { name } = row.original;
    return [name];
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
