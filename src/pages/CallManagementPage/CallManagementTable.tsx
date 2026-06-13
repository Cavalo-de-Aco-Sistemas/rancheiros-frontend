import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconClock } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { WhatsAppEnrollmentPhoneLink } from '@/components/WhatsAppEnrollmentPhoneLink';
import { EnrollmentStatusCallActions } from '@/components/EnrollmentStatusActions/EnrollmentStatusCallActions';
import { StatusIcon } from '@/components/StatusIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { Enrollment, EnrollmentStatus, ENROLLMENT_STATUS_FILTER_OPTIONS } from '@/model/enrollment';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { dateBR } from '@/utils/dates';
import { normalizeEnrollments } from '@/utils/statusNormalizer';

const tableHeaders = [
  'Fluxo',
  'Turma',
  'Status',
  'Data de Inscrição',
  'Cidade Preferencial',
  'Nome',
  'Telefone',
  'UF',
  'CNH',
  'Email',
  'Uso de Moto',
  'Marca',
  'Modelo',
];

interface CallManagementTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function CallManagementTable({
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 50,
}: CallManagementTableProps) {
  const { query, setPagination, pagination: contextPagination } = useGraphQLCRUD();
  const { name } = useAuth();
  const updateFlowMutation = useEnrollmentFlowMutation();
  
  // Manter valores anteriores de total e totalPages durante o carregamento para evitar resetar paginação
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

  // Inicializar contexto apenas na montagem
  useEffect(() => {
    if (setPagination && !contextPagination) {
      setPagination({ page: currentPage, limit: pageSize });
    }
  }, [setPagination]);

  const data = normalizeEnrollments(query.data || []);

  const handleReturnToWaiting = useCallback(
    (enrollment: Enrollment) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: EnrollmentStatus.WAITING,
        enrollmentName: enrollment.name,
      });
    },
    [updateFlowMutation]
  );

  const canReturnToWaiting = useCallback((enrollment: Enrollment) => {
    // Só pode voltar para lista de espera se:
    // 1. Não estiver já em waiting
    // 2. Não estiver certificado (situação final)
    // 3. Não tiver faltado (situação final)
    // 4. Não estiver dropped (situação final)
    return (
      enrollment.status !== EnrollmentStatus.WAITING &&
      enrollment.status !== EnrollmentStatus.CERTIFIED &&
      enrollment.status !== EnrollmentStatus.MISSED &&
      enrollment.status !== EnrollmentStatus.DROPPED
    );
  }, []);

  const customActions = useMemo(
    () => [
      {
        label: 'Voltar para Lista de Espera',
        icon: IconClock,
        onClick: handleReturnToWaiting,
        isVisible: canReturnToWaiting,
        isLoading: updateFlowMutation.isLoading,
        requiresConfirmation: true,
        confirmationTitle: 'Confirmar Retorno para Lista de Espera',
        confirmationMessage: (enrollment: Enrollment) =>
          `Tem certeza que deseja mover ${enrollment.name} de volta para a Lista de Espera?`,
        confirmationButtonText: 'Confirmar',
        confirmationButtonColor: 'blue',
      },
    ],
    [handleReturnToWaiting, canReturnToWaiting, updateFlowMutation.isLoading]
  );

  const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
    () => [
      {
        id: 'actions',
        header: 'Fluxo',
        Cell: ({ row }) => <EnrollmentStatusCallActions enrollment={row.original} />,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: 'class',
        accessorKey: 'class',
        header: 'Turma',
        filterVariant: 'text',
        filterFn: 'contains',
        Cell: ({ row }) => {
          const classData = row.original.class;
          if (!classData) {
            return '';
          }

          const date = classData.date ? (dateBR(classData.date) ?? '') : '';
          const location = classData.location?.name ?? '';

          if (location && date) {
            return `${location} - ${date}`;
          } else if (location) {
            return location;
          } else if (date) {
            return date;
          }

          return '';
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
        mantineFilterSelectProps: {
          data: ENROLLMENT_STATUS_FILTER_OPTIONS as any,
        },
        filterFn: 'equals',
        Cell: ({ row }) => <StatusIcon status={row.original.status} />,
      },
      {
        id: 'enrollment_date',
        accessorKey: 'enrollment_date',
        header: 'Data de Inscrição',
        filterVariant: 'date',
        Cell: ({ row }) => {
          const date = row.original.enrollment_date;
          if (!date) return '';

          try {
            // Converter para Date e formatar para DD/MM/YYYY
            const dateObj = new Date(date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const year = dateObj.getFullYear();
            return `${day}/${month}/${year}`;
          } catch (error) {
            return '';
          }
        },
      },
      {
        id: 'preferred_city',
        accessorKey: 'preferred_city',
        accessorFn: (row) => row.preferred_city?.name || '',
        header: 'Cidade Preferencial',
        filterVariant: 'text',
        filterFn: 'contains',
        Cell: ({ row }) => row.original.preferred_city?.name ?? '',
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Nome',
        filterVariant: 'text',
        filterFn: 'contains',
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        Cell: ({ row }) => (
          <WhatsAppEnrollmentPhoneLink
            phone={row.original.phone}
            enrollment={row.original}
            adminName={name}
          />
        ),
      },
      { accessorKey: 'uf_cnh', header: 'UF' },
      // Colunas ocultas por padrão
      { accessorKey: 'cnh', header: 'CNH', enableHiding: true },
      { accessorKey: 'email', header: 'Email', enableHiding: true },
      { accessorKey: 'motorcycle_usage', header: 'Uso de Moto', enableHiding: true },
      { accessorKey: 'brand', header: 'Marca', enableHiding: true },
      { accessorKey: 'model', header: 'Modelo', enableHiding: true },
    ],
    [name]
  );

  // Paginação server-side - dados já vêm paginados do backend
  // Usar paginação do contexto quando disponível (atualizada diretamente pelo CRUDTable), senão usar props
  // Usar total e totalPages retornados pelo backend, mantendo valores anteriores durante carregamento
  const pagination = useMemo(
    () => ({
      page: contextPagination?.page || currentPage,
      limit: contextPagination?.limit || pageSize,
      total: query.total ?? lastKnownTotal ?? 0,
      totalPages: query.totalPages ?? lastKnownTotalPages ?? 0,
    }),
    [contextPagination?.page, contextPagination?.limit, currentPage, pageSize, query.total, query.totalPages, lastKnownTotal, lastKnownTotalPages]
  );

  const csvData = useMemo(
    () =>
      data?.map(
        ({
          name,
          phone,
          cnh,
          uf_cnh,
          preferred_city,
          email,
          motorcycle_usage,
          brand,
          model,
          status,
          enrollment_date,
          class: class_,
        }: Enrollment) => ({
          Fluxo: '', // Fluxo não é exportado para CSV/PDF
          Turma: class_?.date ? (dateBR(class_.date) ?? '') : '',
          Status: status,
          'Data de Inscrição': enrollment_date,
          'Cidade Preferencial': preferred_city?.name ?? '',
          Nome: name,
          Telefone: phone,
          UF: uf_cnh,
          CNH: cnh,
          Email: email,
          'Uso de Moto': motorcycle_usage,
          Marca: brand,
          Modelo: model,
        })
      ) ?? [],
    [data]
  );

  const rowMapper = useCallback((row: MRT_Row<Enrollment>): string[] => {
    const {
      class: class_,
      status,
      name,
      phone,
      cnh,
      uf_cnh,
      preferred_city,
      email,
      motorcycle_usage,
      brand,
      model,
      enrollment_date,
    } = row.original;
    return [
      '', // Fluxo não é exportado para CSV/PDF
      class_?.date ? (dateBR(class_.date) ?? '') : '',
      status,
      enrollment_date ? (dateBR(enrollment_date) ?? '') : '',
      preferred_city?.name ?? '',
      name,
      phone,
      uf_cnh,
      cnh,
      email ?? '',
      motorcycle_usage ?? '',
      brand ?? '',
      model ?? '',
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return (
    <CRUDTable<Enrollment>
      columns={columns}
      title="Gestão de Chamadas"
      csvData={csvData}
      pdfConfig={pdfConfig}
      customActions={customActions}
      enableFilters={true}
      enableRowNumbers={true}
      columnVisibility={{
        cnh: false,
        email: false,
        motorcycle_usage: false,
        brand: false,
        model: false,
      }}
      data={data}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyStateMessage="Nenhuma inscrição em processo de chamada encontrada"
      emptyStateDescription="As inscrições em lista de espera, chamadas, confirmadas, ignoradas ou desistências aparecerão aqui"
    />
  );
}
