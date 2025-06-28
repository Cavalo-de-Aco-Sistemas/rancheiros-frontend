import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { Location } from '@/model/location';

export function LocationsTable() {
  const columns = useMemo<MRT_ColumnDef<Location>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
      },
    ],
    []
  );

  return <CRUDTable columns={columns} title="Locais de Treinamento" />;
}
