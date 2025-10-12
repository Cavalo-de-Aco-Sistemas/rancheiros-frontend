import {
  IconCertificate,
  IconCheck,
  IconClock,
  IconEyeOff,
  IconPhone,
  IconUserX,
  IconX,
} from '@tabler/icons-react';
import { Group, Text } from '@mantine/core';
import { EnrollmentStatus } from '@/model/enrollment';

interface StatusIconProps {
  status: EnrollmentStatus;
  showLabel?: boolean;
  iconSize?: number;
}

// Mapeamento de status para ícones e cores
const getStatusInfo = (status: EnrollmentStatus) => {
  switch (status) {
    case EnrollmentStatus.WAITING:
      return { icon: IconClock, color: 'blue', label: 'Aguardando' };
    case EnrollmentStatus.CALLED:
      return { icon: IconPhone, color: 'orange', label: 'Chamado' };
    case EnrollmentStatus.CONFIRMED:
      return { icon: IconCheck, color: 'green', label: 'Confirmado' };
    case EnrollmentStatus.DROPPED:
      return { icon: IconX, color: 'red', label: 'Desistiu' };
    case EnrollmentStatus.IGNORED:
      return { icon: IconEyeOff, color: 'gray', label: 'Ignorado' };
    case EnrollmentStatus.CERTIFIED:
      return { icon: IconCertificate, color: 'teal', label: 'Certificado' };
    case EnrollmentStatus.MISSED:
      return { icon: IconUserX, color: 'red', label: 'Faltou' };
    default:
      return { icon: IconClock, color: 'gray', label: status };
  }
};

export function StatusIcon({ status, showLabel = true, iconSize = 16 }: StatusIconProps) {
  const statusInfo = getStatusInfo(status);
  const IconComponent = statusInfo.icon;

  if (!showLabel) {
    return <IconComponent size={iconSize} color={`var(--mantine-color-${statusInfo.color}-6)`} />;
  }

  return (
    <Group gap="xs">
      <IconComponent size={iconSize} color={`var(--mantine-color-${statusInfo.color}-6)`} />
      <Text size="sm">{statusInfo.label}</Text>
    </Group>
  );
}
