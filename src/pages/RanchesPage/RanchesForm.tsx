import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_RANCH, DELETE_RANCH, UPDATE_RANCH } from '@/graphql/ranches';
import { Ranch, RanchDto } from '@/model/ranch';

const INITIAL_VALUES = { name: '' };

const parseSelected = (ranch: Ranch): RanchDto => ({
  name: ranch.name,
});

export function RanchesForm() {
  const { query, action } = useGraphQLCRUD();

  const form = useForm<RanchDto>({
    initialValues: INITIAL_VALUES,
  });

  return (
    <GraphQLCRUDForm<Ranch, RanchDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_RANCH}
      updateMutation={UPDATE_RANCH}
      deleteMutation={DELETE_RANCH}
      modalProps={{ title: 'Cadastro de Ranchos', size: 'xl' }}
      entityName="Rancho"
    >
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={query.isLoading || action === 'delete'}
        onChange={(event) => form.setFieldValue('name', event.currentTarget.value.toUpperCase())}
        value={form.values.name.toUpperCase()}
      />
    </GraphQLCRUDForm>
  );
}
