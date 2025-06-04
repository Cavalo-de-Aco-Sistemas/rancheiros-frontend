import { useMemo } from 'react';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';

type User = {
  id: number;
  username: string;
  admin: boolean;
};

const data: User[] = [
  {
    id: 1,
    username: 'admin',
    admin: true,
  },
  {
    id: 2,
    username: 'user',
    admin: false,
  },
  {
    id: 3,
    username: 'user2',
    admin: false,
  },
];

export function UsersPage() {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'admin',
        header: 'Admin',
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    mantinePaperProps: {
      style: {
        border: 'none',
      },
    },
    enableBottomToolbar: false,
    enablePagination: false,
    enableRowVirtualization: true,
    mantineTableContainerProps: { style: { maxHeight: 'calc(100vh - 128px)' } },
  });

  return <MantineReactTable table={table} />;
}
