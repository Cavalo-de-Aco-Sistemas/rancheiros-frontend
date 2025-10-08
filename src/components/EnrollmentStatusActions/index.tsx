import { useCallback } from 'react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import {
  IconClock,
  IconPhone,
  IconCheck,
  IconX,
  IconEyeOff,
  IconCertificate,
  IconUserX,
} from '@tabler/icons-react';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentStatusMutation } from '@/mutations/useEnrollmentStatusMutation';

interface EnrollmentStatusActionsProps {
  enrollment: Enrollment;
}

const STATUS_ACTIONS = [
  {
    status: EnrollmentStatus.CALLED,
    label: 'Chamar',
    icon: IconPhone,
    color: 'orange',
  },
  {
    status: EnrollmentStatus.CONFIRMED,
    label: 'Confirmar',
    icon: IconCheck,
    color: 'green',
  },
  {
    status: EnrollmentStatus.DROPPED,
    label: 'Cancelado',
    icon: IconX,
    color: 'red',
  },
  {
    status: EnrollmentStatus.IGNORED,
    label: 'Ignorado',
    icon: IconEyeOff,
    color: 'gray',
  },
  {
    status: EnrollmentStatus.CERTIFIED,
    label: 'Certificado',
    icon: IconCertificate,
    color: 'teal',
  },
  {
    status: EnrollmentStatus.MISSED,
    label: 'Faltou',
    icon: IconUserX,
    color: 'red',
  },
];

export function EnrollmentStatusActions({ enrollment }: EnrollmentStatusActionsProps) {
  const updateStatusMutation = useEnrollmentStatusMutation();

  const isActionEnabled = useCallback((actionStatus: EnrollmentStatus) => {
    const currentStatus = enrollment.status;

    switch (actionStatus) {
      case EnrollmentStatus.CALLED:
        // Chamado somente pode ser ativado quando o status for waiting
        return currentStatus === EnrollmentStatus.WAITING;
      
      case EnrollmentStatus.CONFIRMED:
      case EnrollmentStatus.DROPPED:
      case EnrollmentStatus.IGNORED:
        // Confirmado, Cancelado e Ignorado somente pode ser ativado se o status atual for called
        return currentStatus === EnrollmentStatus.CALLED;
      
      case EnrollmentStatus.CERTIFIED:
      case EnrollmentStatus.MISSED:
        // Certificado e Faltou somente pode ser ativado se o status atual for confirmed
        return currentStatus === EnrollmentStatus.CONFIRMED;
      
      default:
        return false;
    }
  }, [enrollment.status]);

  const handleStatusUpdate = useCallback((newStatus: EnrollmentStatus) => {
    updateStatusMutation.mutate({
      enrollmentId: enrollment.id,
      status: newStatus,
    });
  }, [updateStatusMutation, enrollment.id]);

  return (
    <Group gap="xs">
      {STATUS_ACTIONS.map(({ status, label, icon: Icon, color }) => {
        const enabled = isActionEnabled(status);
        
        // Só renderiza se estiver habilitado
        if (!enabled) {
          return null;
        }
        
        return (
          <Tooltip key={status} label={label} position="top">
            <ActionIcon
              variant="filled"
              color={color}
              size="sm"
              onClick={() => handleStatusUpdate(status)}
              loading={updateStatusMutation.isPending}
            >
              <Icon size={16} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
