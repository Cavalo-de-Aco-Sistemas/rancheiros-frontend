import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { dateBR } from '@/utils/dates';

interface ClassEnrollmentSummaryRow {
  classId: string;
  className: string;
  classDate: string;
  waitingCount: number;
  calledCount: number;
  confirmedCount: number;
  certifiedCount: number;
  missedCount: number;
  ignoredCount: number;
  droppedCount: number;
  totalEnrollments: number;
}

const tableHeaders = [
  'Turma',
  'Data',
  'Aguardando',
  'Chamados',
  'Confirmados',
  'Certificados',
  'Faltaram',
  'Ignorados',
  'Desistiram',
  'Total',
];

interface HomeSummaryTableProps {
  title: string;
}

export function HomeSummaryTable({ title }: HomeSummaryTableProps) {
  const { query, pagination: contextPagination, setPagination } = useGraphQLCRUD();

  const [lastKnownTotal, setLastKnownTotal] = useState<number | undefined>(undefined);
  const [lastKnownTotalPages, setLastKnownTotalPages] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (query.total !== undefined) {
      setLastKnownTotal(query.total);
    }
    if (query.totalPages !== undefined) {
      setLastKnownTotalPages(query.totalPages);
    }
  }, [query.total, query.totalPages]);

  useEffect(() => {
    if (setPagination && !contextPagination) {
      setPagination({ page: 1, limit: 10 });
    }
  }, [setPagination, contextPagination]);

  const data = useMemo(
    () => ((query.data || []) as unknown as ClassEnrollmentSummaryRow[]),
    [query.data]
  );

  const columns = useMemo<MRT_ColumnDef<ClassEnrollmentSummaryRow>[]>(
    () => [
      {
        id: 'className',
        accessorKey: 'className',
        header: 'Turma',
        filterVariant: 'text',
        filterFn: 'contains',
      },
      {
        id: 'classDate',
        accessorKey: 'classDate',
        header: 'Data',
        filterVariant: 'date',
        Cell: ({ row }) => dateBR(row.original.classDate) ?? '',
      },
      {
        id: 'waitingCount',
        accessorKey: 'waitingCount',
        header: 'Aguardando',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'calledCount',
        accessorKey: 'calledCount',
        header: 'Chamados',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'confirmedCount',
        accessorKey: 'confirmedCount',
        header: 'Confirmados',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'certifiedCount',
        accessorKey: 'certifiedCount',
        header: 'Certificados',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'missedCount',
        accessorKey: 'missedCount',
        header: 'Faltaram',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'ignoredCount',
        accessorKey: 'ignoredCount',
        header: 'Ignorados',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'droppedCount',
        accessorKey: 'droppedCount',
        header: 'Desistiram',
        filterVariant: 'text',
        filterFn: 'equals',
      },
      {
        id: 'totalEnrollments',
        accessorKey: 'totalEnrollments',
        header: 'Total',
        filterVariant: 'text',
        filterFn: 'equals',
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      data.map((item) => ({
        Turma: item.className,
        Data: dateBR(item.classDate) ?? '',
        Aguardando: item.waitingCount,
        Chamados: item.calledCount,
        Confirmados: item.confirmedCount,
        Certificados: item.certifiedCount,
        Faltaram: item.missedCount,
        Ignorados: item.ignoredCount,
        Desistiram: item.droppedCount,
        Total: item.totalEnrollments,
      })),
    [data]
  );

  const rowMapper = (row: MRT_Row<ClassEnrollmentSummaryRow>): string[] => {
    const item = row.original;
    return [
      item.className,
      dateBR(item.classDate) ?? '',
      String(item.waitingCount),
      String(item.calledCount),
      String(item.confirmedCount),
      String(item.certifiedCount),
      String(item.missedCount),
      String(item.ignoredCount),
      String(item.droppedCount),
      String(item.totalEnrollments),
    ];
  };

  const pagination = useMemo(
    () => ({
      page: contextPagination?.page || 1,
      limit: contextPagination?.limit || 10,
      total: query.total ?? lastKnownTotal ?? 0,
      totalPages: query.totalPages ?? lastKnownTotalPages ?? 0,
    }),
    [
      contextPagination?.page,
      contextPagination?.limit,
      query.total,
      query.totalPages,
      lastKnownTotal,
      lastKnownTotalPages,
    ]
  );

  return (
    <CRUDTable<ClassEnrollmentSummaryRow>
      columns={columns}
      title={title}
      csvData={csvData}
      pdfConfig={{ tableHeaders, rowMapper }}
      data={data}
      pagination={pagination}
      enableFilters
      enableRowNumbers
      emptyStateMessage="Nenhuma turma encontrada"
      emptyStateDescription="A lista será atualizada conforme as turmas e inscrições cadastradas."
    />
  );
}
