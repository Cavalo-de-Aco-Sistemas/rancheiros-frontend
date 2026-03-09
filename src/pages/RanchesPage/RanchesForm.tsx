import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_RANCH, DELETE_RANCH, UPDATE_RANCH } from '@/graphql/ranches';
import { Ranch, RanchDto } from '@/model/ranch';
import { ApolloError } from '@apollo/client';

const INITIAL_VALUES = { name: '' };

const parseSelected = (ranch: Ranch): RanchDto => ({
  name: ranch.name,
});

export function RanchesForm() {
  const { query, action } = useGraphQLCRUD();

  const form = useForm<RanchDto>({
    initialValues: INITIAL_VALUES,
  });

  const handleError = (error: ApolloError): string | undefined => {
    const message = error.message.toLowerCase();
    if (message.includes('conflict') || message.includes('unique') || message.includes('duplicate') || message.includes('already exists')) {
      return `Não é possível usar este nome pois já existe um rancho cadastrado com ele. Caso não consiga visualizá-lo, é possível que você não tenha permissão de acesso.`;
    }
    return undefined;
  };

  return (
    <GraphQLCRUDForm<Ranch, RanchDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_RANCH}
      updateMutation={UPDATE_RANCH}
      deleteMutation={DELETE_RANCH}
      handleError={handleError}
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
