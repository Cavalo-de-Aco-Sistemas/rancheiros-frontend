import { Location } from './location';

export interface Class {
  id: string;
  location: Location | null;
  date: string;
  mapsLink: string;
  active: boolean;
}

export interface ClassDto {
  location?: string | null;
  date: Date | null;
  mapsLink: string;
  active: boolean;
}

export interface ClassCreateDto {
  location?: string | null;
  date: string | null;
  mapsLink: string;
  active: boolean;
}
