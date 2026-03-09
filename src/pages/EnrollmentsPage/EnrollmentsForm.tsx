import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { GET_CLASSES } from '@/graphql/classes';
import {
  CREATE_ENROLLMENT,
  DELETE_ENROLLMENT,
  GET_ENROLLMENTS,
  UPDATE_ENROLLMENT,
} from '@/graphql/enrollments';
import { GET_LOCATIONS } from '@/graphql/locations';
import { useEnrollmentsData } from '@/hooks/useSharedEnrollments';
import { Class } from '@/model/class';
import { Enrollment, EnrollmentDto, EnrollmentStatus } from '@/model/enrollment';
import { Location } from '@/model/location';

// Tipo para criação de inscrição (sem status e class)
type CreateEnrollmentDto = Omit<EnrollmentDto, 'status' | 'class'>;

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

// Função para transformar dados antes do envio (remove status e class apenas para criação)
const transformData = (
  data: EnrollmentDto,
  isCreate: boolean = false
): CreateEnrollmentDto | EnrollmentDto => {
  if (isCreate) {
    const { status, class: classField, ...createData } = data;
    return createData;
  }
  return data; // Para edição, retorna todos os dados
};

export function EnrollmentsForm() {
  const { data: classesData } = useQuery(GET_CLASSES);
  const { data: locationsData } = useQuery(GET_LOCATIONS);

  const classes = classesData?.classes || [];
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

  const { data, loading, error, refetch } = useEnrollmentsData();
  const query = { data, isLoading: loading, isError: !!error, error, refetch };
  const action = 'create'; // Default action for form

  // Desabilitar campos durante criação
  const isCreating = action === 'create';

  const form = useForm<EnrollmentDto>({
    initialValues: INITIAL_VALUES,
    validate: {
      email: (value) =>
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Email inválido'
          : null,
    },
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
      entityName="Inscrição"
      transformData={transformData}
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
      {!isCreating && (
        <Select
          required
          label="Status"
          key={form.key('status')}
          {...form.getInputProps('status')}
          disabled={query.isLoading}
          data={Object.values(EnrollmentStatus).map((status) => ({ label: status, value: status }))}
        />
      )}
      {!isCreating && (
        <Select
          label="Turma"
          key={form.key('class')}
          {...form.getInputProps('class')}
          disabled={query.isLoading}
          data={classesOptions}
          searchable
          clearable
        />
      )}
    </GraphQLCRUDForm>
  );
}
