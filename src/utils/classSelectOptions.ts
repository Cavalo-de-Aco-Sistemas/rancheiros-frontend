import { startOfDay } from 'date-fns';
import { Class } from '@/model/class';
import { dateBR, toDate } from '@/utils/dates';

export type ClassSelectOption = { value: string; label: string };

export type GroupedClassSelectData = Array<
  { group: string; items: ClassSelectOption[] } | ClassSelectOption
>;

const GROUP_UPCOMING = 'Próximas turmas';
const GROUP_PAST = 'Turmas passadas';
const GROUP_UNDATED = 'Sem data';

function compareByDateAsc(a: Class, b: Class): number {
  const dateA = toDate(a.date)?.getTime() ?? 0;
  const dateB = toDate(b.date)?.getTime() ?? 0;
  return dateA - dateB;
}

function compareByDateDesc(a: Class, b: Class): number {
  return compareByDateAsc(b, a);
}

function toClassSelectOption(classItem: Class): ClassSelectOption {
  return {
    value: classItem.id.toString(),
    label: buildClassSelectLabel(classItem),
  };
}

export function toIsoDateString(date: string | null): string | null {
  if (!date) {
    return null;
  }

  if (date.includes('T')) {
    return date.split('T')[0] ?? null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  return null;
}

function toClassFilterOption(classItem: Class): ClassSelectOption {
  const isoDate = toIsoDateString(classItem.date);
  const fallbackValue = classItem.location?.name ?? 'Sem local';

  return {
    value: isoDate ?? fallbackValue,
    label: buildClassSelectLabel(classItem),
  };
}

function dedupeFilterOptionsByValue(items: ClassSelectOption[]): ClassSelectOption[] {
  const byValue = new Map<string, ClassSelectOption[]>();

  for (const item of items) {
    const existing = byValue.get(item.value) ?? [];
    existing.push(item);
    byValue.set(item.value, existing);
  }

  return Array.from(byValue.entries()).map(([value, groupedItems]) => {
    if (groupedItems.length === 1) {
      return groupedItems[0];
    }

    const datePart = groupedItems[0].label.split(' · ')[0];
    const locations = [
      ...new Set(
        groupedItems.map((item) => {
          const parts = item.label.split(' · ');
          return parts.length > 1 ? parts.slice(1).join(' · ') : item.label;
        })
      ),
    ];

    return {
      value,
      label: `${datePart} · ${locations.join(', ')}`,
    };
  });
}

export function buildClassSelectLabel(classItem: Class): string {
  const dateLabel = classItem.date ? dateBR(classItem.date) : 'Sem data';
  const locationLabel = classItem.location?.name ?? 'Sem local';

  if (!classItem.date) {
    return `${locationLabel} · Sem data`;
  }

  return `${dateLabel} · ${locationLabel}`;
}

export function sortClassesForAssignment(
  classes: Class[],
  referenceDate: Date = new Date()
): Class[] {
  const today = startOfDay(referenceDate).getTime();

  const future: Class[] = [];
  const past: Class[] = [];
  const undated: Class[] = [];

  for (const classItem of classes) {
    const parsedDate = toDate(classItem.date);
    if (!parsedDate) {
      undated.push(classItem);
      continue;
    }

    if (parsedDate.getTime() >= today) {
      future.push(classItem);
    } else {
      past.push(classItem);
    }
  }

  future.sort(compareByDateAsc);
  past.sort(compareByDateDesc);

  return [...future, ...past, ...undated];
}

export function buildGroupedClassSelectOptions(
  classes: Class[],
  referenceDate: Date = new Date()
): GroupedClassSelectData {
  const today = startOfDay(referenceDate).getTime();

  const future: Class[] = [];
  const past: Class[] = [];
  const undated: Class[] = [];

  for (const classItem of classes) {
    const parsedDate = toDate(classItem.date);
    if (!parsedDate) {
      undated.push(classItem);
      continue;
    }

    if (parsedDate.getTime() >= today) {
      future.push(classItem);
    } else {
      past.push(classItem);
    }
  }

  future.sort(compareByDateAsc);
  past.sort(compareByDateDesc);

  const groups: GroupedClassSelectData = [];

  if (future.length > 0) {
    groups.push({
      group: GROUP_UPCOMING,
      items: future.map(toClassSelectOption),
    });
  }

  if (past.length > 0) {
    groups.push({
      group: GROUP_PAST,
      items: past.map(toClassSelectOption),
    });
  }

  if (undated.length > 0) {
    groups.push({
      group: GROUP_UNDATED,
      items: undated.map(toClassSelectOption),
    });
  }

  return groups;
}

export function buildGroupedClassFilterOptions(
  classes: Class[],
  referenceDate: Date = new Date()
): GroupedClassSelectData {
  const today = startOfDay(referenceDate).getTime();

  const future: Class[] = [];
  const past: Class[] = [];
  const undated: Class[] = [];

  for (const classItem of classes) {
    const parsedDate = toDate(classItem.date);
    if (!parsedDate) {
      undated.push(classItem);
      continue;
    }

    if (parsedDate.getTime() >= today) {
      future.push(classItem);
    } else {
      past.push(classItem);
    }
  }

  future.sort(compareByDateAsc);
  past.sort(compareByDateDesc);

  const groups: GroupedClassSelectData = [];

  if (future.length > 0) {
    groups.push({
      group: GROUP_UPCOMING,
      items: dedupeFilterOptionsByValue(future.map(toClassFilterOption)),
    });
  }

  if (past.length > 0) {
    groups.push({
      group: GROUP_PAST,
      items: dedupeFilterOptionsByValue(past.map(toClassFilterOption)),
    });
  }

  if (undated.length > 0) {
    groups.push({
      group: GROUP_UNDATED,
      items: dedupeFilterOptionsByValue(undated.map(toClassFilterOption)),
    });
  }

  return groups;
}

export const CLASS_FILTER_SELECT_PROPS = {
  searchable: true,
  clearable: true,
  nothingFoundMessage: 'Nenhuma turma encontrada',
  w: 260,
  comboboxProps: { width: 260, withinPortal: true },
  styles: { option: { whiteSpace: 'nowrap' } },
} as const;
