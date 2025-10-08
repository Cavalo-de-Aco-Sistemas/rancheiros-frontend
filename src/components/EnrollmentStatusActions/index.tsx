import { useCallback, useMemo } from 'react';
import { ActionIcon, Group, Tooltip, Select } from '@mantine/core';
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
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';
import useCRUDQuery from '@/queries/useCRUDQuery';
import { Class } from '@/model/class';
import { dateBR } from '@/utils/dates';

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
  const updateFlowMutation = useEnrollmentFlowMutation();
  const assignClassMutation = useEnrollmentAssignClassMutation();
  const classesQuery = useCRUDQuery<Class>('classes');

  const classesOptions = useMemo(() => {
    return classesQuery.data?.map((classItem) => ({
      value: classItem.id,
      label: `${classItem.location?.name ?? 'Sem local'} - ${classItem.date ? dateBR(classItem.date) : 'Sem data'}`,
    })) ?? [];
  }, [classesQuery.data]);

  const handleAssignClass = useCallback((classId: string) => {
    assignClassMutation.mutate({
      enrollmentId: enrollment.id,
      classId,
    });
  }, [assignClassMutation, enrollment.id]);

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
      
      case EnrollmentStatus.CERTIFIED:
      case EnrollmentStatus.MISSED:
        // Certificado e Faltou somente pode ser ativado se o status atual for confirmed
        return currentStatus === EnrollmentStatus.CONFIRMED;
      
      default:
        return false;
    }
  }, [enrollment.status, enrollment.class]);

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

  // Se tem turma atribuída, mostra ações de fluxo
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
              loading={updateFlowMutation.isPending}
            >
              <Icon size={16} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
