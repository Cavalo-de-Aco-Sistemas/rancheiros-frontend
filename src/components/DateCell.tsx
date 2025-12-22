import { Text } from '@mantine/core';
import { birthdayBR, dateBR } from '@/utils/dates';

type DateCellProps = {
  value: string | Date | null | undefined;
  variant?: 'date' | 'birthday';
  placeholder?: string;
};

// Desired display timezone: GMT-3
const TZ_OFFSET_MINUTES = 180;

// Normalize Date objects to ISO date strings applying fixed offset (GMT-3)
const normalizeDateValue = (value: string | Date | null | undefined): string | null => {
  if (!value) return null;
  if (value instanceof Date) {
    const shifted = new Date(value.getTime() - TZ_OFFSET_MINUTES * 60 * 1000);
    const y = shifted.getUTCFullYear();
    const m = String(shifted.getUTCMonth() + 1).padStart(2, '0');
    const d = String(shifted.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`; // no time component
  }
  return value;
};

/**
 * Display-only date cell for tables, keeping formatting consistent.
 * - variant "birthday": shows DD/MM (no year)
 * - variant "date" (default): shows DD/MM/YYYY
 */
export function DateCell({ value, variant = 'date', placeholder = '' }: DateCellProps) {
  const normalized = normalizeDateValue(value);
  const formatted = variant === 'birthday' ? birthdayBR(normalized) : dateBR(normalized);

  return <Text size="sm">{formatted ?? placeholder}</Text>;
}



