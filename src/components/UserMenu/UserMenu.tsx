import { useState } from 'react';
import {
  Avatar,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
  Modal,
  Button,
  PasswordInput,
  Stack as StackForm,
} from '@mantine/core';
import { IconUser, IconChevronRight, IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChangePassword } from '@/hooks/useChangePassword';
import { useForm } from '@mantine/form';
import { PasswordStrength } from '@/components/PasswordStrength';
import classes from './UserMenu.module.css';

function getInitials(name: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const { name, username, logout } = useAuth();
  const { changePassword, loading } = useChangePassword();
  const [changePasswordOpened, setChangePasswordOpened] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
    validate: {
      oldPassword: (value) => (!value ? 'Senha atual é obrigatória' : null),
      newPassword: (value) => {
        if (!value) return 'Nova senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        if (passwordStrength < 50) return 'Senha muito fraca';
        return null;
      },
      repeatPassword: (value, values) =>
        value !== values.newPassword ? 'Senhas não coincidem' : null,
    },
  });

  const handleChangePassword = form.onSubmit(async (values) => {
    const success = await changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (success) {
      form.reset();
      setChangePasswordOpened(false);
    }
  });

  const initials = getInitials(name);

  return (
    <>
      <Group gap="xs" wrap="nowrap" className={classes.userContainer}>
        <Menu shadow="md" width={280} position="top-end">
          <Menu.Target>
            <UnstyledButton className={classes.userButton}>
              <Group gap="sm">
                <Avatar size={40} radius="xl" color="yellow">
                  {initials}
                </Avatar>
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {name || 'Usuário'}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {username || ''}
                  </Text>
                </Stack>
                <IconChevronRight size={16} className={classes.chevron} />
              </Group>
            </UnstyledButton>
          </Menu.Target>

        <Menu.Dropdown>
          {/* Informações do usuário no topo */}
          <Menu.Label>
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                {name || 'Usuário'}
              </Text>
              <Text size="xs" c="dimmed">
                {username || ''}
              </Text>
            </Stack>
          </Menu.Label>

          <Divider />

          {/* Opções de menu */}
          <Menu.Item
            leftSection={<IconUser size={16} />}
            onClick={() => setChangePasswordOpened(true)}
          >
            Trocar Senha
          </Menu.Item>
        </Menu.Dropdown>
        </Menu>
        <UnstyledButton
          className={classes.logoutButton}
          onClick={logout}
          title="Sair"
        >
          <IconLogout size={20} className={classes.logoutIcon} stroke={1.5} />
        </UnstyledButton>
      </Group>

      <Modal
        opened={changePasswordOpened}
        onClose={() => {
          setChangePasswordOpened(false);
          form.reset();
        }}
        title="Trocar Senha"
        centered
      >
        <form onSubmit={handleChangePassword}>
          <StackForm gap="md">
            <PasswordInput
              label="Senha Atual"
              placeholder="Digite sua senha atual"
              required
              {...form.getInputProps('oldPassword')}
            />

            <PasswordStrength
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              required
              {...form.getInputProps('newPassword')}
              setPasswordStrength={setPasswordStrength}
            />

            <PasswordInput
              label="Repetir Nova Senha"
              placeholder="Digite novamente sua nova senha"
              required
              {...form.getInputProps('repeatPassword')}
            />

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setChangePasswordOpened(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} disabled={passwordStrength < 50}>
                Alterar Senha
              </Button>
            </Group>
          </StackForm>
        </form>
      </Modal>
    </>
  );
}

