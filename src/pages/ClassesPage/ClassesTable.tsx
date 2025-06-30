import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { Checkbox } from '@mantine/core';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';

const tableHeaders = ['Local do MPV', 'Data', 'Link do Maps', 'Ativo'];

export function ClassesTable() {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Class>[]>(
    () => [
      { accessorKey: 'location.name', header: 'Local do MPV' },
      {
        accessorKey: 'date',
        header: 'Data',
        Cell: ({ row }) => dateBR(row.original.date),
      },
      { accessorKey: 'mapsLink', header: 'Link do Maps' },
      {
        accessorKey: 'active',
        header: 'Ativo',
        Cell: ({ row }) => <Checkbox.Indicator checked={row.original.active} radius="xl" />,
      },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      query.data?.map(({ location, date, mapsLink, active }) => ({
        'Local do MPV': location?.name,
        Data: date,
        'Link do Maps': mapsLink,
        Ativo: active,
      })) ?? [],
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Class>) => {
    const { location, date, mapsLink, active } = row.original;
    return [location?.name ?? '', dateBR(date) ?? '', mapsLink, active];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return <CRUDTable columns={columns} title="Turmas" csvData={csvData} pdfConfig={pdfConfig} />;
}
