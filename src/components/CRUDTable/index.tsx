import { useCallback, useMemo, useState } from 'react';
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
import { ActionIcon, Group, Menu, rem, Title, Modal, Text, Button } from '@mantine/core';
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

export interface CustomAction<T extends MRT_RowData> {
  label: string;
  icon: React.ComponentType<any>;
  color?: string;
  onClick: (row: T) => void;
  isVisible?: (row: T) => boolean;
  isLoading?: boolean;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: (row: T) => string;
  confirmationButtonText?: string;
  confirmationButtonColor?: string;
}

export interface CRUDTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  title: string;
  csvData: CSVData[];
  pdfConfig: {
    tableHeaders: string[];
    rowMapper: (row: MRT_Row<T>) => RowInput;
  };
  customActions?: CustomAction<T>[];
  columnVisibility?: Record<string, boolean>;
  data?: T[];
  enableEdit?: boolean;
}

const DEFAULT_PERMISSIONS = {
  create: false,
  update: false,
  delete: false,
};

export function CRUDTable<T extends MRT_RowData>(props: CRUDTableProps<T>) {
  const { columns, title, csvData, pdfConfig, customActions = [], columnVisibility, data: customData, enableEdit = false } = props;
  const { query, setSelected, setAction, open } = useCRUD();
  
  // Estados para modal de confirmação
  const [confirmationModal, setConfirmationModal] = useState<{
    opened: boolean;
    action: CustomAction<T> | null;
    row: T | null;
  }>({
    opened: false,
    action: null,
    row: null,
  });
  const { data, isLoading, isError, isFetching, error } = query;
  const { tableHeaders, rowMapper } = pdfConfig;

  const { permissions } = useAuth();
  const location = useLocation();

  // Funções para modal de confirmação
  const handleActionClick = useCallback((action: CustomAction<T>, row: T) => {
    if (action.requiresConfirmation) {
      setConfirmationModal({
        opened: true,
        action,
        row,
      });
    } else {
      action.onClick(row);
    }
  }, []);

  const confirmAction = useCallback(() => {
    if (confirmationModal.action && confirmationModal.row) {
      confirmationModal.action.onClick(confirmationModal.row);
    }
    setConfirmationModal({
      opened: false,
      action: null,
      row: null,
    });
  }, [confirmationModal]);

  const cancelConfirmation = useCallback(() => {
    setConfirmationModal({
      opened: false,
      action: null,
      row: null,
    });
  }, []);

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

  // Memoize the table configuration to prevent unnecessary re-renders
  const tableConfig = useMemo(() => ({
    columns,
    data: (customData ?? data ?? []) as T[],
    localization: MRT_Localization_PT_BR,
    initialState: {
      density: 'xs' as const,
      columnVisibility: columnVisibility || {},
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red' as const,
          children: error?.message ?? 'Error loading data',
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
  }), [columns, customData, data, isError, error?.message, isLoading, isFetching, columnVisibility]);

  const handleExportDataCSV = useCallback(() => {
    const csv = generateCsv(csvConfig)(csvData ?? []);
    download(csvConfig)(csv);
  }, [csvConfig, csvData]);

  const table = useMantineReactTable<T>({
    ...tableConfig,
    renderTopToolbarCustomActions: () => (
      <Title order={3} tt="uppercase">
        {title}
      </Title>
    ),
    renderRowActionMenuItems: ({ row }) => {
      const rowData = data?.[row.index];
      if (!rowData) {
        return null;
      }
      
      return (
        <>
          {(update || enableEdit) && (
            <Menu.Item
              onClick={() => {
                open();
                setSelected(rowData as any);
                setAction('update');
              }}
              leftSection={<IconEdit style={{ width: rem(16), height: rem(16) }} />}
            >
              Editar
            </Menu.Item>
          )}
          {customActions.map((action, index) => {
            const isVisible = action.isVisible ? action.isVisible(rowData as T) : true;
            if (!isVisible) {
              return null;
            }
            
            const IconComponent = action.icon;
            return (
              <Menu.Item
                key={index}
                onClick={() => handleActionClick(action, rowData as T)}
                color={action.color}
                disabled={action.isLoading}
                leftSection={<IconComponent style={{ width: rem(16), height: rem(16) }} />}
              >
                {action.label}
              </Menu.Item>
            );
          })}
          {remove && (
            <Menu.Item
              onClick={() => {
                open();
                setSelected(rowData as any);
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

  return (
    <>
      <MantineReactTable table={table} />
      
      {/* Modal de confirmação genérico */}
      <Modal
        opened={confirmationModal.opened}
        onClose={cancelConfirmation}
        title={confirmationModal.action?.confirmationTitle || 'Confirmar Ação'}
        centered
      >
        <Text mb="md">
          {confirmationModal.action?.confirmationMessage && confirmationModal.row
            ? confirmationModal.action.confirmationMessage(confirmationModal.row)
            : 'Tem certeza que deseja executar esta ação?'}
        </Text>

        <Group justify="flex-end">
          <Button variant="outline" onClick={cancelConfirmation}>
            Cancelar
          </Button>
          <Button 
            color={confirmationModal.action?.confirmationButtonColor || 'blue'}
            onClick={confirmAction}
            loading={confirmationModal.action?.isLoading}
          >
            {confirmationModal.action?.confirmationButtonText || 'Confirmar'}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
