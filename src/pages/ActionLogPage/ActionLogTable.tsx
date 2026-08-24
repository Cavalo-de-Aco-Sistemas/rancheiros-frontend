import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Alert, Badge } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { CRUDTable } from '@/components/CRUDTable';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { GET_ACTION_LOG_FAILURE_COUNT } from '@/graphql/actionLogs';
import { ActionLog } from '@/model/actionLog';

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Criação',
  UPDATE: 'Atualização',
  DELETE: 'Exclusão',
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
};

const tableHeaders = ['Data/Hora', 'Entidade', 'ID da entidade', 'Ação', 'Responsável', 'Alterações'];

const formatChanges = (changes: Record<string, any> | null) => (changes ? JSON.stringify(changes) : '');

export function ActionLogTable() {
  const { query } = useGraphQLCRUD();

  const rows = useMemo(() => (query.data || []) as unknown as ActionLog[], [query.data]);

  const pagination = useMemo(
    () => ({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      total: query.total ?? 0,
      totalPages: query.totalPages ?? 1,
    }),
    [query.page, query.limit, query.total, query.totalPages]
  );

  const { data: failureCountData } = useQuery(GET_ACTION_LOG_FAILURE_COUNT, {
    fetchPolicy: 'network-only',
    pollInterval: 60_000,
  });

  const columns = useMemo<MRT_ColumnDef<ActionLog>[]>(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Data/Hora',
        Cell: ({ row }) => new Date(row.original.created_at).toLocaleString('pt-BR'),
      },
      {
        accessorKey: 'entity_name',
        header: 'Entidade',
      },
      {
        accessorKey: 'entity_id',
        header: 'ID da entidade',
      },
      {
        accessorKey: 'action',
        header: 'Ação',
        Cell: ({ row }) => (
          <Badge color={ACTION_COLORS[row.original.action] ?? 'gray'} variant="light">
            {ACTION_LABELS[row.original.action] ?? row.original.action}
          </Badge>
        ),
      },
      {
        accessorKey: 'actor.username',
        header: 'Responsável',
        Cell: ({ row }) => row.original.actor?.username ?? '—',
      },
      {
        accessorKey: 'changes',
        header: 'Alterações',
        Cell: ({ row }) => formatChanges(row.original.changes),
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      rows.map((log) => ({
        'Data/Hora': new Date(log.created_at).toLocaleString('pt-BR'),
        Entidade: log.entity_name,
        'ID da entidade': log.entity_id,
        Ação: ACTION_LABELS[log.action] ?? log.action,
        Responsável: log.actor?.username ?? '',
        Alterações: formatChanges(log.changes),
      })),
    [rows]
  );

  const rowMapper = (row: MRT_Row<ActionLog>): string[] => {
    const log = row.original;
    return [
      new Date(log.created_at).toLocaleString('pt-BR'),
      log.entity_name,
      log.entity_id,
      ACTION_LABELS[log.action] ?? log.action,
      log.actor?.username ?? '',
      formatChanges(log.changes),
    ];
  };

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), []);

  const failureCount = failureCountData?.actionLogFailureCount ?? 0;

  return (
    <>
      {failureCount > 0 && (
        <Alert
          color="orange"
          icon={<IconAlertTriangle />}
          title="Falhas de registro detectadas"
          mb="md"
        >
          {failureCount} {failureCount === 1 ? 'evento falhou' : 'eventos falharam'} ao ser
          gravado no log de ações desde o último reinício do servidor. O trilho de auditoria pode
          estar incompleto.
        </Alert>
      )}
      <CRUDTable
        columns={columns}
        title="Log de Ações"
        csvData={csvData}
        pdfConfig={pdfConfig}
        pagination={pagination}
        readOnly
        emptyStateMessage="Nenhum registro encontrado"
        emptyStateDescription="Os registros aparecerão aqui conforme ações forem realizadas no sistema"
      />
    </>
  );
}
