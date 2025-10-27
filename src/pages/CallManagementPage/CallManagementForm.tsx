import { useMemo } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQuery } from '@apollo/client';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { Class } from '@/model/class';
import { Enrollment, EnrollmentDto, EnrollmentStatus } from '@/model/enrollment';
import { Location } from '@/model/location';
import { GET_ACTIVE_CLASSES } from '@/graphql/classes';
import { GET_LOCATIONS } from '@/graphql/locations';
import { GET_ENROLLMENTS, CREATE_ENROLLMENT, UPDATE_ENROLLMENT, DELETE_ENROLLMENT } from '@/graphql/enrollments';

const INITIAL_VALUES = {
  name: '',
  phone: '',
  cnh: '',
  uf_cnh: '',
  preferred_city: null,
  email: '',
  motorcycle_usage: '',
  brand: '',
  model: '',
  status: EnrollmentStatus.WAITING,
  class: null,
};

const parseSelected = (enrollment: Enrollment): EnrollmentDto => {
  return {
    ...enrollment,
    class: enrollment.class?.id.toString() || null,
    preferred_city: enrollment.preferred_city?.id.toString() ?? '',
  };
};

export function CallManagementForm() {
  const { data: classesData } = useQuery(GET_ACTIVE_CLASSES);
  const { data: locationsData } = useQuery(GET_LOCATIONS);
  const { query } = useGraphQLCRUD<Enrollment>();

  const classes = classesData?.activeClasses || [];
  const locations = locationsData?.locations || [];

  const classesOptions = useMemo(
    () =>
      classes.map((classs: Class) => ({
        label: classs.location?.name ?? '',
        value: classs.id.toString(),
      })),
    [classes]
  );

  const locationsOptions = useMemo(
    () =>
      locations.map((location: Location) => ({
        label: location.name,
        value: location.id.toString(),
      })),
    [locations]
  );

  const form = useForm<EnrollmentDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <GraphQLCRUDForm<Enrollment, EnrollmentDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_ENROLLMENT}
      updateMutation={UPDATE_ENROLLMENT}
      deleteMutation={DELETE_ENROLLMENT}
      refetchQueries={[{ query: GET_ENROLLMENTS }]}
      modalProps={{ title: 'Cadastro de Inscrições', size: 'xl' }}
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={query.isLoading}
      />
      <TextInput
        required
        label="Telefone"
        key={form.key('phone')}
        {...form.getInputProps('phone')}
        disabled={query.isLoading}
      />
      <TextInput
        required
        label="CNH"
        key={form.key('cnh')}
        {...form.getInputProps('cnh')}
        disabled={query.isLoading}
      />
      <TextInput
        required
        label="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
        disabled={query.isLoading}
      />
      <TextInput
        required
        label="UF da CNH"
        key={form.key('uf_cnh')}
        {...form.getInputProps('uf_cnh')}
        disabled={query.isLoading}
      />
      <Select
        required
        label="Localidade de Preferência"
        key={form.key('preferred_city')}
        {...form.getInputProps('preferred_city')}
        disabled={query.isLoading}
        data={locationsOptions}
        searchable
        clearable
      />
      <Select
        required
        label="Status"
        key={form.key('status')}
        {...form.getInputProps('status')}
        disabled={query.isLoading}
        data={Object.values(EnrollmentStatus).map((status) => ({ label: status, value: status }))}
      />
      <Select
        label="Turma"
        key={form.key('class')}
        {...form.getInputProps('class')}
        disabled={query.isLoading}
        data={classesOptions}
        searchable
        clearable
      />
    </GraphQLCRUDForm>
  );
}
