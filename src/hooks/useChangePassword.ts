import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { CHANGE_PASSWORD } from '@/graphql/users';

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      notifications.show({
        title: 'Sucesso',
        message: 'Senha alterada com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro',
        message: error.message || 'Erro ao alterar senha',
        color: 'red',
      });
    },
  });

  const handleChangePassword = async (input: ChangePasswordInput) => {
    try {
      await changePassword({
        variables: { input },
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    changePassword: handleChangePassword,
    loading,
  };
}

