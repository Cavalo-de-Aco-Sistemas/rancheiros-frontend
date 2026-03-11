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
import { useQuery } from '@apollo/client';
import { GraphQLCRUDForm } from '@/components/GraphQLCRUDForm';
import { PasswordStrength } from '@/components/PasswordStrength';
import { useAuth } from '@/contexts/AuthContext';
import { useGraphQLCRUD } from '@/contexts/GraphQLCRUDContext';
import { CREATE_USER, DELETE_USER, GET_USERS, UPDATE_USER } from '@/graphql/users';
import { GET_RANCHES } from '@/graphql/ranches';
import { Ranch } from '@/model/ranch';
import { User, UserDto, UserPermissions } from '@/model/user';

const INITIAL_VALUES = {
  username: '',
  name: '',
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
    name: user.name,
    password: '',
    repeatPassword: '',
    permissions: user.permissions,
    ranches: user.ranches?.map((ranch) => ranch.id) || [],
    super_admin: user.super_admin,
  };
};

interface PermissionRowProps {
  title: string;
  entity: keyof UserPermissions;
  form: UseFormReturnType<UserDto>;
}

function PermissionRow({ title, entity, form }: PermissionRowProps) {
  // Null safety check for permissions and initialize if needed
  const permissions = form.values.permissions;
  const entityPermission = permissions?.[entity];
  
  // Default values if permissions are null
  const createValue = entityPermission?.create ?? false;
  const readValue = entityPermission?.read ?? false;
  const updateValue = entityPermission?.update ?? false;
  const deleteValue = entityPermission?.delete ?? false;
  
  // Initialize permissions structure if null
  const handleChange = (field: 'create' | 'read' | 'update' | 'delete', value: boolean) => {
    const currentPermissions = form.values.permissions || {
      members: { create: false, read: false, update: false, delete: false },
      classes: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      enrollments: { create: false, read: false, update: false, delete: false },
      locations: { create: false, read: false, update: false, delete: false },
      ranches: { create: false, read: false, update: false, delete: false },
      flow: { create: false, read: false, update: false, delete: false },
    };
    
    const updatedPermissions = {
      ...currentPermissions,
      [entity]: {
        ...currentPermissions[entity],
        [field]: value,
      },
    };
    
    form.setFieldValue('permissions', updatedPermissions);
  };
  
  return (
    <Table.Tr>
      <Table.Td>{title}</Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.create`)}
          {...form.getInputProps(`permissions.${entity}.create`)}
          checked={createValue}
          onChange={(event) => {
            handleChange('create', event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.read`)}
          {...form.getInputProps(`permissions.${entity}.read`)}
          checked={readValue}
          onChange={(event) => {
            handleChange('read', event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.update`)}
          {...form.getInputProps(`permissions.${entity}.update`)}
          checked={updateValue}
          onChange={(event) => {
            handleChange('update', event.currentTarget.checked);
          }}
        />
      </Table.Td>
      <Table.Td>
        <Checkbox
          key={form.key(`permissions.${entity}.delete`)}
          {...form.getInputProps(`permissions.${entity}.delete`)}
          checked={deleteValue}
          onChange={(event) => {
            handleChange('delete', event.currentTarget.checked);
          }}
        />
      </Table.Td>
    </Table.Tr>
  );
}

function FlowPermissionRow({ form }: { form: UseFormReturnType<UserDto> }) {
  // Null safety check for permissions
  const permissions = form.values.permissions;
  const flowUpdate = permissions?.flow?.update ?? false;
  
  const handleChange = (value: boolean) => {
    const currentPermissions = form.values.permissions || {
      members: { create: false, read: false, update: false, delete: false },
      classes: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      enrollments: { create: false, read: false, update: false, delete: false },
      locations: { create: false, read: false, update: false, delete: false },
      ranches: { create: false, read: false, update: false, delete: false },
      flow: { create: false, read: false, update: false, delete: false },
    };
    
    const updatedPermissions = {
      ...currentPermissions,
      flow: {
        ...currentPermissions.flow,
        update: value,
      },
    };
    
    form.setFieldValue('permissions', updatedPermissions);
  };
  
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
          checked={flowUpdate}
          onChange={(event) => {
            handleChange(event.currentTarget.checked);
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
  const { query, action } = useGraphQLCRUD();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { super_admin: currentUserIsSuperAdmin } = useAuth();

  const { data: ranchesData } = useQuery(GET_RANCHES);

  const ranchesOptions = useMemo(() => {
    const ranches = ranchesData?.ranches || [];
    return ranches
      .filter((ranch: Ranch | null | undefined): ranch is Ranch => !!ranch && !!ranch.id)
      .map((ranch: Ranch) => ({
        label: ranch.name,
        value: ranch.id.toString(),
      }));
  }, [ranchesData]);

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

  const transformData = useCallback(
    (data: UserDto) => {
      // Helper function to recursively remove __typename
      const removeTypename = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (Array.isArray(obj)) {
          return obj.map(removeTypename);
        }
        if (typeof obj === 'object') {
          const { __typename, ...rest } = obj;
          return Object.entries(rest).reduce((acc, [key, value]) => {
            acc[key] = removeTypename(value);
            return acc;
          }, {} as any);
        }
        return obj;
      };

      // Remove repeatPassword (usado apenas para validação no frontend)
      const { repeatPassword, ...rest } = data;

      // Remove __typename from permissions recursively
      const cleanedData = removeTypename(rest);

      // Se for edição e não há senha, remove o campo password
      if (action === 'update' && !data.password) {
        const { password, ...dataWithoutPassword } = cleanedData;
        return dataWithoutPassword;
      }

      return cleanedData;
    },
    [action]
  );

  return (
    <GraphQLCRUDForm<User, UserDto>
      baseValues={INITIAL_VALUES}
      parseSelected={parseSelected}
      form={form}
      createMutation={CREATE_USER}
      updateMutation={UPDATE_USER}
      deleteMutation={DELETE_USER}
      refetchQueries={[{ query: GET_USERS }]}
      modalProps={{ title: 'Cadastro de Usuários', size: 'xl' }}
      entityName="Usuário"
      validate={validate}
      transformData={transformData}
    >
      <TextInput
        required
        label="Usuário"
        key={form.key('username')}
        {...form.getInputProps('username')}
        disabled={query.isLoading || action === 'delete'}
      />
      <TextInput
        required
        label="Nome"
        key={form.key('name')}
        {...form.getInputProps('name')}
        disabled={query.isLoading || action === 'delete'}
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
                disabled={query.isLoading || action === 'delete'}
                setPasswordStrength={setPasswordStrength}
              />
              <PasswordInput
                label="Repetir senha"
                key={form.key('repeatPassword')}
                {...form.getInputProps('repeatPassword')}
                disabled={query.isLoading || action === 'delete'}
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
    </GraphQLCRUDForm>
  );
}
