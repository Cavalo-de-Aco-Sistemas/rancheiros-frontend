import { useCallback, useMemo } from 'react';
import { IconCsv, IconEdit, IconPdf, IconPlus, IconTrash } from '@tabler/icons-react';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
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
import { download, generateCsv, mkConfig } from "export-to-csv";

type AcceptedData = number | string | boolean | null | undefined;

type CSVData = {
  [k: string]: AcceptedData;
  [k: number]: AcceptedData;
};

export function slugify(str: string): string {
  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumerics/dashes with dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-+/, "") // Trim leading dashes
    .replace(/-+$/, ""); // Trim trailing dashes
}

export interface CRUDTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  title: string;
  csvData: CSVData[];
  pdfConfig: {
    tableHeaders: string[];
    rowMapper: (row: MRT_Row<T>) => RowInput;
  };
}

const DEFAULT_PERMISSIONS = {
  create: false,
  update: false,
  delete: false,
};

export function CRUDTable<T extends MRT_RowData>(props: CRUDTableProps<T>) {
  const { columns, title, csvData, pdfConfig } = props;
  const { query, setSelected, setAction, open } = useCRUD();
  const { data, isLoading, isError, isFetching, error } = query;
  const { tableHeaders, rowMapper } = pdfConfig;

  const { permissions } = useAuth();
  const location = useLocation();

  const filename = useMemo(() => slugify(title), [title]);

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

  const handleExportRowsPDF = useCallback(
    (rows: MRT_Row<T>[]) => {
      const doc = new jsPDF({
        orientation: 'landscape'
      });
      const tableData = rows.map(rowMapper);
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
      });

      doc.save(`${filename}.pdf`);
    },
    [filename, rowMapper, tableHeaders]
  );

  const csvConfig = useMemo(
    () =>
      mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename,
      }),
    [filename]
  );

  const handleExportDataCSV = useCallback(() => {
    const csv = generateCsv(csvConfig)(csvData ?? []);
    download(csvConfig)(csv);
  }, [csvConfig, csvData]);

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
        <ActionIcon
          onClick={() => handleExportRowsPDF(table.getPrePaginationRowModel().rows)}
          variant="subtle"
          color="gray"
        >
          <IconPdf />
        </ActionIcon>
        <ActionIcon onClick={handleExportDataCSV} color="gray" variant="subtle">
          <IconCsv />
        </ActionIcon>
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
