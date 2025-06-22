import { useMemo } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Class } from '@/model/class';
import { Enrollment, EnrollmentDto, EnrollmentStatus } from '@/model/enrollment';
import useCRUDQuery from '@/queries/useCRUDQuery';

const INITIAL_VALUES = {
  name: '',
  phone: '',
  cnh: '',
  uf_cnh: '',
  preferred_city: '',
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
  };
};

export function EnrollmentsForm() {
  const classesQuery = useCRUDQuery<Class>('classes');

  const classesOptions = useMemo(
    () => classesQuery.data?.map((classs) => ({ label: classs.name, value: classs.id.toString() })),
    [classesQuery.data]
  );

  const { query, action } = useCRUD();
  const { isPending } = query;

  const form = useForm<EnrollmentDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <CRUDForm<Enrollment, EnrollmentDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="enrollments"
      modalProps={{ title: 'Cadastro de Inscrições', size: 'xl' }}
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={isPending || action === 'delete'}
      />
      <TextInput
        required
        label="Telefone"
        key={form.key('phone')}
        {...form.getInputProps('phone')}
        disabled={isPending || action === 'delete'}
      />
      <TextInput
        required
        label="CNH"
        key={form.key('cnh')}
        {...form.getInputProps('cnh')}
        disabled={isPending || action === 'delete'}
      />
      <TextInput
        required
        label="UF da CNH"
        key={form.key('uf_cnh')}
        {...form.getInputProps('uf_cnh')}
        disabled={isPending || action === 'delete'}
      />
      <TextInput
        required
        label="Cidade Preferencial"
        key={form.key('preferred_city')}
        {...form.getInputProps('preferred_city')}
        disabled={isPending || action === 'delete'}
      />
      <TextInput
        required
        label="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
        disabled={isPending || action === 'delete'}
      />
      <Select
        required
        label="Status"
        key={form.key('status')}
        {...form.getInputProps('status')}
        disabled={isPending || action === 'delete'}
        data={Object.values(EnrollmentStatus).map((status) => ({ label: status, value: status }))}
      />
      <Select
        required
        label="Turma"
        key={form.key('class')}
        {...form.getInputProps('class')}
        disabled={isPending || action === 'delete'}
        data={classesOptions}
      />
    </CRUDForm>
  );
}
