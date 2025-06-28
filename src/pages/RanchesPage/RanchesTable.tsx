import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { Ranch } from '@/model/ranch';

export function RanchesTable() {
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

  return <CRUDTable columns={columns} title="Ranchos" />;
}
