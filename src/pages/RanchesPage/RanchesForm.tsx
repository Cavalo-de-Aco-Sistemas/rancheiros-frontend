import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Ranch, RanchDto } from '@/model/ranch';

const INITIAL_VALUES = { name: '' };

const parseSelected = (ranch: Ranch): RanchDto => ranch;

export function RanchesForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;

  const form = useForm<RanchDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <CRUDForm<Ranch, RanchDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="ranches"
      modalProps={{ title: 'Cadastro de Ranchos', size: 'xl' }}
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={isPending || action === 'delete'}
        onChange={(event) => form.setFieldValue('name', event.currentTarget.value.toUpperCase())}
        value={form.values.name.toUpperCase()}
      />
    </CRUDForm>
  );
}
