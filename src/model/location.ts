import { Ranch } from "./ranch";

export interface Location {
  id: string;
  name: string;
  ranch: Ranch; // ranch: Cambira
}

export interface LocationDto {
  name: string;
  ranch?: string | null; // ranch: Cambira
}
