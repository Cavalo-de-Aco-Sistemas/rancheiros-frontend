import { useCallback, useMemo, useState } from 'react';
import { IconKey, IconLock } from '@tabler/icons-react';
import {
  Accordion,
  Checkbox,
  MultiSelect,
  PasswordInput,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { CRUDForm } from '@/components/CRUDForm';
import { PasswordStrength } from '@/components/PasswordStrength';
import { useAuth } from '@/contexts/AuthContext';
import { useCRUD } from '@/contexts/CRUDContext';
import { Ranch } from '@/model/ranch';
import { User, UserDto, UserPermissions } from '@/model/user';
import useCRUDQuery from '@/queries/useCRUDQuery';

const INITIAL_VALUES = {
  username: '',
  password: '',
  repeatPassword: '',
  permissions: {
    members: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    classes: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    users: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    enrollments: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    locations: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    ranches: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    flow: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  },
  ranches: [],
  super_admin: false,
};

const parseSelected = (user: User): UserDto => {
  return {
    username: user.username,
    password: '',
    repeatPassword: '',
    permissions: user.permissions,
    ranches: user.ranches.map((ranch) => ranch.id),
    super_admin: user.super_admin,
  };
};

interface PermissionRowProps {
  title: string;
  entity: keyof UserPermissions;
  form: UseFormReturnType<UserDto>;
}

function PermissionRow({ title, entity, form }: PermissionRowProps) {
  return (
    <Table.Tr>
      <Table.Td>{title}</Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.create`)}
          {...form.getInputProps(`permissions.${entity}.create`)}
          checked={form.values.permissions[entity].create}
          onChange={(event) => {
            form.setFieldValue(`permissions.${entity}.create`, event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.read`)}
          {...form.getInputProps(`permissions.${entity}.read`)}
          checked={form.values.permissions[entity].read}
          onChange={(event) => {
            form.setFieldValue(`permissions.${entity}.read`, event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.update`)}
          {...form.getInputProps(`permissions.${entity}.update`)}
          checked={form.values.permissions[entity].update}
          onChange={(event) => {
            form.setFieldValue(`permissions.${entity}.update`, event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.delete`)}
          {...form.getInputProps(`permissions.${entity}.delete`)}
          checked={form.values.permissions[entity].delete}
          onChange={(event) => {
            form.setFieldValue(`permissions.${entity}.delete`, event.currentTarget.checked);
          }}
        />
      </Table.Td>
    </Table.Tr>
  );
}

function FlowPermissionRow({ form }: { form: UseFormReturnType<UserDto> }) {
  return (
    <Table.Tr>
      <Table.Td>Fluxo de Inscrições</Table.Td>
      <Table.Td>
        <Checkbox disabled checked={false} />
      </Table.Td>
      <Table.Td>
        <Checkbox disabled checked={false} />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key('permissions.flow.update')}
          {...form.getInputProps('permissions.flow.update')}
          checked={form.values.permissions.flow.update}
          onChange={(event) => {
            form.setFieldValue('permissions.flow.update', event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox disabled checked={false} />
      </Table.Td>
    </Table.Tr>
  );
}

export function UsersForm() {
  const { query, action } = useCRUD();
  const { isPending } = query;
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { super_admin: currentUserIsSuperAdmin } = useAuth();
  

  const ranchesQuery = useCRUDQuery<Ranch>('ranches');

  const ranchesOptions = useMemo(
    () => ranchesQuery.data?.map((ranch) => ({ label: ranch.name, value: ranch.id.toString() })),
    [ranchesQuery.data]
  );

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
      <Accordion defaultValue="senha">
        <Accordion.Item value="senha">
          <Accordion.Control icon={<IconKey />}>Senha</Accordion.Control>
          <Accordion.Panel>
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
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="permissoes">
          <Accordion.Control icon={<IconLock />}>Permissões</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {currentUserIsSuperAdmin === true && (
                <Checkbox
                  label="Super Administrador"
                  description="Usuário com acesso a todos os ranchos"
                  key={form.key('super_admin')}
                  {...form.getInputProps('super_admin')}
                  checked={form.values.super_admin}
                  onChange={(event) => {
                    form.setFieldValue('super_admin', event.currentTarget.checked);
                  }}
                />
              )}
              <MultiSelect
                label="Ranchos"
                key={form.key('ranches')}
                {...form.getInputProps('ranches')}
                data={ranchesOptions}
                searchable
                clearable
                hidePickedOptions
                nothingFoundMessage="Nenhum rancho encontrado"
                placeholder="Selecione os ranchos"
              />
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Permissões</Table.Th>
                    <Table.Th>Inserir</Table.Th>
                    <Table.Th>Visualizar</Table.Th>
                    <Table.Th>Editar</Table.Th>
                    <Table.Th>Excluir</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <PermissionRow title="Membros" entity="members" form={form} />
                  <PermissionRow title="Turmas" entity="classes" form={form} />
                  <PermissionRow title="Usuários" entity="users" form={form} />
                  <PermissionRow title="Inscrições" entity="enrollments" form={form} />
                  <PermissionRow title="Locais MPV" entity="locations" form={form} />
                  <PermissionRow title="Ranchos" entity="ranches" form={form} />
                  <FlowPermissionRow form={form} />
                </Table.Tbody>
              </Table>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </CRUDForm>
  );
}
