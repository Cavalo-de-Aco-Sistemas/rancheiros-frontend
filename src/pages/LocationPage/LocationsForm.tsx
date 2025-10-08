import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Location, LocationDto } from '@/model/location';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { Ranch } from '@/model/ranch';

const INITIAL_VALUES = { name: '' };

const parseSelected = (location: Location): LocationDto => {
  const { name, ranch } = location;
  return {
    name,
    ranch: ranch?.id.toString() || null,
  };
};

export function LocationsForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;
  const { ranches } = useAuth();

  const form = useForm<LocationDto>({
    initialValues: INITIAL_VALUES,
  });

  const ranchesOptions = useMemo(
    () => ranches?.map((ranch: Ranch) => ({ label: ranch.name, value: ranch.id.toString() })),
    [ranches]
  );

  return (
    <CRUDForm<Location, LocationDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="locations"
      modalProps={{ title: 'Cadastro de Locais de Treinamento', size: 'xl' }}
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={isPending || action === 'delete'}
      />
      <Select
        required
        label="Rancho"
        data={ranchesOptions}
        key={form.key('ranch')}
        {...form.getInputProps('ranch')}
        disabled={isPending || action === 'delete'}
        searchable
        clearable
      />
    </CRUDForm>
  );
}
