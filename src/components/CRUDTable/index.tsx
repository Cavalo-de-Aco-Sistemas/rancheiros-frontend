import { useMemo } from 'react';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.cjs';
import { useLocation } from 'react-router-dom';
import { ActionIcon, Group, Menu, rem, Title } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { useCRUD } from '@/contexts/CRUDContext';
import { ROUTES_MAP } from '@/pages/MainPage/MainPage';

export interface CRUDTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  title: string;
}

const DEFAULT_PERMISSIONS = {
  create: false,
  update: false,
  delete: false,
};

export function CRUDTable<T extends MRT_RowData>(props: CRUDTableProps<T>) {
  const { columns, title } = props;
  const { query, setSelected, setAction, open } = useCRUD();
  const { data, isLoading, isError, isFetching, error } = query;

  const { permissions } = useAuth();
  const location = useLocation();

  const {
    create,
    update,
    delete: remove, // delete is a reserved word
  } = useMemo(
    () =>
      permissions?.[ROUTES_MAP.get(location.pathname)?.entity as keyof typeof permissions] ??
      DEFAULT_PERMISSIONS,
    [permissions, location.pathname]
  );

  const table = useMantineReactTable<T>({
    columns,
    data: (data ?? []) as T[],
    localization: MRT_Localization_PT_BR,
    initialState: {
      density: 'xs',
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: error.message ?? 'Error loading data',
        }
      : undefined,
    state: { isLoading, showAlertBanner: isError, showProgressBars: isFetching },
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
    renderTopToolbarCustomActions: () => (
      <Title order={3} tt="uppercase">
        {title}
      </Title>
    ),
    renderRowActionMenuItems: ({ row }) => {
      return (
        <>
          {update && (
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
          )}
          {remove && (
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
          )}
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
        {create && (
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
        )}
      </Group>
    ),
  });

  return <MantineReactTable table={table} />;
}
