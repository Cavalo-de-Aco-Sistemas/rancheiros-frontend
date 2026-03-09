import { useMemo } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
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

type CreateEnrollmentDto = Omit<EnrollmentDto, 'status' | 'class'>;

const VALIDATION_TRANSLATIONS: Record<string, string> = {
  'email must be an email': 'O email informado não é válido',
  'Email must be a valid email address': 'O email informado não é válido',
  'name should not be empty': 'O nome é obrigatório',
  'name must be a string': 'O nome é obrigatório',
  'phone should not be empty': 'O telefone é obrigatório',
  'cnh should not be empty': 'A CNH é obrigatória',
  'uf_cnh should not be empty': 'A UF da CNH é obrigatória',
  'preferred_city should not be empty': 'A localidade de preferência é obrigatória',
  'Preferred city ID must be a valid UUID': 'A localidade de preferência é inválida',
};

function handleError(error: ApolloError): string | undefined {
  const originalMessages =
    (error.graphQLErrors?.[0]?.extensions?.originalError as { message?: string[] })?.message;

  if (!Array.isArray(originalMessages)) {return undefined;}

  const translated = originalMessages.map(
    (msg) => VALIDATION_TRANSLATIONS[msg] ?? msg
  );
  return translated.join('. ');
}

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

const transformData = (
  data: EnrollmentDto,
): CreateEnrollmentDto => {
  const { name, phone, cnh, uf_cnh, preferred_city, email, motorcycle_usage, brand, model } = data;
  return { name, phone, cnh, uf_cnh, preferred_city, email, motorcycle_usage, brand, model };
};

export function EnrollmentsForm() {
  const { data: classesData } = useQuery(GET_CLASSES);
  const { data: locationsData } = useQuery(GET_LOCATIONS);

  const classesOptions = useMemo(
    () =>
      (classesData?.classes || []).map((classs: Class) => ({
        label: classs.location?.name ?? '',
        value: classs.id.toString(),
      })),
    [classesData?.classes]
  );

  const locationsOptions = useMemo(
    () =>
      (locationsData?.locations || []).map((location: Location) => ({
        label: location.name,
        value: location.id.toString(),
      })),
    [locationsData?.locations]
  );

  const { data, loading, error, refetch } = useEnrollmentsData();
  const query = { data, isLoading: loading, isError: !!error, error, refetch };
  const action = 'create'; // Default action for form

  // Desabilitar campos durante criação
  const isCreating = action === 'create';

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
      handleError={handleError}
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
