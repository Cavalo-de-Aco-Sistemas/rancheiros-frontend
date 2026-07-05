import { useCallback, useContext, useMemo, useState } from 'react';
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
import { GraphQLCRUDContext } from '@/contexts/GraphQLCRUDContext';
import { useOptionalSharedFilters } from '@/contexts/SharedFiltersContext';
import { DEFAULT_COLUMN_FILTER_FN } from '@/utils/columnFilterDefaults';
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
  // Use GraphQL context (optional for read-only tables)
  const context = useContext(GraphQLCRUDContext);

  // If no context, this is a read-only table (like Call Management, Certification)
  const isReadOnly = !context;

  const {
    query,
    setSelected,
    setAction,
    open,
    columnFilters: contextColumnFilters,
    setColumnFilters: setContextColumnFilters,
    globalFilter: contextGlobalFilter,
    setGlobalFilter: setContextGlobalFilter,
    sorting: contextSorting,
    setSorting: setContextSorting,
    setPagination: setContextPagination,
  } = context || {};

  const [localColumnFilters, setLocalColumnFilters] = useState<
    Array<{ id: string; value: unknown }>
  >([]);
  const [localGlobalFilter, setLocalGlobalFilter] = useState('');
  const sharedFiltersContext = useOptionalSharedFilters();

  // Try to use shared filters, fallback to context filters
  let columnFilters, setColumnFilters, globalFilter, setGlobalFilter;

  if (isReadOnly) {
    // For read-only tables, use local state for filters
    columnFilters = localColumnFilters;
    setColumnFilters = setLocalColumnFilters;
    globalFilter = localGlobalFilter;
    setGlobalFilter = setLocalGlobalFilter;
  } else if (pagination && enableFilters) {
    // Server-side filtering: MUST use GraphQL context (not SharedFiltersContext)
    columnFilters = contextColumnFilters || [];
    setColumnFilters = setContextColumnFilters;
    globalFilter = contextGlobalFilter || '';
    setGlobalFilter = setContextGlobalFilter;
  } else if (sharedFiltersContext) {
    // Client-side filtering with shared filters provider
    columnFilters = sharedFiltersContext.filters.columnFilters;
    setColumnFilters = sharedFiltersContext.setColumnFilters;
    globalFilter = sharedFiltersContext.filters.globalFilter;
    setGlobalFilter = sharedFiltersContext.setGlobalFilter;
  } else {
    // Fallback to context filters
    columnFilters = contextColumnFilters || [];
    setColumnFilters = setContextColumnFilters;
    globalFilter = contextGlobalFilter || '';
    setGlobalFilter = setContextGlobalFilter;
  }

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
  // Use custom data if provided, otherwise use query data
  const queryResult = customData
    ? { data: customData, isLoading: false, isError: false, isFetching: false, error: null }
    : query;
  const {
    data = [],
    isLoading,
    isError,
    isFetching,
    error,
  } = queryResult || { data: [], isLoading: false, isError: false, isFetching: false, error: null };
  const { tableHeaders, rowMapper } = pdfConfig;

  const { permissions, super_admin } = useAuth();
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
  const rowNumberColumn = useMemo(
    () => ({
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
          <div
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#666',
              fontSize: '14px',
            }}
          >
            {rowNumber}
          </div>
        );
      },
    }),
    []
  );

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
  } = useMemo(() => {
    const entity = ROUTES_MAP.get(location.pathname)?.entity;
    const entityPermissions = permissions?.[entity as keyof typeof permissions];

    // Se for super admin, tem todas as permissões
    if (super_admin) {
      return { create: true, update: true, delete: true };
    }

    const result = entityPermissions ?? DEFAULT_PERMISSIONS;
    return result;
  }, [permissions, location.pathname, super_admin]);

  const handleExportRowsPDF = useCallback(
    (rows: MRT_Row<T>[], table?: any) => {
      const doc = new jsPDF({
        orientation: 'landscape',
      });

      // Get visible columns if table is provided
      let visibleHeaders = tableHeaders;
      let filteredRowMapper = rowMapper;

      if (table && typeof table.getVisibleLeafColumns === 'function') {
        const visibleColumns = table.getVisibleLeafColumns();
        const visibleColumnIds = new Set(visibleColumns.map((col: any) => col.id));

        // Filter headers and row mapper based on visible columns
        // Map column accessorKeys to indices in tableHeaders
        const columnIdToIndex = new Map<string, number>();
        finalColumns.forEach((col, index) => {
          const colId = col.id || ('accessorKey' in col ? (col.accessorKey as string) : '');
          if (colId) {
            columnIdToIndex.set(colId, index);
          }
        });

        // Filter tableHeaders and create filtered row mapper
        const visibleIndices: number[] = [];
        const filteredHeaders: string[] = [];

        finalColumns.forEach((col, index) => {
          const colId = col.id || ('accessorKey' in col ? (col.accessorKey as string) : '');
          if (colId && visibleColumnIds.has(colId) && index < tableHeaders.length) {
            visibleIndices.push(index);
            filteredHeaders.push(tableHeaders[index]);
          }
        });

        visibleHeaders = filteredHeaders;
        filteredRowMapper = (row: MRT_Row<T>) => {
          const fullRow = rowMapper(row);
          // Ensure fullRow is treated as an array
          const rowArray = Array.isArray(fullRow) ? fullRow : [String(fullRow)];
          return visibleIndices.map(idx => rowArray[idx] || '');
        };
      }

      const tableData = rows.map(filteredRowMapper);
      autoTable(doc, {
        head: [visibleHeaders],
        body: tableData,
      });

      doc.save(`${filename}.pdf`);
    },
    [filename, rowMapper, tableHeaders, finalColumns]
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
  const tableKey = useMemo(
    () => `table-${pagination?.page || 1}-${pagination?.limit || 50}`,
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
        showColumnFilters: enableFilters,
        showGlobalFilter: false, // Filtro global desativado por padrão
        showPagination: true, // Garantir que paginação está visível
        // Não definir pagination no initialState quando usando manualPagination
        // para evitar conflitos com o estado controlado
        ...(pagination
          ? {}
          : {
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
        columnFilters: enableFilters ? (columnFilters || []) : undefined, // Ensure it's always an array
        globalFilter: enableFilters ? (globalFilter || '') : undefined, // Ensure it's always a string
        density: 'xs' as const, // Forçar densidade mínima
        pagination: pagination
          ? {
            pageIndex: pagination.page - 1,
            pageSize: pagination.limit,
          }
          : {
            pageIndex: 0,
            pageSize: 50,
          },
        sorting: contextSorting || undefined,
      },
      // Configuração para estado vazio
      renderEmptyRowsFallback: () => (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>{emptyStateMessage}</div>
          {emptyStateDescription && (
            <div style={{ fontSize: '12px', color: '#999' }}>{emptyStateDescription}</div>
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
      mantineTableContainerProps: {
        style: {
          maxHeight: 'calc(100vh - 200px)', // Aumentar espaço para paginação
          minHeight: '400px', // Altura mínima para garantir visibilidade
          overflow: 'auto', // Permitir scroll quando necessário
        },
      },
      enableRowActions: true,
      // Configurações de filtros
      enableColumnFilters: enableFilters,
      initialShowColumnFilters: enableFilters,
      enableGlobalFilter: enableFilters,
      enableColumnFilterModes: enableFilters,
      enableFilterMatchHighlighting: enableFilters,
      // Sempre usar manual filtering quando filtros estão habilitados
      // para evitar dupla filtragem (backend + frontend)
      manualFiltering: enableFilters,
      onColumnFiltersChange: enableFilters
        ? (updaterOrValue: any) => {
          const currentFilters = columnFilters || [];
          const newFilters =
            typeof updaterOrValue === 'function' ? updaterOrValue(currentFilters) : updaterOrValue;
          const enrichedFilters = newFilters.map((filter: { id: string; value: unknown; filterFn?: string }) => {
            if (filter.filterFn) {
              return filter;
            }
            const defaultFilterFn = DEFAULT_COLUMN_FILTER_FN[filter.id];
            if (!defaultFilterFn) {
              return filter;
            }
            return { ...filter, filterFn: defaultFilterFn };
          });
          if (setColumnFilters) {
            setColumnFilters(enrichedFilters);
          }
          // Reset to first page when filters change
          if (pagination && onPageChange) {
            onPageChange(1);
          }
        }
        : undefined,
      onGlobalFilterChange: enableFilters ? setGlobalFilter : undefined,
      // Desabilitar filtros locais quando manual filtering está ativo
      enableColumnFiltering: enableFilters,
      enableGlobalFiltering: enableFilters,
      // Configurações específicas para filtros
      enableMultiSort: true,
      enableMultiColumnFiltering: true,
      // Configurações de ordenação (server-side quando paginação está habilitada)
      enableSorting: true,
      manualSorting: !!pagination, // Server-side sorting when pagination is enabled
      onSortingChange: pagination && setContextSorting
        ? (updaterOrValue: any) => {
          const newSorting =
            typeof updaterOrValue === 'function' ? updaterOrValue(contextSorting || []) : updaterOrValue;
          setContextSorting(newSorting);
        }
        : undefined,
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
      // Garantir que a paginação seja sempre visível
      positionPagination: 'bottom' as const,
      // Exibir informações de linha na parte inferior
      renderBottomToolbarCustomActions: pagination
        ? () => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>Total: {pagination.total} registros</span>
            <span>•</span>
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
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
        pagination && (onPageChange || onPageSizeChange || setContextPagination)
          ? (updater: any) => {
            let newPageIndex: number;
            let newPageSize: number;

            if (typeof updater === 'function') {
              const newPagination = updater({
                pageIndex: pagination.page - 1,
                pageSize: pagination.limit,
              });
              newPageIndex = newPagination.pageIndex;
              newPageSize = newPagination.pageSize;
            } else {
              newPageIndex = updater.pageIndex;
              newPageSize = updater.pageSize;
            }

            const newPage = newPageIndex + 1;

            // Atualizar contexto GraphQL diretamente se disponível (prioridade)
            // Quando há contexto GraphQL, ele é a fonte de verdade - não chamar callbacks
            if (setContextPagination) {
              setContextPagination({ page: newPage, limit: newPageSize });
              // Não chamar callbacks quando há contexto GraphQL para evitar dessincronização
            } else {
              // Apenas chamar callbacks quando não há contexto GraphQL (tabelas read-only)
              if (onPageChange && newPageIndex !== pagination.page - 1) {
                onPageChange(newPage);
              }

              if (onPageSizeChange && newPageSize !== pagination.limit) {
                onPageSizeChange(newPageSize);
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
      contextSorting,
      setContextSorting,
      setContextPagination,
      emptyStateMessage,
      emptyStateDescription,
    ]
  );

  const handleExportDataCSV = useCallback((table?: any) => {
    let filteredCsvData = csvData ?? [];

    // Filter CSV data based on visible columns if table is provided
    if (table && typeof table.getVisibleLeafColumns === 'function' && csvData && csvData.length > 0) {
      const visibleColumns = table.getVisibleLeafColumns();

      // Map column headers to CSV keys
      const headerToCsvKey = new Map<string, string>();
      const csvKeys = Object.keys(csvData[0]);

      // Create mapping from column header to CSV key
      finalColumns.forEach((col) => {
        const headerText = typeof col.header === 'string' ? col.header : '';
        if (headerText) {
          // Find matching CSV key by exact header match
          const matchingKey = csvKeys.find(key => key === headerText);
          if (matchingKey) {
            headerToCsvKey.set(headerText, matchingKey);
          }
        }
      });

      // Get visible column headers
      const visibleHeaders = new Set<string>();
      visibleColumns.forEach((col: any) => {
        const headerText = typeof col.columnDef.header === 'string'
          ? col.columnDef.header
          : '';
        if (headerText) {
          visibleHeaders.add(headerText);
        }
      });

      // Filter CSV data to only include visible columns
      filteredCsvData = csvData.map((row) => {
        const filteredRow: any = {};
        visibleHeaders.forEach((header) => {
          const csvKey = headerToCsvKey.get(header);
          if (csvKey && row[csvKey] !== undefined) {
            filteredRow[csvKey] = row[csvKey];
          }
        });
        return filteredRow;
      });
    }

    const csv = generateCsv(csvConfig)(filteredCsvData);
    download(csvConfig)(csv);
  }, [csvConfig, csvData, finalColumns]);

  const table = useMantineReactTable<T>({
    ...tableConfig,
    renderTopToolbarCustomActions: () => (
      <Title order={3} tt="uppercase">
        {title}
      </Title>
    ),
    renderRowActionMenuItems: ({ row }) => {
      // Usar row.original diretamente, pois já contém os dados corretos da linha
      // independente da página atual (os dados já vêm paginados do backend)
      const rowData = row.original;
      if (!rowData) {
        return null;
      }

      return (
        <>
          {(update || enableEdit) && (
            <Menu.Item
              onClick={() => {
                if (!isReadOnly && open && setSelected && setAction) {
                  open();
                  setSelected(rowData as any);
                  setAction('update');
                }
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
                if (!isReadOnly && open && setSelected && setAction) {
                  open();
                  setSelected(rowData as any);
                  setAction('delete');
                }
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
          onClick={() => handleExportRowsPDF(table.getPrePaginationRowModel().rows, table)}
          variant="subtle"
          color="gray"
        >
          <IconPdf />
        </ActionIcon>
        <ActionIcon onClick={() => handleExportDataCSV(table)} color="gray" variant="subtle">
          <IconCsv />
        </ActionIcon>
        {create && !isReadOnly && open && setSelected && setAction && (
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
