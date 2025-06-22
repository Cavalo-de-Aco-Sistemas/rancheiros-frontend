import { useMemo } from 'react';
import {
  IconEdit,
  IconEditOff,
  IconEye,
  IconEyeOff,
  IconStar,
  IconStarOff,
  IconTrash,
  IconTrashOff,
} from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Group } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { Permissions, User } from '@/model/user';

function PermissionRow({ permission }: { permission: Permissions }) {
  return (
    <Group>
      {permission.create ? <IconStar stroke={1.5} /> : <IconStarOff stroke={1} color="gray" />}
      {permission.read ? <IconEye stroke={1.5} /> : <IconEyeOff stroke={1} color="gray" />}
      {permission.update ? <IconEdit stroke={1.5} /> : <IconEditOff stroke={1} color="gray" />}
      {permission.delete ? <IconTrash stroke={1.5} /> : <IconTrashOff stroke={1} color="gray" />}
    </Group>
  );
}

export function UsersTable() {
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'username', header: 'Usuário' },
      {
        accessorKey: 'permissions.members',
        header: 'Membros',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.members} />,
      },
      {
        accessorKey: 'permissions.classes',
        header: 'Turmas',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.classes} />,
      },
      {
        accessorKey: 'permissions.users',
        header: 'Usuários',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.users} />,
      },
      {
        accessorKey: 'permissions.enrollments',
        header: 'Inscrições',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.enrollments} />,
      },
      {
        accessorKey: 'permissions.locations',
        header: 'Locais',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.locations} />,
      },
    ],
    []
  );

  return <CRUDTable columns={columns} title="Usuários" />;
}
