import { useCallback, useMemo } from 'react';
import { IconClock } from '@tabler/icons-react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { StatusIcon } from '@/components/StatusIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useCRUD } from '@/contexts/CRUDContext';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { dateBR } from '@/utils/dates';

const tableHeaders = [
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

interface EnrollmentsTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function EnrollmentsTable({
  onPageChange,
  onPageSizeChange,
  currentPage: _currentPage,
  pageSize: _pageSize,
}: EnrollmentsTableProps = {}) {
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
    return (
      enrollment.status !== EnrollmentStatus.WAITING &&
      enrollment.status !== EnrollmentStatus.CERTIFIED &&
      enrollment.status !== EnrollmentStatus.MISSED
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
          return date ? (dateBR(date) ?? '') : '';
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

  const csvData = useMemo(() => {
    // Handle both array and paginated data
    const data = Array.isArray(query.data) ? query.data : query.data?.data || [];

    return data.map(
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
    );
  }, [query.data]);

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

  // Extrair dados corretamente (pode ser array ou paginado)
  const data = (Array.isArray(query.data)
    ? query.data
    : query.data?.data || []) as unknown as Enrollment[];

  // Configuração de paginação
  const pagination = query.data && !Array.isArray(query.data)
    ? {
        page: query.data.page,
        limit: query.data.limit,
        total: query.data.total,
        totalPages: query.data.totalPages,
      }
    : undefined;


  return (
    <>
      <CRUDTable<Enrollment>
        columns={columns}
        title="Visão Geral - Inscrições"
        csvData={csvData}
        pdfConfig={pdfConfig}
        customActions={customActions}
        enableEdit
        enableFilters
        enableRowNumbers
        data={data}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        columnVisibility={{
          cnh: false,
          email: false,
          motorcycle_usage: false,
          brand: false,
          model: false,
        }}
        emptyStateMessage="Nenhuma inscrição encontrada"
        emptyStateDescription="As inscrições aparecerão aqui conforme forem sendo criadas"
      />
    </>
  );
}
