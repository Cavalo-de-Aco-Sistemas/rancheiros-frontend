import { describe, expect, it } from 'vitest';
import { Class } from '@/model/class';
import {
  buildGroupedClassFilterOptions,
  buildGroupedClassSelectOptions,
  sortClassesForAssignment,
  toIsoDateString,
} from '@/utils/classSelectOptions';

const referenceDate = new Date('2025-07-04T12:00:00');

function makeClass(id: string, date: string | null, locationName = 'Local'): Class {
  return {
    id,
    date: date ?? '',
    mapsLink: '',
    active: true,
    location: {
      id: `loc-${id}`,
      name: locationName,
      ranch: { id: 'ranch-1', name: 'Ranch' },
    },
  };
}

describe('sortClassesForAssignment', () => {
  it('orders future classes ascending, then past descending, then undated', () => {
    const classes = [
      makeClass('1', '2025-05-01', 'May'),
      makeClass('2', '2025-06-12', 'June'),
      makeClass('3', '2025-08-15', 'August'),
      makeClass('4', '2025-09-23', 'September'),
      makeClass('5', '', 'No date'),
    ];

    const sorted = sortClassesForAssignment(classes, referenceDate);

    expect(sorted.map((c) => c.id)).toEqual(['3', '4', '2', '1', '5']);
  });

  it('returns empty array for empty input', () => {
    expect(sortClassesForAssignment([])).toEqual([]);
  });
});

describe('buildGroupedClassSelectOptions', () => {
  it('builds grouped options with correct order and labels', () => {
    const classes = [
      makeClass('1', '2025-05-01', 'May'),
      makeClass('2', '2025-06-12', 'June'),
      makeClass('3', '2025-08-15', 'August'),
      makeClass('4', '2025-09-23', 'September'),
      makeClass('5', '', 'No date'),
    ];

    const groups = buildGroupedClassSelectOptions(classes, referenceDate);

    expect(groups).toHaveLength(3);
    expect(groups[0]).toMatchObject({ group: 'Próximas turmas' });
    expect(groups[1]).toMatchObject({ group: 'Turmas passadas' });
    expect(groups[2]).toMatchObject({ group: 'Sem data' });

    const upcoming = (groups[0] as { items: { value: string; label: string }[] }).items;
    const past = (groups[1] as { items: { value: string }[] }).items;
    const undated = (groups[2] as { items: { value: string }[] }).items;

    expect(upcoming.map((item) => item.value)).toEqual(['3', '4']);
    expect(past.map((item) => item.value)).toEqual(['2', '1']);
    expect(undated.map((item) => item.value)).toEqual(['5']);
    expect(upcoming[0].label).toBe('15/08/2025 · August');
  });

  it('omits empty groups', () => {
    const classes = [makeClass('1', '2025-08-15', 'August')];

    const groups = buildGroupedClassSelectOptions(classes, referenceDate);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ group: 'Próximas turmas' });
  });

  it('returns empty array for empty input', () => {
    expect(buildGroupedClassSelectOptions([])).toEqual([]);
  });
});

describe('toIsoDateString', () => {
  it('extracts YYYY-MM-DD from ISO and plain date strings', () => {
    expect(toIsoDateString('2025-08-15T00:00:00.000Z')).toBe('2025-08-15');
    expect(toIsoDateString('2025-08-15')).toBe('2025-08-15');
    expect(toIsoDateString('')).toBe(null);
    expect(toIsoDateString(null)).toBe(null);
  });
});

describe('buildGroupedClassFilterOptions', () => {
  it('builds grouped options with ISO date values and display labels', () => {
    const classes = [
      makeClass('1', '2025-05-01', 'May'),
      makeClass('2', '2025-06-12', 'June'),
      makeClass('3', '2025-08-15T00:00:00.000Z', 'August'),
      makeClass('4', '2025-09-23', 'September'),
      makeClass('5', '', 'No date'),
    ];

    const groups = buildGroupedClassFilterOptions(classes, referenceDate);

    expect(groups).toHaveLength(3);

    const upcoming = (groups[0] as { items: { value: string; label: string }[] }).items;
    const past = (groups[1] as { items: { value: string; label: string }[] }).items;
    const undated = (groups[2] as { items: { value: string; label: string }[] }).items;

    expect(upcoming.map((item) => item.value)).toEqual(['2025-08-15', '2025-09-23']);
    expect(past.map((item) => item.value)).toEqual(['2025-06-12', '2025-05-01']);
    expect(undated.map((item) => item.value)).toEqual(['No date']);
    expect(upcoming[0].label).toBe('15/08/2025 · August');
  });

  it('returns empty array for empty input', () => {
    expect(buildGroupedClassFilterOptions([])).toEqual([]);
  });

  it('dedupes options when multiple classes share the same date', () => {
    const classes = [
      makeClass('1', '2024-11-09', 'Londrina'),
      makeClass('2', '2024-11-09', 'Curitiba'),
    ];

    const groups = buildGroupedClassFilterOptions(classes, referenceDate);
    const past = (groups[0] as { items: { value: string; label: string }[] }).items;

    expect(past).toHaveLength(1);
    expect(past[0].value).toBe('2024-11-09');
    expect(past[0].label).toBe('09/11/2024 · Londrina, Curitiba');
  });
});
