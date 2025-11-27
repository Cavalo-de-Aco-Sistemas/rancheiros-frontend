import { useCallback, useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor, Badge } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { CRUDTable } from '@/components/CRUDTable';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { useAuth } from '@/contexts/AuthContext';
import { Member } from '@/model/member';
import { Ranch } from '@/model/ranch';
import { birthdayBR, dateBR } from '@/utils/dates';
import { phasesOptions } from './MembersForm';
import { GET_RANCHES } from '@/graphql/ranches';

const optionsToObject = (
  options: {
    label: string;
    value: string;
  }[]
) => {
  return Object.fromEntries(options.map(({ label, value }) => [value, label]));
};

const digits = /\d+/g;

const phases = optionsToObject(phasesOptions);

const tableHeaders = [
  'Nome no Patch',
  'Fase',
  'Rancho',
  'Residência',
  'Encargo',
  'Padrinho',
  'Nome',
  'Aniversário',
  'Data Prospect',
  'Data Meio escudo',
  'Data Full patch',
  'Tipo sanguíneo',
  'Telefone',
  'Cônjuge',
];

interface MembersTableProps {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  currentPage?: number;
  pageSize?: number;
}

export function MembersTable({
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  pageSize = 10,
}: MembersTableProps = {}) {
  const { query, setPagination, pagination: contextPagination } = useGraphQLCRUD();
  const { ranches: authRanches, super_admin } = useAuth();
  const data = (query.data || []) as Member[];
  
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

  // Query all ranches (for super_admin) or use auth ranches (for regular users)
  const { data: ranchesData } = useQuery(GET_RANCHES, {
    skip: !super_admin,
  });

  // Get ranches options for filter
  const ranchesOptions = useMemo(() => {
    const sourceRanches = super_admin 
      ? (ranchesData?.ranches || [])
      : (authRanches || []);
    
    if (!sourceRanches || sourceRanches.length === 0) {
      return [];
    }
    
    return sourceRanches
      .filter((ranch: Ranch | null | undefined): ranch is Ranch => !!ranch && !!ranch.id)
      .map((ranch: Ranch) => ({ label: ranch.name, value: ranch.name }));
  }, [super_admin, authRanches, ranchesData]);

  // Get members options for godfather and spouse filters
  const membersOptions = useMemo(
    () =>
      data.map((member: Member) => ({
        label: member.name,
        value: member.name,
      })),
    [data]
  );

  // Inicializar contexto apenas na montagem
  // O CRUDTable atualizará o contexto diretamente quando o usuário mudar a página via UI
  // Quando há contexto GraphQL, ele é a fonte de verdade - não sincronizar com props
  useEffect(() => {
    if (setPagination && !contextPagination) {
      // Inicializar apenas se contexto não existe
      setPagination({ page: currentPage, limit: pageSize });
    }
  }, [setPagination]); // Apenas na montagem

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: 'patch',
        header: 'Nome no Patch',
        filterVariant: 'text',
        Cell: ({ row }) =>
          row.original.patch && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.patch}
            </Badge>
          ),
      },
      {
        accessorKey: 'phase',
        header: 'Fase',
        filterVariant: 'select',
        filterFn: 'equals', // Use equals for select filters
        mantineFilterSelectProps: {
          data: phasesOptions.map(opt => ({ label: opt.label, value: opt.value })),
        },
        Cell: ({ row }) => phases[row.original.phase ?? ''] ?? '',
      },
      {
        id: 'ranch.name', // Explicit ID for filtering
        accessorKey: 'ranch.name',
        accessorFn: (row) => row.ranch?.name || '',
        header: 'Rancho',
        filterVariant: 'select',
        filterFn: 'equals', // Use equals for select filters
        mantineFilterSelectProps: {
          data: ranchesOptions,
        },
        Cell: ({ row }) =>
          row.original.ranch?.name && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.ranch.name}
            </Badge>
          ),
      },
      { 
        accessorKey: 'residence', 
        header: 'Residência',
        filterVariant: 'text',
      },
      { 
        accessorKey: 'responsibility', 
        header: 'Encargo',
        filterVariant: 'text',
      },
      {
        id: 'godfather.name', // Explicit ID for filtering
        accessorKey: 'godfather.name',
        accessorFn: (row) => row.godfather?.name || '',
        header: 'Padrinho',
        filterVariant: 'select',
        filterFn: 'equals', // Use equals for select filters
        mantineFilterSelectProps: {
          data: membersOptions,
        },
      },
      { 
        accessorKey: 'name', 
        header: 'Nome',
        filterVariant: 'text',
      },
      {
        accessorKey: 'birthday',
        header: 'Aniversário',
        filterVariant: 'date',
        Cell: ({ row }) => birthdayBR(row.original.birthday),
      },
      {
        accessorKey: 'dateProspect',
        header: 'Data Prospect',
        filterVariant: 'date',
        Cell: ({ row }) => dateBR(row.original.dateProspect),
      },
      {
        accessorKey: 'dateHalfPatch',
        header: 'Data Meio escudo',
        filterVariant: 'date',
        Cell: ({ row }) => dateBR(row.original.dateHalfPatch),
      },
      {
        accessorKey: 'dateFullPatch',
        header: 'Data Full patch',
        filterVariant: 'date',
        Cell: ({ row }) => dateBR(row.original.dateFullPatch),
      },
      {
        accessorKey: 'blood',
        header: 'Tipo sanguíneo',
        Cell: ({ row }) =>
          row.original.blood && (
            <Badge ff="Rye" variant="transparent" color="red.6" radius="xs">
              {row.original.blood}
            </Badge>
          ),
      },
      {
        accessorKey: 'phone',
        header: 'Telefone',
        Cell: ({ row }) =>
          row.original.phone && (
            <Anchor
              href={
                (/Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)
                  ? 'whatsapp://wa.me/55'
                  : 'https://wa.me/55') + row.original.phone.match(digits)?.join('')
              }
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              {row.original.phone.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')}
            </Anchor>
          ),
      },
      {
        accessorKey: 'spouse.name',
        accessorFn: (row) => row.spouse?.name || '',
        header: 'Cônjuge',
      },
    ],
    [ranchesOptions, membersOptions]
  );

  const csvData = useMemo(
    () =>
      data.map(
        ({
          name,
          patch,
          blood,
          phase,
          birthday,
          phone,
          ranch,
          residence,
          responsibility,
          dateProspect,
          dateHalfPatch,
          dateFullPatch,
          spouse,
          godfather,
        }: Member) => ({
          'Nome no Patch': patch ?? '',
          Fase: phase ?? '',
          Rancho: ranch?.name ?? '',
          Residência: residence ?? '',
          Encargo: responsibility ?? '',
          Padrinho: godfather?.name ?? '',
          Nome: name,
          Aniversário: birthday ? (birthdayBR(birthday) ?? '') : '',
          'Data Prospect': dateProspect ? (dateBR(dateProspect) ?? '') : '',
          'Data Meio escudo': dateHalfPatch ? (dateBR(dateHalfPatch) ?? '') : '',
          'Data Full patch': dateFullPatch ? (dateBR(dateFullPatch) ?? '') : '',
          'Tipo sanguíneo': blood ?? '',
          Telefone: phone ?? '',
          Cônjuge: spouse?.name ?? '',
        })
      ),
    [data]
  );

  const rowMapper = useCallback((row: MRT_Row<Member>): string[] => {
    const {
      name,
      patch,
      blood,
      phase,
      birthday,
      phone,
      ranch,
      residence,
      responsibility,
      dateProspect,
      dateHalfPatch,
      dateFullPatch,
      spouse,
      godfather,
    } = row.original;
    return [
      patch ?? '', // Nome no Patch
      phases[phase ?? ''] ?? '', // Fase
      ranch?.name ?? '', // Rancho
      residence ?? '', // Residência
      responsibility ?? '', // Encargo
      godfather?.name ?? '', // Padrinho
      name, // Nome
      birthday ? (birthdayBR(birthday) ?? '') : '', // Aniversário
      dateProspect ? (dateBR(dateProspect) ?? '') : '', // Data Prospect
      dateHalfPatch ? (dateBR(dateHalfPatch) ?? '') : '', // Data Meio escudo
      dateFullPatch ? (dateBR(dateFullPatch) ?? '') : '', // Data Full patch
      blood ?? '', // Tipo sanguíneo
      phone ?? '', // Telefone
      spouse?.name ?? '', // Cônjuge
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

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

  return (
    <CRUDTable
      columns={columns}
      title="Membros"
      csvData={csvData}
      pdfConfig={pdfConfig}
      data={data}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      enableFilters={true}
      columnVisibility={{
        blood: false,
        phone: false,
        'spouse.name': false,
      }}
      emptyStateMessage="Nenhum membro encontrado"
      emptyStateDescription="Os membros aparecerão aqui conforme forem sendo cadastrados"
    />
  );
}
