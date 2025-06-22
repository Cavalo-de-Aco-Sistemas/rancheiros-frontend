import { useMemo } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { Enrollment } from '@/model/enrollment';

export function EnrollmentsTable() {
  const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      { accessorKey: 'phone', header: 'Telefone' },
      { accessorKey: 'cnh', header: 'CNH' },
      { accessorKey: 'uf_cnh', header: 'UF da CNH' },
      { accessorKey: 'preferred_city', header: 'Cidade Preferencial' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'motorcycle_usage', header: 'Uso de Moto' },
      { accessorKey: 'brand', header: 'Marca' },
      { accessorKey: 'model', header: 'Modelo' },
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'enrollment_date', header: 'Data de Inscrição' },
      { accessorKey: 'class', header: 'Turma' },
    ],
    []
  );

  return <CRUDTable<Enrollment> columns={columns} title="Inscrições" />;
}
