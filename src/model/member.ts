export interface Member {
  id: number;
  name: string;
  patch: string | null;
  blood: string | null;
  phase: string | null; // prospect, half-patch, full-patch
  birthday: string | null;
  phone: string | null;
  ranch: string | null; // ranch: Cambira
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
  phase?: string; // prospect, half-patch, full-patch
  birthday?: string;
  phone?: string;
  ranch?: string; // ranch: Cambira
  residence?: string; // residence: CAMBIRA-PR
  responsibility?: string; // diretor, sgt. armas, etc.
  dateProspect?: string;
  dateHalfPatch?: string;
  dateFullPatch?: string;
  spouse?: number; // spouse id if registered as member
  godfather?: number; // godfather ("padrinho") id if any
}
