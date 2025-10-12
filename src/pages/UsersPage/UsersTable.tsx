import { useCallback, useMemo } from 'react';
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
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Badge, Group, Indicator, Tooltip } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Ranch } from '@/model/ranch';
import { Permissions, User } from '@/model/user';

function PermissionRow({ permission }: { permission: Permissions | undefined }) {
  if (!permission) {
    return (
      <Group>
        <IconStarOff stroke={1} color="gray" />
        <IconEyeOff stroke={1} color="gray" />
        <IconEditOff stroke={1} color="gray" />
        <IconTrashOff stroke={1} color="gray" />
      </Group>
    );
  }
  
  return (
    <Group>
      {permission.create ? <IconStar stroke={1.5} /> : <IconStarOff stroke={1} color="gray" />}
      {permission.read ? <IconEye stroke={1.5} /> : <IconEyeOff stroke={1} color="gray" />}
      {permission.update ? <IconEdit stroke={1.5} /> : <IconEditOff stroke={1} color="gray" />}
      {permission.delete ? <IconTrash stroke={1.5} /> : <IconTrashOff stroke={1} color="gray" />}
    </Group>
  );
}

const tableHeaders = [
  'Usuário',
  'Nome',
  'Super Admin',
  'Membros',
  'Turmas',
  'Inscrições',
  'Locais MPV',
  'Ranchos',
  'Fluxo',
  'Filtros',
];

const permissionsToString = (permissions: Permissions | undefined) => {
  if (!permissions) {
    return '';
  }
  return Object.entries(permissions)
    .filter(([_, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase())
    .join(', ');
};

export function UsersTable() {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: 'username', header: 'Usuário' },
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'super_admin',
        header: 'Super Admin',
        Cell: ({ row }) => (
          <Badge 
            color={row.original.super_admin ? 'green' : 'gray'} 
            variant={row.original.super_admin ? 'filled' : 'light'}
          >
            {row.original.super_admin ? 'Sim' : 'Não'}
          </Badge>
        ),
      },
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
        accessorKey: 'permissions.flow',
        header: 'Fluxo',
        Cell: ({ row }) => <PermissionRow permission={row.original.permissions.flow} />,
      },
      {
        accessorKey: 'ranches',
        header: 'Filtros',
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

  const csvData = useMemo(
    () =>
      query.data?.map(({ username, name, super_admin, permissions, ranches }) => ({
        Usuário: username,
        Nome: name,
        'Super Admin': super_admin ? 'Sim' : 'Não',
        Membros: permissionsToString(permissions.members),
        Turmas: permissionsToString(permissions.classes),
        Inscrições: permissionsToString(permissions.enrollments),
        'Locais MPV': permissionsToString(permissions.locations),
        Ranchos: permissionsToString(permissions.ranches),
        Fluxo: permissionsToString(permissions.flow),
        Filtros: ranches.map((ranch: Ranch) => ranch.name).join(', '),
      })) ?? [],
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<User>): string[] => {
    const { username, name, super_admin, permissions, ranches } = row.original;
    return [
      username,
      name,
      super_admin ? 'Sim' : 'Não',
      permissionsToString(permissions.members),
      permissionsToString(permissions.classes),
      permissionsToString(permissions.enrollments),
      permissionsToString(permissions.locations),
      permissionsToString(permissions.ranches),
      permissionsToString(permissions.flow),
      ranches.map((ranch: Ranch) => ranch.name).join(', '),
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return <CRUDTable columns={columns} title="Usuários" csvData={csvData} pdfConfig={pdfConfig} />;
}
