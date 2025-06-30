import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Anchor, Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Member } from '@/model/member';
import { dateBR } from '@/utils/dates';
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
  'Nome',
  'Nome no Patch',
  'Tipo sanguíneo',
  'Fase',
  'Aniversário',
  'Telefone',
  'Rancho',
  'Residência',
  'Encargo',
  'Data Prospect',
  'Data Meio escudo',
  'Data Full patch',
  'Cônjuge',
  'Padrinho',
];

export function MembersTable() {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
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
        accessorKey: 'phase',
        header: 'Fase',
        Cell: ({ row }) => phases[row.original.phase ?? ''] ?? '',
      },
      {
        accessorKey: 'birthday',
        header: 'Aniversário',
        Cell: ({ row }) => dateBR(row.original.birthday),
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
        accessorKey: 'ranch.name',
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
      { accessorKey: 'spouse.name', header: 'Cônjuge' },
      { accessorKey: 'godfather.name', header: 'Padrinho' },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      query.data?.map(
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
        }) => ({
          Nome: name,
          'Nome no Patch': patch ?? '',
          'Tipo sanguíneo': blood ?? '',
          Fase: phase ?? '',
          Aniversário: birthday ? (dateBR(birthday) ?? '') : '',
          Telefone: phone ?? '',
          Rancho: ranch?.name ?? '',
          Residência: residence ?? '',
          Encargo: responsibility ?? '',
          'Data Prospect': dateProspect ? (dateBR(dateProspect) ?? '') : '',
          'Data Meio escudo': dateHalfPatch ? (dateBR(dateHalfPatch) ?? '') : '',
          'Data Full patch': dateFullPatch ? (dateBR(dateFullPatch) ?? '') : '',
          Cônjuge: spouse?.name ?? '',
          Padrinho: godfather?.name ?? '',
        })
      ) ?? [],
    [query.data]
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
      name,
      patch ?? '',
      blood ?? '',
      phase ?? '',
      birthday ? (dateBR(birthday) ?? '') : '',
      phone ?? '',
      ranch?.name ?? '',
      residence ?? '',
      responsibility ?? '',
      dateProspect ? (dateBR(dateProspect) ?? '') : '',
      dateHalfPatch ? (dateBR(dateHalfPatch) ?? '') : '',
      dateFullPatch ? (dateBR(dateFullPatch) ?? '') : '',
      spouse?.name ?? '',
      godfather?.name ?? '',
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return <CRUDTable columns={columns} title="Membros" csvData={csvData} pdfConfig={pdfConfig} />;
}
