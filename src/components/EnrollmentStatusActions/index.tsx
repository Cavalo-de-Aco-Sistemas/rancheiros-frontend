import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  IconArrowBack,
  IconCertificate,
  IconCheck,
  IconEyeOff,
  IconPhone,
  IconUserX,
  IconX,
} from '@tabler/icons-react';
import { ActionIcon, Button, Group, Modal, Select, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { GET_CLASSES } from '@/graphql/classes';
import { Class } from '@/model/class';
import { Enrollment, EnrollmentStatus } from '@/model/enrollment';
import { useEnrollmentAssignClassMutation } from '@/mutations/useEnrollmentAssignClassMutation';
import { useEnrollmentFlowMutation } from '@/mutations/useEnrollmentFlowMutation';
import { extractData } from '@/utils/dataUtils';
import { dateBR } from '@/utils/dates';

interface EnrollmentStatusActionsProps {
  enrollment: Enrollment;
  onRevertClick?: () => void;
  disabledActions?: EnrollmentStatus[];
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

export function EnrollmentStatusActions({
  enrollment,
  onRevertClick: _onRevertClick,
  disabledActions: _disabledActions = [],
}: EnrollmentStatusActionsProps) {
  const updateFlowMutation = useEnrollmentFlowMutation();
  const assignClassMutation = useEnrollmentAssignClassMutation();
  const { data: classesData } = useQuery(GET_CLASSES);
  const classesQuery = { data: classesData?.classes };
  const [, { open }] = useDisclosure(false);

  const classesOptions = useMemo(() => {
    const classes = extractData(classesQuery.data) as unknown as Class[];

    return classes.map((classItem) => ({
      value: classItem.id,
      label: `${classItem.location?.name ?? 'Sem local'} - ${classItem.date ? dateBR(classItem.date) : 'Sem data'}`,
    }));
  }, [classesQuery.data]);

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

  const canRevertStatus = useCallback(() => {
    const currentStatus = enrollment.status;
    // Só pode reverter se estiver em certified ou missed
    return (
      currentStatus === EnrollmentStatus.CERTIFIED || currentStatus === EnrollmentStatus.MISSED
    );
  }, [enrollment.status]);

  const handleRevertStatus = useCallback(() => {
    if (_onRevertClick) {
      _onRevertClick();
    } else {
      open();
    }
  }, [_onRevertClick, open]);

  const isActionEnabled = useCallback(
    (actionStatus: EnrollmentStatus) => {
      const currentStatus = enrollment.status;
      const hasClass = !!enrollment.class;

      // Verifica se a ação está desabilitada
      if (_disabledActions.includes(actionStatus)) {
        return false;
      }

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
    },
    [enrollment.status, enrollment.class, _disabledActions]
  );

  // Memoize enabled actions to prevent unnecessary re-renders
  const enabledActions = useMemo(() => {
    return STATUS_ACTIONS.filter(({ status }) => isActionEnabled(status));
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
        disabled={assignClassMutation.isLoading}
        size="xs"
        w={200}
      />
    );
  }

  // Se tem turma atribuída, mostra ações de fluxo
  return (
    <Group gap="xs">
      {enabledActions.map(({ status, label, icon: Icon, color }) => (
        <Tooltip key={status} label={label} position="top">
          <ActionIcon
            variant="filled"
            color={color}
            size="sm"
            onClick={() => handleStatusUpdate(status)}
            loading={updateFlowMutation.isLoading}
          >
            <Icon size={16} />
          </ActionIcon>
        </Tooltip>
      ))}

      {/* Botão para reverter status de certified/missed */}
      {canRevertStatus() && (
        <Tooltip label="Reverter Status" position="top">
          <ActionIcon
            variant="filled"
            color="orange"
            size="sm"
            onClick={handleRevertStatus}
            loading={updateFlowMutation.isLoading}
          >
            <IconArrowBack size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}

export default function EnrollmentStatusActionsWithModal({
  enrollment,
  onRevertClick,
  disabledActions = [],
}: EnrollmentStatusActionsProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const updateFlowMutation = useEnrollmentFlowMutation();

  const confirmRevertStatus = useCallback(() => {
    // Reverte para confirmed (estado anterior lógico)
    updateFlowMutation.mutate({
      enrollmentId: enrollment.id,
      status: EnrollmentStatus.CONFIRMED,
      enrollmentName: enrollment.name,
    });
    close();
  }, [updateFlowMutation, enrollment.id, enrollment.name, close]);

  const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.CERTIFIED:
        return 'Certificado';
      case EnrollmentStatus.MISSED:
        return 'Faltou';
      default:
        return status;
    }
  };

  return (
    <>
      <EnrollmentStatusActions enrollment={enrollment} onRevertClick={open} />

      <Modal opened={opened} onClose={close} title="Confirmar Reversão de Status" centered>
        <Text mb="md">
          Tem certeza que deseja reverter o status de <strong>{enrollment.name}</strong> de
          <strong> {getStatusLabel(enrollment.status)}</strong> para <strong>Confirmado</strong>?
        </Text>

        <Text size="sm" c="dimmed" mb="lg">
          Esta ação permitirá que o aluno volte ao fluxo normal de confirmação.
        </Text>

        <Group justify="flex-end">
          <Button variant="outline" onClick={close}>
            Cancelar
          </Button>
          <Button
            color="orange"
            onClick={confirmRevertStatus}
            loading={updateFlowMutation.isLoading}
          >
            Confirmar Reversão
          </Button>
        </Group>
      </Modal>
    </>
  );
}
