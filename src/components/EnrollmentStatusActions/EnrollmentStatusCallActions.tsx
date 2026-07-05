import { useCallback, useMemo } from 'react';
import { IconArrowBack, IconCheck, IconEyeOff, IconPhone, IconX } from '@tabler/icons-react';
import { ActionIcon, Group, Select, Text, Tooltip } from '@mantine/core';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useClassAssignOptions } from '@/hooks/useClassAssignOptions';
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollmentStatusCallActionsProps {
  enrollment: Enrollment;
  onRevertClick?: () => void;
}

const CALL_STATUS_ACTIONS = [
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
];

export function EnrollmentStatusCallActions({
  enrollment,
  onRevertClick,
}: EnrollmentStatusCallActionsProps) {
  const updateFlowMutation = useEnrollmentFlowMutation();
  const assignClassMutation = useEnrollmentAssignClassMutation();
  const classesOptions = useClassAssignOptions();
  const { permissions } = useAuth();

  // Check if user has permission to update flow
  const canUpdateFlow = permissions?.flow?.update || false;

  const handleAssignClass = useCallback(
    (classId: string) => {
      assignClassMutation.mutate({
        enrollmentId: enrollment.id,
        classId,
        enrollmentName: enrollment.name,
      });
    },
    [assignClassMutation, enrollment.id, enrollment.name]
  );

  const handleReturnToCalled = useCallback(() => {
    updateFlowMutation.mutate({
      enrollmentId: enrollment.id,
      status: EnrollmentStatus.CALLED,
      enrollmentName: enrollment.name,
    });
  }, [updateFlowMutation, enrollment.id, enrollment.name]);

  const handleRevertStatus = useCallback(() => {
    if (onRevertClick) {
      onRevertClick();
    } else {
      handleReturnToCalled();
    }
  }, [onRevertClick, handleReturnToCalled]);

  const isActionEnabled = useCallback(
    (actionStatus: EnrollmentStatus) => {
      const currentStatus = enrollment.status;
      const hasClass = !!enrollment.class;

      // Só permite ações de fluxo se tiver turma atribuída
      if (!hasClass) {
        return false;
      }

      switch (actionStatus) {
        case EnrollmentStatus.CALLED:
          // Chamado somente pode ser ativado quando o status for waiting
          return currentStatus === EnrollmentStatus.WAITING;

        case EnrollmentStatus.CONFIRMED:
        case EnrollmentStatus.DROPPED:
        case EnrollmentStatus.IGNORED:
          // Confirmado, Cancelado e Ignorado somente pode ser ativado se o status atual for called
          return currentStatus === EnrollmentStatus.CALLED;

        default:
          return false;
      }
    },
    [enrollment.status, enrollment.class]
  );

  // Verifica se pode retornar para called
  const canReturnToCalled = useCallback(() => {
    const currentStatus = enrollment.status;
    return (
      currentStatus === EnrollmentStatus.IGNORED ||
      currentStatus === EnrollmentStatus.CONFIRMED ||
      currentStatus === EnrollmentStatus.DROPPED ||
      currentStatus === EnrollmentStatus.MISSED ||
      currentStatus === EnrollmentStatus.CERTIFIED
    );
    // Permitido voltar para CALLED (rechamada) conforme regras de negócio
  }, [enrollment.status]);

  // Memoize enabled actions to prevent unnecessary re-renders
  const enabledActions = useMemo(() => {
    return CALL_STATUS_ACTIONS.filter(({ status }) => isActionEnabled(status));
  }, [isActionEnabled]);

  const handleStatusUpdate = useCallback(
    (newStatus: EnrollmentStatus) => {
      updateFlowMutation.mutate({
        enrollmentId: enrollment.id,
        status: newStatus,
        enrollmentName: enrollment.name,
      });
    },
    [updateFlowMutation, enrollment.id, enrollment.name]
  );

  // Se não tem permissão de editar fluxo, não mostra nenhum botão
  if (!canUpdateFlow) {
    return <Text size="xs" c="dimmed">Sem permissão</Text>;
  }

  // Se não tem turma atribuída E está em waiting, mostra seleção de turma
  if (!enrollment.class && enrollment.status === EnrollmentStatus.WAITING) {
    return (
      <Select
        placeholder="Selecionar turma"
        data={classesOptions}
        value=""
        onChange={(value) => {
          if (value) {
            handleAssignClass(value);
          }
        }}
        disabled={assignClassMutation.isLoading}
        searchable
        nothingFoundMessage="Nenhuma turma encontrada"
        maxDropdownHeight={280}
        comboboxProps={{ withinPortal: true }}
        size="xs"
        w={230}
      />
    );
  }

  // Se pode retornar para called (IGNORED, CONFIRMED, DROPPED), mostra botão de retorno
  if (canReturnToCalled()) {
    return (
      <Group gap="xs">
        <Tooltip label="Voltar para chamado">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={handleReturnToCalled}
            loading={updateFlowMutation.isLoading}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
  }

  // Se não tem ações habilitadas, mostra botão de reverter
  if (enabledActions.length === 0) {
    return (
      <Group gap="xs">
        <Tooltip label="Voltar para chamado">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={handleRevertStatus}
            loading={updateFlowMutation.isLoading}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
  }

  return (
    <Group gap="xs">
      {enabledActions.map(({ status, label, icon: Icon, color }) => (
        <Tooltip key={status} label={label}>
          <ActionIcon
            variant="light"
            color={color}
            size="sm"
            onClick={() => handleStatusUpdate(status)}
            loading={updateFlowMutation.isLoading}
          >
            <Icon size={16} />
          </ActionIcon>
        </Tooltip>
      ))}
      {canReturnToCalled() && (
        <Tooltip label="Voltar para chamado">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={handleReturnToCalled}
            loading={updateFlowMutation.isLoading}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
