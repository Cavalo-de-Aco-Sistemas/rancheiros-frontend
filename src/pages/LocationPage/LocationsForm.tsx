import { TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { useCRUD } from '@/contexts/CRUDContext';
import { Location, LocationDto } from '@/model/location';

const INITIAL_VALUES = { name: '' };

const parseSelected = (location: Location): LocationDto => location;

export function LocationsForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;

  const form = useForm<LocationDto>({
    initialValues: INITIAL_VALUES,
  });

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
    </CRUDForm>
  );
}
