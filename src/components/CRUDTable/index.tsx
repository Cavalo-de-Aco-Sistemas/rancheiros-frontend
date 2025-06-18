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
import { ActionIcon, Group, Menu, rem, Title } from '@mantine/core';
import { useCRUD } from '@/contexts/CRUDContext';

export interface CRUDTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  title: string;
}

export function CRUDTable<T extends MRT_RowData>(props: CRUDTableProps<T>) {
  const { columns, title } = props;
  const { query, setSelected, setAction, open } = useCRUD();
  const { data, isLoading, isError, isFetching, error } = query;

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
    renderTopToolbarCustomActions: () => <Title order={2}>{title}</Title>,
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
