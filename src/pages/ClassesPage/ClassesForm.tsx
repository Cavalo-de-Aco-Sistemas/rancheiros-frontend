import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Checkbox, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_CLASS, DELETE_CLASS, GET_CLASSES, UPDATE_CLASS } from '@/graphql/classes';
import { GET_LOCATIONS } from '@/graphql/locations';
import { Class, ClassCreateDto, ClassDto } from '@/model/class';
import { Location } from '@/model/location';

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
  const { query, action } = useGraphQLCRUD();
  const { data: locationsData } = useQuery(GET_LOCATIONS);

  const locations = locationsData?.locations || [];

  const locationsOptions = useMemo(
    () =>
      locations.map((location: Location) => ({
        label: location.name,
        value: location.id.toString(),
      })),
    [locations]
  );

  const form = useForm<ClassDto>({
    initialValues: INITIAL_VALUES,
  });

  const transformForAPI = (data: ClassDto): ClassCreateDto => ({
    ...data,
    date: data.date ? data.date.toISOString().split('T')[0] : null,
  });

  return (
    <GraphQLCRUDForm<Class, ClassDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_CLASS}
      updateMutation={UPDATE_CLASS}
      deleteMutation={DELETE_CLASS}
      refetchQueries={[{ query: GET_CLASSES }]}
      modalProps={{ title: 'Cadastro de Turmas', size: 'xl' }}
      entityName="Turma"
      transformData={transformForAPI}
    >
      <Select
        required
        label="Local do treinamento"
        key={form.key('location')}
        {...form.getInputProps('location')}
        disabled={query.isLoading || action === 'delete'}
        data={locationsOptions}
      />
      <DateInput
        required
        label="Data"
        key={form.key('date')}
        {...form.getInputProps('date')}
        disabled={query.isLoading || action === 'delete'}
        valueFormat="DD/MM/YYYY"
        placeholder="DD/MM/AAAA"
      />
      <TextInput
        required
        label="Link do Google Maps"
        key={form.key('mapsLink')}
        {...form.getInputProps('mapsLink')}
        disabled={query.isLoading || action === 'delete'}
      />
      <Checkbox
        label="Ativo"
        key={form.key('active')}
        {...form.getInputProps('active')}
        disabled={query.isLoading || action === 'delete'}
        checked={form.values.active}
        onChange={(event) => form.setFieldValue('active', event.currentTarget.checked)}
      />
    </GraphQLCRUDForm>
  );
}
