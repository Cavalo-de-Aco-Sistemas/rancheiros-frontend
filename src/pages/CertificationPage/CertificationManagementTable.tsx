import { useCallback, useMemo } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor, Center, Stack, Text } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { EnrollmentStatusCertificationActions } from '@/components/EnrollmentStatusActions/EnrollmentStatusCertificationActions';
import { StatusIcon } from '@/components/StatusIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificationData } from '@/hooks/useSharedEnrollments';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
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

interface CertificationManagementTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function CertificationManagementTable({
  onPageChange,
  onPageSizeChange,
  currentPage: _currentPage = 1,
  pageSize: _pageSize = 50,
}: CertificationManagementTableProps) {
  const { data: certificationData, loading, error, refetch } = useCertificationData();
  const query = { data: certificationData, isLoading: loading, isError: !!error, error, refetch };
  const { name } = useAuth();
  const updateFlowMutation = useEnrollmentFlowMutation();

  const handleCertify = useCallback(
    (enrollment: Enrollment) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: EnrollmentStatus.CERTIFIED,
        enrollmentName: enrollment.name,
      });
    },
    [updateFlowMutation]
  );

  const handleMarkAsMissed = useCallback(
    (enrollment: Enrollment) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: EnrollmentStatus.MISSED,
        enrollmentName: enrollment.name,
      });
    },
    [updateFlowMutation]
  );

  const canCertify = useCallback((enrollment: Enrollment) => {
    // Só pode certificar se estiver confirmado
    return enrollment.status === EnrollmentStatus.CONFIRMED;
  }, []);

  const canMarkAsMissed = useCallback((enrollment: Enrollment) => {
    // Só pode marcar como faltou se estiver confirmado
    return enrollment.status === EnrollmentStatus.CONFIRMED;
  }, []);

  const customActions = useMemo(
    () => [
      {
        label: 'Certificar',
        icon: IconCheck,
        onClick: handleCertify,
        isVisible: canCertify,
        isLoading: updateFlowMutation.isLoading,
        requiresConfirmation: true,
        confirmationTitle: 'Confirmar Certificação',
        confirmationMessage: (enrollment: Enrollment) =>
          `Tem certeza que deseja certificar ${enrollment.name}?`,
        confirmationButtonText: 'Certificar',
        confirmationButtonColor: 'green',
      },
      {
        label: 'Marcar como Faltou',
        icon: IconX,
        onClick: handleMarkAsMissed,
        isVisible: canMarkAsMissed,
        isLoading: updateFlowMutation.isLoading,
        requiresConfirmation: true,
        confirmationTitle: 'Confirmar Falta',
        confirmationMessage: (enrollment: Enrollment) =>
          `Tem certeza que deseja marcar ${enrollment.name} como faltou?`,
        confirmationButtonText: 'Confirmar Falta',
        confirmationButtonColor: 'red',
      },
    ],
    [handleCertify, handleMarkAsMissed, canCertify, canMarkAsMissed, updateFlowMutation.isLoading]
  );

  const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
    () => [
      {
        id: 'actions',
        header: 'Fluxo',
        Cell: ({ row }) => <EnrollmentStatusCertificationActions enrollment={row.original} />,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
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
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
        filterSelectOptions: [
          { label: 'Aguardando', value: 'waiting' },
          { label: 'Chamado', value: 'called' },
          { label: 'Confirmado', value: 'confirmed' },
          { label: 'Ignorado', value: 'ignored' },
          { label: 'Desistiu', value: 'dropped' },
          { label: 'Faltou', value: 'missed' },
          { label: 'Certificado', value: 'certified' },
        ],
        filterFn: 'equals',
        Cell: ({ row }) => <StatusIcon status={row.original.status} />,
      },
      {
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
        accessorKey: 'preferred_city',
        header: 'Cidade Preferencial',
        filterVariant: 'text',
        filterFn: 'contains',
        Cell: ({ row }) => row.original.preferred_city?.name ?? '',
      },
      {
        accessorKey: 'name',
        header: 'Nome',
        filterVariant: 'text',
        filterFn: 'contains',
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        filterVariant: 'text',
        filterFn: 'contains',
        Cell: ({ row }) => {
          const phone = row.original.phone;
          const enrollment = row.original;
          if (!phone) {
            return '';
          }

          // Regex para extrair apenas números do telefone
          const regex = /\d/g;
          const phoneNumbers = phone.match(regex)?.join('');

          if (!phoneNumbers) {
            return phone;
          }

          // Formatar telefone para exibição (XX) XXXXX-XXXX
          const formattedPhone = phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');

          // Detectar se é dispositivo móvel
          const isMobile = /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);

          // Criar mensagem padrão com parâmetros da turma
          const createWhatsAppMessage = () => {
            const studentName = enrollment.name ? enrollment.name.split(' ')[0] : '';
            const adminName = name ? name.split(' ')[0] : '';
            const className = enrollment.class;
            const classDate = className?.date ? dateBR(className.date) : '';
            const classLocation = className?.location?.name || '';
            const classCity = enrollment.preferred_city?.name || '';

            const message = `Olá ${studentName},
Aqui é ${adminName} - Rancheiros Moto Clube, tudo certo?
https://www.rancheirosmc.com.br

Estou entrando em contato para confirmar sua presença em nosso treinamento do curso Manobras para Vida.

O curso ocorrerá na região de ${classCity} no dia ${classDate} no seguinte local ${classLocation}

Gostaria de reafirmar a nossa alegria em tê-lo(a) conosco e lembra-lo(a) de algumas recomendações importantes:

1. O treinamento inicia pontualmente as 8h.

2. Para a realização do treinamento é necessário que venha com a sua motocicleta (não fornecemos motos)

3. Você deverá vir devidamente equipado, com capacete, calça comprida e calçado fechado (por segurança esses são os requisitos mínimos, sendo vedada a participação caso não sejam cumpridos)

4. Somente será certificado o aluno(a) que permanecer até o final do treinamento.

Qualquer dúvida estamos a disposição para esclarecimentos.

Deus abençoe grandemente.`;

            return encodeURIComponent(message);
          };

          // URL do WhatsApp com mensagem
          const whatsappUrl = `${
            (isMobile ? 'whatsapp://wa.me/55' : 'https://wa.me/55') + phoneNumbers
          }?text=${createWhatsAppMessage()}&type=phone_number&app_absent=0`;

          return (
            <Anchor href={whatsappUrl} target="_blank" rel="noreferrer">
              {formattedPhone}
            </Anchor>
          );
        },
      },
      { accessorKey: 'uf_cnh', header: 'UF' },
      // Colunas ocultas por padrão
      { accessorKey: 'cnh', header: 'CNH', enableHiding: true },
      {
        accessorKey: 'email',
        header: 'Email',
        enableHiding: true,
        filterVariant: 'text',
        filterFn: 'contains',
      },
      { accessorKey: 'motorcycle_usage', header: 'Uso de Moto', enableHiding: true },
      { accessorKey: 'brand', header: 'Marca', enableHiding: true },
      { accessorKey: 'model', header: 'Modelo', enableHiding: true },
    ],
    []
  );

  // Dados já vêm filtrados do hook compartilhado
  const allData = query.data || [];

  // Paginação client-side
  const paginatedData = useMemo(() => {
    const startIndex = (_currentPage - 1) * _pageSize;
    const endIndex = startIndex + _pageSize;
    return allData.slice(startIndex, endIndex);
  }, [allData, _currentPage, _pageSize]);

  const pagination = useMemo(
    () => ({
      page: _currentPage,
      limit: _pageSize,
      total: allData.length,
      totalPages: Math.ceil(allData.length / _pageSize),
    }),
    [allData.length, _currentPage, _pageSize]
  );

  const csvData = useMemo(
    () =>
      allData?.map(
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
    [allData]
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
      title="Gestão de Certificações"
      csvData={csvData}
      pdfConfig={pdfConfig}
      customActions={customActions}
      enableFilters={true}
      enableRowNumbers={true}
      columnVisibility={{
        status: false,
        enrollment_date: false,
        preferred_city: false,
        uf_cnh: false,
        cnh: false,
        email: false,
        motorcycle_usage: false,
        brand: false,
        model: false,
      }}
      data={paginatedData}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyStateMessage="Nenhuma inscrição confirmada encontrada"
      emptyStateDescription="As inscrições confirmadas aparecerão aqui para certificação"
    />
  );
}
