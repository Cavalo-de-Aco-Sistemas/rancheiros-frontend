import { describe, expect, it } from 'vitest';
import { DEFAULT_COLUMN_FILTER_FN } from '@/utils/columnFilterDefaults';

describe('columnFilterDefaults', () => {
  it('defaults status filter to equals', () => {
    expect(DEFAULT_COLUMN_FILTER_FN.status).toBe('equals');
  });
});
