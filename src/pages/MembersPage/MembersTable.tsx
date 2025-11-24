import { useCallback, useEffect, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor, Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { Member } from '@/model/member';
import { birthdayBR, dateBR } from '@/utils/dates';
import { phasesOptions } from './MembersForm';

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
  const { query, setPagination } = useGraphQLCRUD();
  const data = (query.data || []) as Member[];

  // Sincronizar paginação com contexto para server-side sorting
  useEffect(() => {
    if (setPagination) {
      setPagination({ page: currentPage, limit: pageSize });
    }
  }, [currentPage, pageSize, setPagination]);

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: 'patch',
        header: 'Nome no Patch',
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
        Cell: ({ row }) => phases[row.original.phase ?? ''] ?? '',
      },
      {
        accessorKey: 'ranch.name',
        accessorFn: (row) => row.ranch?.name || '',
        header: 'Rancho',
        Cell: ({ row }) =>
          row.original.ranch?.name && (
            <Badge ff="Rye" variant="outline" color="white" radius="xs">
              {row.original.ranch.name}
            </Badge>
          ),
      },
      { accessorKey: 'residence', header: 'Residência' },
      { accessorKey: 'responsibility', header: 'Encargo' },
      {
        accessorKey: 'godfather.name',
        accessorFn: (row) => row.godfather?.name || '',
        header: 'Padrinho',
      },
      { accessorKey: 'name', header: 'Nome' },
      {
        accessorKey: 'birthday',
        header: 'Aniversário',
        Cell: ({ row }) => birthdayBR(row.original.birthday),
      },
      {
        accessorKey: 'dateProspect',
        header: 'Data Prospect',
        Cell: ({ row }) => dateBR(row.original.dateProspect),
      },
      {
        accessorKey: 'dateHalfPatch',
        header: 'Data Meio escudo',
        Cell: ({ row }) => dateBR(row.original.dateHalfPatch),
      },
      {
        accessorKey: 'dateFullPatch',
        header: 'Data Full patch',
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
    []
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
  // Não fazer paginação local, usar dados diretamente
  const pagination = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      total: data.length, // Backend retorna total quando paginado, mas pode ser length do array
      totalPages: Math.ceil(data.length / pageSize),
    }),
    [data.length, currentPage, pageSize]
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
