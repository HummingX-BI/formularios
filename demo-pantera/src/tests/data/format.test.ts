import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatDate, formatMonth, joinList } from '@/data/format';

describe('Format', () => {
  it('formats currency without cents', () => {
    const res = formatCurrency(1234.56).replace(/\u00A0/g, ' '); // normalize non-breaking spaces
    expect(res).toContain('1,235'); // rounding
  });

  it('formats percentage', () => {
    const res = formatPercentage(0.1234).replace(/\u00A0/g, ' ');
    expect(res).toContain('12.3');
  });

  it('formats date', () => {
    expect(formatDate('2026-09-30')).toContain('30 sep 2026');
  });

  it('formats month', () => {
    expect(formatMonth('2026-09')).toContain('sep 2026');
  });

  it('joins lists correctly', () => {
    expect(joinList(['A', 'B', 'C'])).toBe('A, B y C');
    expect(joinList(['A', 'B'])).toBe('A y B');
    expect(joinList(['A'])).toBe('A');
  });
});
