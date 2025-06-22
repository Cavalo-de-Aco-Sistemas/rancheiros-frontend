export interface Class {
  id: string;
  name: string;
  city: string;
  date: string;
  location: string;
  active: boolean;
}

export interface ClassDto {
  name: string;
  city: string;
  date: Date | null;
  location: string;
  active: boolean;
}
