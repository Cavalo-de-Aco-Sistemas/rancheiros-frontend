import { ReactNode } from 'react';
import { Affix, Stack } from '@mantine/core';

export default function AffixStack({ children }: { children: ReactNode }) {
  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Stack>{children}</Stack>
    </Affix>
  );
}
