import { useState } from 'react';
import axios from 'axios';
import {
  Affix,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Logo } from '@/components/Logo';
import { LoginProps } from '@/contexts/AuthContext';
import { Credentials } from '@/model/models';
import useLoginMutation from '@/mutations/useLoginMutation';

export function LoginPage({ login }: { login: ({ token, username }: LoginProps) => void }) {
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate, loading } = useLoginMutation();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    } as Credentials,
  });

  const handleSubmit = (credentials: Credentials) => {
    mutate(credentials, {
      onSuccess: (response) => {
        const { access_token, username, name, permissions, ranches, super_admin } = response;
        login({ token: access_token, username, name, permissions, ranches, super_admin });
      },
      onError: (error) => {
        setErrorMessage(
          axios.isAxiosError(error) && error.status === 401
            ? 'Verifique seu usuário e chave de acesso.'
            : 'Verifique sua conexão com a internet.'
        );
      },
    });
  };

  return (
    <>
      <Flex justify="center" align="center" h="100vh" w="100vw">
        <Container size="xs" w="100%">
          <LoadingOverlay
            visible={loading}
            overlayProps={{ radius: 'xl' }}
            loaderProps={{ size: 'xl', type: 'dots' }}
          />
          <Logo />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack mt="2rem">
              <TextInput
                label="Usuário"
                key={form.key('username')}
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Chave de acesso"
                placeholder="Chave de acesso"
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <Text c="red" ta="center">
                {errorMessage}
              </Text>
              <Button
                fullWidth
                type="submit"
                variant="gradient"
                gradient={{ from: 'brand.9', to: '#61391A' }}
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Container>
      </Flex>
      <Affix position={{ bottom: 20, left: 20 }}>
        <Text size="xs" c="dimmed">
          CAVALO DE ACO SISTEMAS LTDA © 2025
        </Text>
        <Text size="xs" c="dimmed">
          51.480.917/0001-71
        </Text>
      </Affix>
    </>
  );
}
