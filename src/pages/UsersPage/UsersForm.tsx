import { useCallback, useState } from 'react';
import { Checkbox, PasswordInput, SimpleGrid, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import CRUDForm from '@/components/CRUDForm';
import { PasswordStrength } from '@/components/PasswordStrength';
import { useCRUD } from '@/contexts/CRUDContext';
import { User, UserDto } from '@/model/user';

const INITIAL_VALUES = { username: '', admin: false, password: '', repeatPassword: '' };

const parseSelected = (user: User): UserDto => {
  const { username, admin } = user;

  return {
    username,
    admin,
  };
};

export default function UsersForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<UserDto>({
    initialValues: INITIAL_VALUES,
  });

  const validate = useCallback(
    (data: UserDto) => {
      if ((data.password || data.repeatPassword) && data.password !== data.repeatPassword) {
        return 'As senhas não coincidem';
      }
      if (data.password && passwordStrength < 100) {
        return 'A senha deve ser forte';
      }
      if (action === 'create' && !data.password) {
        return 'A senha é obrigatória';
      }
      return undefined;
    },
    [passwordStrength, action]
  );

  return (
    <CRUDForm<User, UserDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      endpoint="users"
      modalProps={{ title: 'Cadastro de Usuários', size: 'xl' }}
      validate={validate}
    >
      <TextInput
        required
        label="Usuário"
        key={form.key('username')}
        {...form.getInputProps('username')}
        disabled={isPending || action === 'delete'}
      />
      <Checkbox
        label="Administrador"
        key={form.key('admin')}
        {...form.getInputProps('admin')}
        disabled={isPending || action === 'delete'}
        checked={form.values.admin}
      />
      <SimpleGrid cols={{ base: 1, xs: 2 }}>
        <PasswordStrength
          label="Senha"
          key={form.key('password')}
          {...form.getInputProps('password')}
          disabled={isPending || action === 'delete'}
          setPasswordStrength={setPasswordStrength}
        />
        <PasswordInput
          label="Repetir senha"
          key={form.key('repeatPassword')}
          {...form.getInputProps('repeatPassword')}
          disabled={isPending || action === 'delete'}
        />
      </SimpleGrid>
    </CRUDForm>
  );
}
