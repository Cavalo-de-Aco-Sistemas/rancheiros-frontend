import { ReactNode } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert, Text } from '@mantine/core';

export default function ErrorWrapper({
  error,
  children,
}: {
  error?: Error | null;
  children: ReactNode;
}) {
  if (!error) {
    return children;
  }
  return (
    <Alert variant="outline" color="red" title="Ocorreu um erro!" icon={<IconInfoCircle />}>
      {error.message}
      <Text mt={4} size="xs" c="dimmed">
        Tente novamente mais tarde.
      </Text>
    </Alert>
  );
}
