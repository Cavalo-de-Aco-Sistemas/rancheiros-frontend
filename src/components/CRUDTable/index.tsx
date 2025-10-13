import { useCallback, useMemo, useState } from 'react';
import { IconCsv, IconEdit, IconPdf, IconPlus, IconTrash } from '@tabler/icons-react';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Row,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.cjs';
import { useLocation } from 'react-router-dom';
import { ActionIcon, Button, Group, Menu, Modal, rem, Text, Title } from '@mantine/core';
import { useAuth } from '@/contexts/AuthContext';
import { useCRUD } from '@/contexts/CRUDContext';
import { ROUTES_MAP } from '@/pages/MainPage/MainPage';

type AcceptedData = number | string | boolean | null | undefined;

type CSVData = {
  [k: string]: AcceptedData;
  [k: number]: AcceptedData;
};

export function slugify(str: string): string {
  return str
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9-]+/g, '-') // Replace non-alphanumerics/dashes with dashes
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-+/, '') // Trim leading dashes
    .replace(/-+$/, ''); // Trim trailing dashes
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  enableFilters?: boolean; // Habilita filtros de colunas
  enableRowNumbers?: boolean; // Habilita numeração sequencial das linhas
  emptyStateMessage?: string; // Mensagem personalizada para estado vazio
  emptyStateDescription?: string; // Descrição adicional para estado vazio
}

const DEFAULT_PERMISSIONS = {
  create: false,
  update: false,
  delete: false,
};

