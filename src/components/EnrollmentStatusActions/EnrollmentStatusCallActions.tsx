import { useCallback, useMemo } from 'react';
import { ActionIcon, Group, Tooltip, Select, Modal, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPhone,
  IconCheck,
  IconX,
  IconEyeOff,
  IconArrowBack,
} from '@tabler/icons-react';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';

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

export function EnrollmentStatusCallActions({ enrollment, onRevertClick }: EnrollmentStatusCallActionsProps) {
  const updateFlowMutation = useEnrollmentFlowMutation();
  const assignClassMutation = useEnrollmentAssignClassMutation();
  const classesQuery = useCRUDQuery<Class>('classes');
  const [, { open }] = useDisclosure(false);

  const classesOptions = useMemo(() => {
    if (!classesQuery.data) {
      return [];
    }
    
    // Handle both array and paginated data
    const classesData = Array.isArray(classesQuery.data) ? classesQuery.data : classesQuery.data.data || [];
    
    return classesData.map((classItem: Class) => ({
      value: classItem.id,
      label: `${classItem.location?.name ?? 'Sem local'} - ${classItem.date ? dateBR(classItem.date) : 'Sem data'}`,
    }));
  }, [classesQuery.data]);

  const handleAssignClass = useCallback((classId: string) => {
    assignClassMutation.mutate({
      enrollmentId: enrollment.id,
      classId: classId,
    });
  }, [assignClassMutation, enrollment.id]);

  const handleReturnToCalled = useCallback(() => {
    updateFlowMutation.mutate({
      enrollmentId: enrollment.id,
      status: EnrollmentStatus.CALLED,
    });
  }, [updateFlowMutation, enrollment.id]);

  const handleRevertStatus = useCallback(() => {
    if (onRevertClick) {
      onRevertClick();
    } else {
      handleReturnToCalled();
    }
  }, [onRevertClick, handleReturnToCalled]);

  const isActionEnabled = useCallback((actionStatus: EnrollmentStatus) => {
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
  }, [enrollment.status, enrollment.class]);

  // Verifica se pode retornar para called
  const canReturnToCalled = useCallback(() => {
    const currentStatus = enrollment.status;
    return currentStatus === EnrollmentStatus.IGNORED || 
           currentStatus === EnrollmentStatus.CONFIRMED ||
           currentStatus === EnrollmentStatus.DROPPED;
    // Permitido DROPPED voltar para CALLED conforme regras de negócio
  }, [enrollment.status]);

  // Memoize enabled actions to prevent unnecessary re-renders
  const enabledActions = useMemo(() => {
    return CALL_STATUS_ACTIONS.filter(({ status }) => isActionEnabled(status));
  }, [isActionEnabled]);

  const handleStatusUpdate = useCallback((newStatus: EnrollmentStatus) => {
    updateFlowMutation.mutate({
      enrollmentId: enrollment.id,
      status: newStatus,
    });
  }, [updateFlowMutation, enrollment.id]);

  // Se não tem turma atribuída, mostra seleção de turma
  if (!enrollment.class) {
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
        disabled={assignClassMutation.isPending}
        size="xs"
        w={200}
      />
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
            loading={updateFlowMutation.isPending}
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
            loading={updateFlowMutation.isPending}
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
            loading={updateFlowMutation.isPending}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
