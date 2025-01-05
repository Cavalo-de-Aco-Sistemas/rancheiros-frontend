export interface Member {
  id: number;
  name: string;
  phase: string | null; // prospect, half-patch, full-patch
  birthday: Date | null;
  phone: string | null;
  ranch: string | null; // ranch: Cambira
  city: string | null; // city: Jandaia do Sul
  state: string | null; // state: PR
  responsibility: string | null; // diretor, sgt. armas, etc.
  dateProspect: Date | null;
  dateHalfPatch: Date | null;
  dateFullPatch: Date | null;
  spouse: Member | null; // spouse if registered as member
  godfather: Member | null; // godfather ("padrinho") if any
}
