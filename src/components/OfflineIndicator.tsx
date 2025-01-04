import { IconWifiOff } from '@tabler/icons-react';
import { ThemeIcon } from '@mantine/core';
import { useNetwork } from '@mantine/hooks';

/**
 * Displays an offline indicator if the device is offline.
 */
export default function OfflineIndicator() {
  const { online } = useNetwork();

  if (online) {
    return null;
  }

  return (
    <ThemeIcon variant="transparent" size="lg">
      <IconWifiOff size="md" />
    </ThemeIcon>
  );
}
