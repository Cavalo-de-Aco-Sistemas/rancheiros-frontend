import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Checkbox } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';

export function ClassesTable() {
  const columns = useMemo<MRT_ColumnDef<Class>[]>(
    () => [
      { accessorKey: 'location.name', header: 'Local do MPV' },
      {
        accessorKey: 'date',
        header: 'Data',
        Cell: ({ row }) => dateBR(row.original.date),
      },
      { accessorKey: 'mapsLink', header: 'Link do Maps' },
      {
        accessorKey: 'active',
        header: 'Ativo',
        Cell: ({ row }) => <Checkbox.Indicator checked={row.original.active} radius="xl" />,
      },
    ],
    []
  );

  return <CRUDTable columns={columns} title="Turmas" />;
}
