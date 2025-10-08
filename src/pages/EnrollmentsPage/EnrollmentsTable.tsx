import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { dateBR } from '@/utils/dates';
import { EnrollmentStatusActions } from '@/components/EnrollmentStatusActions';
import { useEnrollmentStatusMutation } from '@/mutations/useEnrollmentStatusMutation';
import { IconClock } from '@tabler/icons-react';

const tableHeaders = [
  'Fluxo',
  'Turma',
  'Status',
  'Nome',
  'Cidade Preferencial',
  'Telefone',
  'CNH',
  'UF da CNH',
  'Email',
  'Uso de Moto',
  'Marca',
  'Modelo',
  'Data de Inscrição'
];

export function EnrollmentsTable() {
  const { query } = useCRUD();
  const updateStatusMutation = useEnrollmentStatusMutation();

  const handleReturnToWaiting = useCallback((enrollment: Enrollment) => {
    updateStatusMutation.mutate({
      enrollmentId: enrollment.id,
      status: EnrollmentStatus.WAITING,
    });
  }, [updateStatusMutation]);

  const canReturnToWaiting = useCallback((enrollment: Enrollment) => {
    // Só pode voltar para lista de espera se:
    // 1. Não estiver já em waiting
    // 2. Não estiver certificado (situação final)
    // 3. Não tiver faltado (situação final)
    return enrollment.status !== EnrollmentStatus.WAITING &&
           enrollment.status !== EnrollmentStatus.CERTIFIED &&
           enrollment.status !== EnrollmentStatus.MISSED;
  }, []);

  const customActions = useMemo(() => [
    {
      label: 'Voltar para Lista de Espera',
      icon: IconClock,
      onClick: handleReturnToWaiting,
      isVisible: canReturnToWaiting,
      isLoading: updateStatusMutation.isPending,
    },
  ], [handleReturnToWaiting, canReturnToWaiting, updateStatusMutation.isPending]);

  const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
    () => [
      {
        id: 'actions',
        header: 'Fluxo',
        Cell: ({ row }) => (
          <EnrollmentStatusActions
            enrollment={row.original}
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'class',
        header: 'Turma',
        Cell: ({ row }) => {
          const classData = row.original.class;
          if (!classData) return '';
          
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
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'preferred_city',
        header: 'Cidade Preferencial',
        Cell: ({ row }) => row.original.preferred_city?.name ?? '',
      },
      { accessorKey: 'phone', header: 'Telefone' },
      { accessorKey: 'cnh', header: 'CNH' },
      { accessorKey: 'uf_cnh', header: 'UF da CNH' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'motorcycle_usage', header: 'Uso de Moto' },
      { accessorKey: 'brand', header: 'Marca' },
      { accessorKey: 'model', header: 'Modelo' },
      { accessorKey: 'enrollment_date', header: 'Data de Inscrição' },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      query.data?.map(
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
        }) => ({
          Fluxo: '', // Ações não são exportadas para CSV/PDF
          Turma: class_?.date ? (dateBR(class_.date) ?? '') : '',
          Status: status,
          Nome: name,
          'Cidade Preferencial': preferred_city?.name ?? '',
          Telefone: phone,
          CNH: cnh,
          'UF da CNH': uf_cnh,
          Email: email,
          'Uso de Moto': motorcycle_usage,
          Marca: brand,
          Modelo: model,
          'Data de Inscrição': enrollment_date
        })
      ) ?? [],
    [query.data]
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
      '', // Ações não são exportadas para CSV/PDF
      class_?.date ? (dateBR(class_.date) ?? '') : '',
      status,
      name,
      preferred_city?.name ?? '',
      phone,
      cnh,
      uf_cnh,
      email ?? '',
      motorcycle_usage ?? '',
      brand ?? '',
      model ?? '',
      enrollment_date ? (dateBR(enrollment_date) ?? '') : ''
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return (
    <CRUDTable<Enrollment>
      columns={columns}
      title="Inscrições"
      csvData={csvData}
      pdfConfig={pdfConfig}
      customActions={customActions}
    />
  );
}
