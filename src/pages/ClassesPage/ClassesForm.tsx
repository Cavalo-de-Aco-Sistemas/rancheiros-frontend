import { useMemo } from 'react';
import { Checkbox, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Class, ClassDto, ClassCreateDto } from '@/model/class';
import { Location } from '@/model/location';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { toDate } from '@/utils/dates';

const INITIAL_VALUES = { location: null, date: null, mapsLink: '', active: true };

const parseSelected = (classs: Class): ClassDto => {
  const { location, date, mapsLink, active } = classs;
  return {
    location: location?.id,
    date: date ? new Date(`${date}T00:00:00`) : null,
    mapsLink,
    active,
  };
};

export function ClassesForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;
  const locationsQuery = useCRUDQuery<Location>('locations');

  const locationsOptions = useMemo(
    () =>
      locationsQuery.data?.map((location: Location) => ({
        label: location.name,
        value: location.id.toString(),
      })),
    [locationsQuery.data]
  );

  const form = useForm<ClassDto>({
    initialValues: INITIAL_VALUES,
  });

  const transformForAPI = (data: ClassDto): ClassCreateDto => ({
    ...data,
    date: data.date ? data.date.toISOString().split('T')[0] : null,
  });

  return (
    <CRUDForm<Class, ClassDto, ClassCreateDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="classes"
      modalProps={{ title: 'Cadastro de Turmas', size: 'xl' }}
      transformData={transformForAPI}
    >
      <Select
        required
        label="Local do treinamento"
        key={form.key('location')}
        {...form.getInputProps('location')}
        disabled={isPending || action === 'delete'}
        data={locationsOptions}
      />
      <DateInput
        required
        label="Data"
        key={form.key('date')}
        {...form.getInputProps('date')}
        disabled={isPending || action === 'delete'}
        valueFormat="DD/MM/YYYY"
        placeholder="DD/MM/AAAA"
      />
      <TextInput
        required
        label="Link do Google Maps"
        key={form.key('mapsLink')}
        {...form.getInputProps('mapsLink')}
        disabled={isPending || action === 'delete'}
      />
      <Checkbox
        label="Ativo"
        key={form.key('active')}
        {...form.getInputProps('active')}
        disabled={isPending || action === 'delete'}
        checked={form.values.active}
        onChange={(event) => form.setFieldValue('active', event.currentTarget.checked)}
      />
    </CRUDForm>
  );
}
