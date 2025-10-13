import { useCallback, useMemo } from 'react';
import { IconClock } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor, Center, Stack, Text } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { EnrollmentStatusCallActions } from '@/components/EnrollmentStatusActions/EnrollmentStatusCallActions';
import { StatusIcon } from '@/components/StatusIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useCRUD } from '@/contexts/CRUDContext';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { dateBR } from '@/utils/dates';

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
  currentPage: _currentPage,
  pageSize: _pageSize,
}: CallManagementTableProps) {
  const { query } = useCRUD();
  const { name } = useAuth();
  const updateFlowMutation = useEnrollmentFlowMutation();

  const handleReturnToWaiting = useCallback(
    (enrollment: Enrollment) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: EnrollmentStatus.WAITING,
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
        isLoading: updateFlowMutation.isPending,
        requiresConfirmation: true,
        confirmationTitle: 'Confirmar Retorno para Lista de Espera',
        confirmationMessage: (enrollment: Enrollment) =>
          `Tem certeza que deseja mover ${enrollment.name} de volta para a Lista de Espera?`,
        confirmationButtonText: 'Confirmar',
        confirmationButtonColor: 'blue',
      },
    ],
    [handleReturnToWaiting, canReturnToWaiting, updateFlowMutation.isPending]
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
        accessorKey: 'class',
        header: 'Turma',
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
        Cell: ({ row }) => <StatusIcon status={row.original.status} />,
      },
      { accessorKey: 'enrollment_date', header: 'Data de Inscrição' },
      {
        accessorKey: 'preferred_city',
        header: 'Cidade Preferencial',
        Cell: ({ row }) => row.original.preferred_city?.name ?? '',
      },
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        Cell: ({ row }) => {
          const phone = row.original.phone;
          const enrollment = row.original;
          if (!phone) {return '';}

          // Regex para extrair apenas números do telefone
          const regex = /\d/g;
          const phoneNumbers = phone.match(regex)?.join('');

          if (!phoneNumbers) {return phone;}

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
          const whatsappUrl =
            `${(isMobile ? 'whatsapp://wa.me/55' : 'https://wa.me/55') +
            phoneNumbers 
            }?text=${ 
            createWhatsAppMessage() 
            }&type=phone_number&app_absent=0`;

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
      { accessorKey: 'email', header: 'Email', enableHiding: true },
      { accessorKey: 'motorcycle_usage', header: 'Uso de Moto', enableHiding: true },
      { accessorKey: 'brand', header: 'Marca', enableHiding: true },
      { accessorKey: 'model', header: 'Modelo', enableHiding: true },
    ],
    []
  );

  // Dados já filtrados pelo backend
  const paginatedData = query.data as any;

  // Tentar diferentes formas de extrair os dados
  let data = [];
  if (paginatedData?.data && Array.isArray(paginatedData.data)) {
    data = paginatedData.data;
  } else if (Array.isArray(paginatedData)) {
    data = paginatedData;
  } else if (paginatedData && typeof paginatedData === 'object') {
    // Se não tem propriedade 'data', talvez os dados estejam diretamente no objeto
    data = Object.values(paginatedData).find((value) => Array.isArray(value)) || [];
  }

  const pagination =
    paginatedData && !Array.isArray(paginatedData)
      ? {
          page: paginatedData.page,
          limit: paginatedData.limit,
          total: paginatedData.total,
          totalPages: paginatedData.totalPages,
        }
      : undefined;

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
    <>
      <CRUDTable<Enrollment>
        columns={columns}
        title="Gestão de Chamadas"
        csvData={csvData}
        pdfConfig={pdfConfig}
        customActions={customActions}
        enableFilters
        enableRowNumbers
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
    </>
  );
}
