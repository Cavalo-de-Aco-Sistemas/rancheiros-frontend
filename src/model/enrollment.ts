import { Class } from './class';
import { Location } from './location';

export type { Class } from './class';

export enum EnrollmentStatus {
  // Em lista de espera (disponível para chamar para uma turma) [waiting]
  WAITING = 'WAITING',
  // Convidado para uma turma (entrou em contato com o aluno para uma turma específica) [called]
  CALLED = 'CALLED',
  // Desistiu da vaga na turma (não poderá participar do curso de forma justificada, informado anteriormente a data do curso) [dropped]
  DROPPED = 'DROPPED',
  // Confirmou convite para a turma [confirmed]
  CONFIRMED = 'CONFIRMED',
  // Participou do curso (aluno recebeu certificado no curso) [certified]
  CERTIFIED = 'CERTIFIED',
  // Faltou no curso (este aluno não participou e deve se inscrever novamente se quiser realizar o curso em outra turma) [missed]
  MISSED = 'MISSED',
  // Não deu resposta ao convite (este aluno deverá se inscrever novamente se quiser realizar o curso em outra turma) [ignored]
  IGNORED = 'IGNORED',
}

export interface Enrollment {
  id: string;
  name: string;
  phone: string;
  cnh: string;
  uf_cnh: string;
  preferred_city: Location | null;
  email: string | null;
  motorcycle_usage: string | null;
  brand: string | null;
  model: string | null;
  status: EnrollmentStatus;
  enrollment_date: string;
  class: Class | null;
}

export interface EnrollmentDto {
  name: string;
  phone: string;
  cnh: string;
  uf_cnh: string;
  preferred_city: string | null;
  email: string | null;
  motorcycle_usage: string | null;
  brand: string | null;
  model: string | null;
  status: EnrollmentStatus;
  class: string | null;
}