export function CRUDTable<T extends MRT_RowData>(props: CRUDTableProps<T>) {
  const {
    columns,
    title,
    csvData,
    pdfConfig,
    customActions = [],
    columnVisibility,
    data: customData,
    enableEdit = false,
    pagination,
    onPageChange,
    onPageSizeChange,
    enableFilters = false,
    enableRowNumbers = false,
    emptyStateMessage = 'Nenhum dado encontrado',
    emptyStateDescription,
  } = props;
  const { 
    query, 
    setSelected, 
    setAction, 
    open,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
  } = useCRUD();

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

  // Coluna de numeração sequencial
  const rowNumberColumn = useMemo(() => ({
    id: 'rowNumber',
    header: '#',
    size: 60,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    Cell: ({ row, table }: { row: any; table: any }) => {
      // Calcular número sequencial considerando paginação
      const pagination = table.options.state?.pagination;
      const pageIndex = pagination?.pageIndex || 0;
      const pageSize = pagination?.pageSize || 50;
      const rowNumber = pageIndex * pageSize + row.index + 1;
      
      return (
        <div style={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: '#666',
          fontSize: '14px'
        }}>
          {rowNumber}
        </div>
      );
    },
  }), []);

  // Combinar colunas com numeração se habilitado
  const finalColumns = useMemo(() => {
    if (enableRowNumbers) {
      return [rowNumberColumn, ...columns];
    }
    return columns;
  }, [enableRowNumbers, rowNumberColumn, columns]);

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
        orientation: 'landscape',
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
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename,
      }),
    [filename]
  );


  // Chave única para forçar re-renderização quando paginação muda
  const tableKey = useMemo(() => 
    `table-${pagination?.page || 1}-${pagination?.limit || 50}`,
    [pagination?.page, pagination?.limit]
  );

  // Memoize the table configuration to prevent unnecessary re-renders
  const tableConfig = useMemo(
    () => ({
      columns: finalColumns,
      data: (customData ?? data ?? []) as T[],
      localization: MRT_Localization_PT_BR,
      initialState: {
        density: 'xs' as const,
        columnVisibility: columnVisibility || {},
        showColumnFilters: false, // Filtros desativados por padrão para interface limpa
        showGlobalFilter: false, // Filtro global desativado por padrão
        showPagination: true, // Garantir que paginação está visível
        // Não definir pagination no initialState quando usando manualPagination
        // para evitar conflitos com o estado controlado
        ...(pagination ? {} : {
          pagination: {
            pageSize: 50,
            pageIndex: 0,
          },
        }),
      },
      // Estado atual da paginação para sincronizar com props
      state: {
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        columnFilters: enableFilters ? columnFilters : undefined,
        globalFilter: enableFilters ? globalFilter : undefined,
        density: 'xs' as const, // Forçar densidade mínima
        pagination: pagination ? {
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit,
        } : {
          pageIndex: 0,
          pageSize: 50,
        },
      },
      // Configuração para estado vazio
      renderEmptyRowsFallback: () => (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '14px'
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            {emptyStateMessage}
          </div>
          {emptyStateDescription && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              {emptyStateDescription}
            </div>
          )}
        </div>
      ),
      // Configurações de loading
      mantineSkeletonProps: {
        animation: 'wave',
        height: 20,
      },
      mantineLinearProgressProps: {
        color: 'blue',
        variant: 'indeterminate',
      },
      mantinePaperProps: {
        style: {
          border: 'none',
        },
      },
      enableBottomToolbar: true, // Habilitar toolbar inferior para controles de paginação
      enableRowVirtualization: !pagination,
      mantineTableContainerProps: { style: { maxHeight: 'calc(100vh - 128px)' } },
      enableRowActions: true,
      // Configurações de filtros
      enableColumnFilters: enableFilters,
      enableGlobalFilter: enableFilters,
      enableColumnFilterModes: enableFilters,
      enableFilterMatchHighlighting: enableFilters,
      // Sempre usar manual filtering quando filtros estão habilitados
      // para evitar dupla filtragem (backend + frontend)
      manualFiltering: enableFilters,
      onColumnFiltersChange: enableFilters ? setColumnFilters : undefined,
      onGlobalFilterChange: enableFilters ? setGlobalFilter : undefined,
      // Desabilitar filtros locais quando manual filtering está ativo
      enableColumnFiltering: enableFilters,
      enableGlobalFiltering: enableFilters,
      // Configurações específicas para filtros
      enableMultiSort: false,
      enableMultiColumnFiltering: true,
      // Configurações de paginação
      enablePagination: true,
      enableRowSelection: false,
      enableDensityToggle: false,
      enableFullScreenToggle: false,
      enableHiding: true,
      // Mostrar informações de paginação
      enablePaginationDisplay: true,
      // Mostrar contagem de linhas
      enableRowCount: true,
      // Exibir informações de linha na parte inferior
      renderBottomToolbarCustomActions: pagination
        ? () => (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>Total: {pagination.total} registros</span>
              <span>•</span>
              <span>Página {pagination.page} de {pagination.totalPages}</span>
            </div>
          )
        : undefined,
      // Exibir informações de linha na toolbar
      renderToolbarAlertBannerProps: isError
        ? {
            color: 'red' as const,
            children: error?.message ?? 'Error loading data',
          }
        : pagination
        ? {
            color: 'blue' as const,
            children: `Total de registros: ${pagination.total} | Página ${pagination.page} de ${pagination.totalPages}`,
          }
        : undefined,
      // Opções de tamanho de página
      enablePageSizeOptions: true,
      pageSizeOptions: [10, 25, 50, 100],
      pageCount: pagination?.totalPages || -1,
      rowCount: pagination?.total || 0,
      manualPagination: !!pagination,
      onPaginationChange:
        pagination && (onPageChange || onPageSizeChange)
          ? (updater: any) => {
              if (typeof updater === 'function') {
                const newPagination = updater({
                  pageIndex: pagination.page - 1,
                  pageSize: pagination.limit,
                });
                
                // Notificar mudança de página
                if (onPageChange && newPagination.pageIndex !== pagination.page - 1) {
                  onPageChange(newPagination.pageIndex + 1);
                }
                
                // Notificar mudança de tamanho da página
                if (onPageSizeChange && newPagination.pageSize !== pagination.limit) {
                  onPageSizeChange(newPagination.pageSize);
                }
              } else {
                // Notificar mudança de página
                if (onPageChange && updater.pageIndex !== pagination.page - 1) {
                  onPageChange(updater.pageIndex + 1);
                }
                
                // Notificar mudança de tamanho da página
                if (onPageSizeChange && updater.pageSize !== pagination.limit) {
                  onPageSizeChange(updater.pageSize);
                }
              }
            }
          : undefined,
    }),
    [
      finalColumns,
      customData,
      data,
      isError,
      error?.message,
      isLoading,
      isFetching,
      columnVisibility,
      pagination,
      onPageChange,
      onPageSizeChange,
      enableFilters,
      columnFilters,
      globalFilter,
      setColumnFilters,
      setGlobalFilter,
    ]
  );

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
      const actualData = Array.isArray(data) ? data : data?.data || [];
      const rowData = actualData[row.index];
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
        {enableFilters && <MRT_ToggleGlobalFilterButton table={table} />}
        {enableFilters && <MRT_ToggleFiltersButton table={table} />}
        <MRT_ShowHideColumnsButton table={table} />
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
      <MantineReactTable key={tableKey} table={table} />

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
