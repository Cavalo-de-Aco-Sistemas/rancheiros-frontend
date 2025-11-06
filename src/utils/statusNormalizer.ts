import { EnrollmentStatus } from '@/model/enrollment';

/**
 * Normaliza valores de status para garantir compatibilidade
 * Agora o frontend usa maiúsculo, então apenas valida se é um status válido
 */
export const normalizeStatus = (status: string): EnrollmentStatus => {
  const statusMap: Record<string, EnrollmentStatus> = {
    WAITING: EnrollmentStatus.WAITING,
    CALLED: EnrollmentStatus.CALLED,
    DROPPED: EnrollmentStatus.DROPPED,
    CONFIRMED: EnrollmentStatus.CONFIRMED,
    CERTIFIED: EnrollmentStatus.CERTIFIED,
    MISSED: EnrollmentStatus.MISSED,
    IGNORED: EnrollmentStatus.IGNORED,
    // Fallback para valores em minúsculo (legacy)
    waiting: EnrollmentStatus.WAITING,
    called: EnrollmentStatus.CALLED,
    dropped: EnrollmentStatus.DROPPED,
    confirmed: EnrollmentStatus.CONFIRMED,
    certified: EnrollmentStatus.CERTIFIED,
    missed: EnrollmentStatus.MISSED,
    ignored: EnrollmentStatus.IGNORED,
  };

  return statusMap[status] || EnrollmentStatus.WAITING;
};

/**
 * Normaliza um objeto de enrollment para garantir que o status seja correto
 */
export const normalizeEnrollment = (enrollment: any) => {
  if (enrollment && enrollment.status) {
    return {
      ...enrollment,
      status: normalizeStatus(enrollment.status),
    };
  }
  return enrollment;
};

/**
 * Normaliza uma lista de enrollments
 */
export const normalizeEnrollments = (enrollments: any[]) => {
  return enrollments?.map(normalizeEnrollment) || [];
};
