import { Ranch } from './ranch';

export interface Member {
  id: string;
  name: string;
  patch: string | null;
  blood: string | null;
  phase: string | null; // prospect, half-patch, full-patch
  birthday: string | null;
  phone: string | null;
  ranch: Ranch; // ranch: Cambira
  residence: string | null; // city: CAMBIRA-PR
  responsibility: string | null; // diretor, sgt. armas, etc.
  dateProspect: string | null;
  dateHalfPatch: string | null;
  dateFullPatch: string | null;
  spouse: Member | null; // spouse if registered as member
  godfather: Member | null; // godfather ("padrinho") if any
}

export interface MemberDto {
  name: string;
  ranch?: string | null; // ranch: Cambira
  patch?: string | null;
  blood?: string | null;
  phase?: string | null; // prospect, half-patch, full-patch
  birthday?: Date | null;
  phone?: string | null;
  residence?: string | null; // residence: CAMBIRA-PR
  responsibility?: string | null; // diretor, sgt. armas, etc.
  dateProspect?: Date | null;
  dateHalfPatch?: Date | null;
  dateFullPatch?: Date | null;
  spouse?: string | null; // spouse id if registered as member
  godfather?: string | null; // godfather ("padrinho") id if any
}
