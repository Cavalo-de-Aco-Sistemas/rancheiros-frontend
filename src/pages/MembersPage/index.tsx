import { useMemo } from 'react';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { Member } from '@/model/member';
import useMembersQuery from '@/queries/useMembersQuery';

export function MembersPage() {
  const { data } = useMembersQuery();

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      { accessorKey: 'phase', header: 'Fase' },
      { accessorKey: 'birthday', header: 'Aniversário' },
      { accessorKey: 'phone', header: 'Telefone' },
      { accessorKey: 'ranch', header: 'Rancho' },
      { accessorKey: 'city', header: 'Cidade' },
      { accessorKey: 'state', header: 'Estado' },
      { accessorKey: 'responsibility', header: 'Encargo' },
      { accessorKey: 'dateProspect', header: 'Data prospect' },
      { accessorKey: 'dateHalfPatch', header: 'Data meio escudo' },
      { accessorKey: 'dateFullPatch', header: 'Data full patch' },
      { accessorKey: 'spouse.name', header: 'Cônjuge' },
      { accessorKey: 'godfather.name', header: 'Padrinho' },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    mantinePaperProps: {
      style: {
        border: 'none',
      },
    },
    enableBottomToolbar: false,
    enablePagination: false,
    enableRowVirtualization: true,
    mantineTableContainerProps: { style: { maxHeight: 'calc(100vh - 128px)' } },
  });

  return <MantineReactTable table={table} />;
}
