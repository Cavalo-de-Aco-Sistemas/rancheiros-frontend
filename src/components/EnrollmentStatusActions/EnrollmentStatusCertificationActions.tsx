import { useCallback, useMemo } from 'react';
import { IconArrowBack, IconCertificate, IconUserX } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Modal, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';

interface EnrollmentStatusCertificationActionsProps {
  enrollment: Enrollment;
  onRevertClick?: () => void;
}

const CERTIFICATION_STATUS_ACTIONS = [
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

export function EnrollmentStatusCertificationActions({
  enrollment,
  onRevertClick,
}: EnrollmentStatusCertificationActionsProps) {
  const updateFlowMutation = useEnrollmentFlowMutation();
  const [opened, { open, close }] = useDisclosure(false);

  const handleRevertStatus = useCallback(() => {
    if (onRevertClick) {
      onRevertClick();
    } else {
      open();
    }
  }, [onRevertClick, open]);

  const isActionEnabled = useCallback(
    (actionStatus: EnrollmentStatus) => {
      const currentStatus = enrollment.status;

      switch (actionStatus) {
        case EnrollmentStatus.CERTIFIED:
        case EnrollmentStatus.MISSED:
          // Certificado e Faltou somente pode ser ativado se o status atual for confirmed
          return currentStatus === EnrollmentStatus.CONFIRMED;

        default:
          return false;
      }
    },
    [enrollment.status]
  );

  // Memoize enabled actions to prevent unnecessary re-renders
  const enabledActions = useMemo(() => {
    return CERTIFICATION_STATUS_ACTIONS.filter(({ status }) => isActionEnabled(status));
  }, [isActionEnabled]);

  const handleStatusUpdate = useCallback(
    (newStatus: EnrollmentStatus) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: newStatus,
      });
    },
    [updateFlowMutation, enrollment.id]
  );

  const confirmRevertStatus = useCallback(() => {
    // Reverte para confirmed (estado anterior lógico)
    updateFlowMutation.mutate({
      enrollmentId: enrollment.id,
      status: EnrollmentStatus.CONFIRMED,
    });
    close();
  }, [updateFlowMutation, enrollment.id, close]);

  // Se não tem ações habilitadas, mostra botão de reverter
  if (enabledActions.length === 0) {
    return (
      <Group gap="xs">
        <Tooltip label="Voltar para confirmado">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={handleRevertStatus}
            loading={updateFlowMutation.isPending}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
  }

  return (
    <>
      <Group gap="xs">
        {enabledActions.map(({ status, label, icon: Icon, color }) => (
          <Tooltip key={status} label={label}>
            <ActionIcon
              variant="light"
              color={color}
              size="sm"
              onClick={() => handleStatusUpdate(status)}
              loading={updateFlowMutation.isPending}
            >
              <Icon size={16} />
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>

      <Modal opened={opened} onClose={close} title="Reverter Status">
        <Text mb="md">
          Tem certeza que deseja reverter o status de {enrollment.name} para "Confirmado"?
        </Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button color="blue" onClick={confirmRevertStatus} loading={updateFlowMutation.isPending}>
            Confirmar
          </Button>
        </Group>
      </Modal>
    </>
  );
}
