import { Checkbox, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Class, ClassDto } from '@/model/class';
import { toDate } from '@/utils/dates';

const INITIAL_VALUES = { name: '', city: '', date: null, location: '', active: true };

const parseSelected = (classs: Class): ClassDto => {
  const { name, city, date, location, active } = classs;
  return {
    name,
    city,
    date: toDate(date),
    location,
    active,
  };
};

export function ClassesForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;

  const form = useForm<ClassDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <CRUDForm<Class, ClassDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="classes"
      modalProps={{ title: 'Cadastro de Turmas', size: 'xl' }}
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
        label="Cidade"
        key={form.key('city')}
        {...form.getInputProps('city')}
        disabled={isPending || action === 'delete'}
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
        label="Localização"
        key={form.key('location')}
        {...form.getInputProps('location')}
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
