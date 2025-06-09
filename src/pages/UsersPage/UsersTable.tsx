import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Checkbox } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { User } from '@/model/user';

export function UsersTable() {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'username', header: 'Usuário' },
      {
        accessorKey: 'admin',
        header: 'Admin',
        Cell: ({ row }) => <Checkbox.Indicator checked={row.original.admin} radius="xl" />,
      },
    ],
    []
  );

  return <CRUDTable columns={columns} />;
}
