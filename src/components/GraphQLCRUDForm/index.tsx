import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Button, Modal, ModalProps, Stack, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useMutation, DocumentNode, TypedDocumentNode, OperationVariables, ApolloError } from '@apollo/client';
import { GraphQLCRUDContext } from '@/contexts/GraphQLCRUDContext';

export interface GraphQLCRUDFormProps<T extends { id: string }, D, TData = any, TVariables extends OperationVariables = OperationVariables> {
  baseValues: D;
  parseSelected: (selected: T) => D;
  form: UseFormReturnType<D, (values: D) => D>;
  createMutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  updateMutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  deleteMutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
  refetchQueries?: any[];
  handleError?: (error: ApolloError) => string | undefined;
  modalProps: Omit<ModalProps, 'opened' | 'onClose' | 'children'>;
  validate?: (data: D) => string | undefined;
  transformData?: (data: D, isCreate?: boolean) => any;
}

export function GraphQLCRUDForm<T extends { id: string }, D>(
  props: PropsWithChildren<GraphQLCRUDFormProps<T, D>>
) {
  const {
    baseValues,
    parseSelected,
    form,
    createMutation,
    updateMutation,
    deleteMutation,
    refetchQueries,
    handleError,
    modalProps,
    children,
    validate,
    transformData,
  } = props;
  // Use GraphQL context
  const context = useContext(GraphQLCRUDContext);
  
  if (!context) {
    throw new Error('GraphQLCRUDForm must be used within a GraphQLCRUDProvider');
  }
  
  const { opened, close, selected, action, query } = context;
  const { refetch } = query;
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState<D>(baseValues);

  // Mutations
  const [create, { loading: creating }] = useMutation(createMutation, {
    onCompleted: async () => {
      form.reset();
      setError('');
      await refetch();
      close();
    },
    onError: (error) => {
      const errorMessage = handleError?.(error) ?? error.message;
      setError(errorMessage);
    },
    refetchQueries,
    awaitRefetchQueries: true,
  });

  const [update, { loading: updating }] = useMutation(updateMutation, {
    onCompleted: async () => {
      form.reset();
      setError('');
      await refetch();
      close();
    },
    onError: (error) => {
      const errorMessage = handleError?.(error) ?? error.message;
      setError(errorMessage);
    },
    refetchQueries,
    awaitRefetchQueries: true,
  });

  const [deleteFn, { loading: deleting }] = useMutation(deleteMutation, {
    onCompleted: async () => {
      form.reset();
      setError('');
      await refetch();
      close();
    },
    onError: (error) => {
      const errorMessage = handleError?.(error) ?? error.message;
      setError(errorMessage);
    },
    refetchQueries,
    awaitRefetchQueries: true,
  });

  const isPending = creating || updating || deleting;

  useEffect(() => {
    if (opened) {
      if (action === 'create') {
        setInitialValues(baseValues);
      } else if (selected) {
        setInitialValues({
          ...baseValues,
          ...parseSelected(selected as T),
        });
      }
    }
  }, [selected, action, opened, baseValues, parseSelected]);

  useEffect(() => {
    form.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const onClose = () => {
    setError('');
    form.reset();
    close();
  };

  const onSubmit = (data: D) => {
    const validationError = validate?.(data);
    if (validationError) {
      setError(validationError);
      return;
    }

    const isCreate = action === 'create';
    const transformedData = transformData ? transformData(data, isCreate) : data;

    if (action === 'create') {
      create({ variables: { input: transformedData } });
    } else if (action === 'update') {
      update({
        variables: {
          id: selected?.id,
          input: transformedData,
        },
      });
    } else if (action === 'delete') {
      deleteFn({ variables: { id: selected?.id } });
    }
  };

  return (
    <Modal {...modalProps} opened={opened} onClose={onClose}>
      <form onSubmit={form.onSubmit(onSubmit)}>
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

