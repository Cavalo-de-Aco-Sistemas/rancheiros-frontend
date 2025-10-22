import { useMemo } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { Location, LocationDto } from '@/model/location';
import { Ranch } from '@/model/ranch';
import { CREATE_LOCATION, UPDATE_LOCATION, DELETE_LOCATION } from '@/graphql/locations';

const INITIAL_VALUES = { name: '' };

const parseSelected = (location: Location): LocationDto => {
  const { name, ranch } = location;
  return {
    name,
    ranch: ranch?.id.toString() || null,
  };
};

export function LocationsForm() {
  const { query, action } = useGraphQLCRUD();
  const { ranches } = useAuth();

  const form = useForm<LocationDto>({
    initialValues: INITIAL_VALUES,
  });

  const ranchesOptions = useMemo(
    () => ranches?.map((ranch: Ranch) => ({ label: ranch.name, value: ranch.id.toString() })),
    [ranches]
  );

  return (
    <GraphQLCRUDForm<Location, LocationDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_LOCATION}
      updateMutation={UPDATE_LOCATION}
      deleteMutation={DELETE_LOCATION}
      modalProps={{ title: 'Cadastro de Locais de Treinamento', size: 'xl' }}
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={query.isLoading || action === 'delete'}
      />
      <Select
        required
        label="Rancho"
        data={ranchesOptions}
        key={form.key('ranch')}
        {...form.getInputProps('ranch')}
        disabled={query.isLoading || action === 'delete'}
        searchable
        clearable
      />
    </GraphQLCRUDForm>
  );
}
