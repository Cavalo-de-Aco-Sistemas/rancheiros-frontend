import { PropsWithChildren, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Button, Modal, ModalProps, Stack, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useCRUD } from '@/contexts/CRUDContext';
import useCRUDMutation from '@/mutations/useCRUDMutation';

export interface CRUDFormProps<T extends { id: number }, D> {
  baseValues: D;
  parseSelected: (selected: T) => D;
  form: UseFormReturnType<D, (values: D) => D>;
  endpoint: string;
  handleError?: (error: AxiosError) => string | undefined;
  modalProps: Omit<ModalProps, 'opened' | 'onClose' | 'children'>;
}

export default function CRUDForm<T extends { id: number }, D>(
  props: PropsWithChildren<CRUDFormProps<T, D>>
) {
  const { baseValues, parseSelected, form, endpoint, handleError, modalProps, children } = props;
  const { opened, close, selected, action, query } = useCRUD();
  const { refetch } = query;
  const [error, setError] = useState('');

  const [initialValues, setInitialValues] = useState<D>(baseValues);

  useEffect(() => {
    if (opened) {
      if (action === 'create') {
        setInitialValues(baseValues);
      } else if (selected) {
        setInitialValues({
          ...baseValues,
          ...parseSelected(selected as T),
        });
      } else {
        console.warn('Trying to edit without select entry!');
      }
    }
  }, [selected, action, opened, baseValues, parseSelected]);

  const { mutate, isPending } = useCRUDMutation({
    action,
    form,
    refetch,
    close,
    setError,
    endpoint,
    handleError,
  });

  useEffect(() => {
    form.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const onClose = () => {
    setError('');
    form.reset();
    close();
  };

  return (
    <Modal {...modalProps} opened={opened} onClose={onClose}>
      <form onSubmit={form.onSubmit((data) => mutate({ data, id: selected?.id }))}>
        <Stack>
          {children}
          {error && (
            <Text c="red.6" fz="sm" ta="center">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            disabled={isPending}
            color={action === 'delete' ? 'red.9' : action === 'update' ? 'cyan.9' : 'teal.9'}
          >
            {action === 'create' ? 'Cadastrar' : action === 'update' ? 'Atualizar' : 'Excluir'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
