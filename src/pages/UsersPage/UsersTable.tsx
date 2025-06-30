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
import { Badge, Group, Indicator, Tooltip } from '@mantine/core';
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
        header: 'Locais MPV',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.locations} />,
      },
      {
        accessorKey: 'permissions.ranches',
        header: 'Ranchos',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.ranches} />,
      },
      {
        accessorKey: 'ranches',
        header: 'Ranchos',
        Cell: ({ row }) =>
          row.original.ranches.length > 0 && (
            <Tooltip label={row.original.ranches.map((ranch) => ranch.name).join(', ')}>
              <Indicator
                inline
                disabled={row.original.ranches.length <= 1}
                label={`+${row.original.ranches.length - 1}`}
                size={16}
              >
                <Badge ff="Rye" variant="outline" color="white" radius="xs">
                  {row.original.ranches[0].name}
                </Badge>
              </Indicator>
            </Tooltip>
          ),
      },
    ],
    []
  );

  return <CRUDTable columns={columns} title="Usuários" />;
}
