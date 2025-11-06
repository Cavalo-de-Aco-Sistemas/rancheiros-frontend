import { useMemo } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery } from '@apollo/client';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_LOCATION, DELETE_LOCATION, UPDATE_LOCATION } from '@/graphql/locations';
import { GET_RANCHES } from '@/graphql/ranches';
import { Location, LocationDto } from '@/model/location';
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
  const { query, action } = useGraphQLCRUD();
  const { ranches: authRanches, super_admin } = useAuth();
  
  // Query all ranches (for super_admin) or use auth ranches (for regular users)
  const { data: ranchesData } = useQuery(GET_RANCHES, {
    skip: !super_admin, // Only query if super_admin
  });

  const form = useForm<LocationDto>({
    initialValues: INITIAL_VALUES,
  });

  const ranchesOptions = useMemo(() => {
    // For super_admin, use all ranches from query; for regular users, use from auth
    const sourceRanches = super_admin 
      ? (ranchesData?.ranches || [])
      : (authRanches || []);
    
    return sourceRanches.map((ranch: Ranch) => ({ label: ranch.name, value: ranch.id.toString() }));
  }, [super_admin, authRanches, ranchesData]);

  return (
    <GraphQLCRUDForm<Location, LocationDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_LOCATION}
      updateMutation={UPDATE_LOCATION}
      deleteMutation={DELETE_LOCATION}
      modalProps={{ title: 'Cadastro de Locais de Treinamento', size: 'xl' }}
      entityName="Local de Treinamento"
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
