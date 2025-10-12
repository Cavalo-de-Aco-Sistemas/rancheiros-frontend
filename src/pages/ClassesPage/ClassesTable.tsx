import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { ActionIcon, Tooltip, Switch } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';
import { useClassToggleActiveMutation } from '@/mutations/useClassToggleActiveMutation';

const tableHeaders = ['Local do MPV', 'Data', 'Link do Maps', 'Ativo'];

export function ClassesTable() {
  const { query } = useCRUD();
  const toggleActiveMutation = useClassToggleActiveMutation();

  const handleToggleActive = useCallback((classItem: Class) => {
    toggleActiveMutation.mutate({
      classId: classItem.id,
      active: !classItem.active,
    });
  }, [toggleActiveMutation]);

  const columns = useMemo<MRT_ColumnDef<Class>[]>(
    () => [
      { accessorKey: 'location.name', header: 'Local do MPV' },
      {
        accessorKey: 'date',
        header: 'Data',
        Cell: ({ row }) => dateBR(row.original.date),
      },
      {
        accessorKey: 'mapsLink',
        header: 'Link do Maps',
        Cell: ({ row }) => {
          const mapsLink = row.original.mapsLink;
          if (!mapsLink) return null;
          
          return (
            <Tooltip label="Abrir no Google Maps" position="top">
              <ActionIcon
                variant="subtle"
                color="blue"
                size="sm"
                onClick={() => window.open(mapsLink, '_blank', 'noopener,noreferrer')}
              >
                <IconMapPin size={16} />
              </ActionIcon>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: 'active',
        header: 'Ativo',
        Cell: ({ row }) => (
          <Switch
            checked={row.original.active}
            onChange={() => handleToggleActive(row.original)}
            disabled={toggleActiveMutation.isPending}
            size="sm"
            color="green"
          />
        ),
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

  return (
    <CRUDTable 
      columns={columns} 
      title="Turmas" 
      csvData={csvData} 
      pdfConfig={pdfConfig}
    />
  );
}
