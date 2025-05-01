import { useMemo } from 'react';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { UseQueryResult } from '@tanstack/react-query';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.cjs';
import { ActionIcon, Anchor, Badge, Group, Menu, rem } from '@mantine/core';
import { Member } from '@/model/member';
import { phasesOptions, ranchOptions } from './MembersForm';

const optionsToObject = (
  options: {
    label: string;
    value: string;
  }[]
) => {
  return Object.fromEntries(options.map(({ label, value }) => [value, label]));
};

const dateBR = (date: string | null) => date?.split('-').reverse().join('/');
const digits = /\d+/g;
const ranchs = optionsToObject(ranchOptions);
const phases = optionsToObject(phasesOptions);

interface MembersTableProps {
  membersQuery: UseQueryResult<Member[], Error>;
  setSelected: React.Dispatch<React.SetStateAction<Member | undefined>>;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  open: () => void;
}

export function MembersTable(props: MembersTableProps) {
  const { membersQuery, setSelected, setAction, open } = props;
  const { data, isLoading } = membersQuery;
  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'patch',
        header: 'Nome no Patch',
        Cell: ({ row }) =>
          row.original.patch && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.patch}
            </Badge>
          ),
      },
      {
        accessorKey: 'blood',
        header: 'Tipo sanguíneo',
        Cell: ({ row }) =>
          row.original.blood && (
            <Badge ff="Rye" variant="transparent" color="red.6" radius="xs">
              {row.original.blood}
            </Badge>
          ),
      },
      {
        accessorKey: 'phase',
        header: 'Fase',
        Cell: ({ row }) => phases[row.original.phase ?? ''] ?? '',
      },
      {
        accessorKey: 'birthday',
        header: 'Aniversário',
        Cell: ({ row }) => dateBR(row.original.birthday),
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        Cell: ({ row }) =>
          row.original.phone && (
            <Anchor
              href={
                (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
                  ? 'whatsapp://wa.me/55'
                  : 'https://wa.me/55') + row.original.phone.match(digits)?.join('')
              }
              target="_blank"
              rel="noreferrer"
              size='sm'
            >
              {row.original.phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')}
            </Anchor>
          ),
      },
      {
        accessorKey: 'ranch',
        header: 'Rancho',
        Cell: ({ row }) => ranchs[row.original.ranch ?? ''] ?? '',
      },
      { accessorKey: 'residence', header: 'Residência' },
      { accessorKey: 'responsibility', header: 'Encargo' },
      {
        accessorKey: 'dateProspect',
        header: 'Data Prospect',
        Cell: ({ row }) => dateBR(row.original.dateProspect),
      },
      {
        accessorKey: 'dateHalfPatch',
        header: 'Data Meio escudo',
        Cell: ({ row }) => dateBR(row.original.dateHalfPatch),
      },
      {
        accessorKey: 'dateFullPatch',
        header: 'Data Full patch',
        Cell: ({ row }) => dateBR(row.original.dateFullPatch),
      },
      { accessorKey: 'spouse.name', header: 'Cônjuge' },
      { accessorKey: 'godfather.name', header: 'Padrinho' },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    localization: MRT_Localization_PT_BR,
    state: { isLoading },
    mantinePaperProps: {
      style: {
        border: 'none',
      },
    },
    enableBottomToolbar: false,
    enablePagination: false,
    enableRowVirtualization: true,
    mantineTableContainerProps: { style: { maxHeight: 'calc(100vh - 128px)' } },
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => {
      return (
        <>
          <Menu.Item
            onClick={() => {
              open();
              setSelected(data?.[row.index]);
              setAction('update');
            }}
            leftSection={<IconEdit style={{ width: rem(16), height: rem(16) }} />}
          >
            Editar
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              open();
              setSelected(data?.[row.index]);
              setAction('delete');
            }}
            color="red"
            leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
          >
            Excluir
          </Menu.Item>
        </>
      );
    },

    renderToolbarInternalActions: ({ table }) => (
      <Group>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <ActionIcon
          onClick={() => {
            setSelected(undefined);
            setAction('create');
            open();
          }}
          variant="transparent"
          color="brand.4"
        >
          <IconPlus />
        </ActionIcon>
      </Group>
    ),
  });

  return <MantineReactTable table={table} />;
}
