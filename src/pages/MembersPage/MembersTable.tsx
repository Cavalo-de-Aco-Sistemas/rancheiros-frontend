import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { Anchor, Badge } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { Member } from '@/model/member';
import { phasesOptions, ranchOptions } from './MembersForm';

const optionsToObject = (
  options: {
    label: string;
    value: string;
  }[]
) => {
  return Object.fromEntries(options.map(({ label, value }) => [value, label]));
};

const dateBR = (date: string | null) => date?.split('-').reverse().join('/');
const digits = /\d+/g;
const ranchs = optionsToObject(ranchOptions);
const phases = optionsToObject(phasesOptions);

export function MembersTable() {
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
        accessorKey: 'ranch',
        header: 'Rancho',
        Cell: ({ row }) => ranchs[row.original.ranch ?? ''] ?? '',
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

  return <CRUDTable columns={columns} />;
}
