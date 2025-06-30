import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row } from 'mantine-react-table';
import { CRUDTable } from '@/components/CRUDTable';
import { useCRUD } from '@/contexts/CRUDContext';
import { Enrollment } from '@/model/enrollment';
import { dateBR } from '@/utils/dates';

const tableHeaders = [
  'Nome',
  'Telefone',
  'CNH',
  'UF da CNH',
  'Cidade Preferencial',
  'Email',
  'Uso de Moto',
  'Marca',
  'Modelo',
  'Status',
  'Data de Inscrição',
  'Turma',
];

export function EnrollmentsTable() {
  const { query } = useCRUD();

  const columns = useMemo<MRT_ColumnDef<Enrollment>[]>(
    () => [
      { accessorKey: 'name', header: 'Nome' },
      { accessorKey: 'phone', header: 'Telefone' },
      { accessorKey: 'cnh', header: 'CNH' },
      { accessorKey: 'uf_cnh', header: 'UF da CNH' },
      {
        accessorKey: 'preferred_city',
        header: 'Cidade Preferencial',
        Cell: ({ row }) => row.original.preferred_city?.name ?? '',
      },
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

  const csvData = useMemo(
    () =>
      query.data?.map(
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
          Nome: name,
          Telefone: phone,
          CNH: cnh,
          'UF da CNH': uf_cnh,
          'Cidade Preferencial': preferred_city?.name ?? '',
          Email: email,
          'Uso de Moto': motorcycle_usage,
          Marca: brand,
          Modelo: model,
          Status: status,
          'Data de Inscrição': enrollment_date,
          Turma: class_?.date ? (dateBR(class_.date) ?? '') : '',
        })
      ) ?? [],
    [query.data]
  );

  const rowMapper = useCallback((row: MRT_Row<Enrollment>): string[] => {
    const {
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
    } = row.original;
    return [
      name,
      phone,
      cnh,
      uf_cnh,
      preferred_city?.name ?? '',
      email ?? '',
      motorcycle_usage ?? '',
      brand ?? '',
      model ?? '',
      status ?? '',
      enrollment_date ? (dateBR(enrollment_date) ?? '') : '',
      class_?.date ? (dateBR(class_.date) ?? '') : '',
    ];
  }, []);

  const pdfConfig = useMemo(() => ({ tableHeaders, rowMapper }), [rowMapper]);

  return (
    <CRUDTable<Enrollment>
      columns={columns}
      title="Inscrições"
      csvData={csvData}
      pdfConfig={pdfConfig}
    />
  );
}
