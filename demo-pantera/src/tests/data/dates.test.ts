import { describe, it, expect } from 'vitest';
import { addDays, daysBetween, startOfMonth, endOfMonth, dayOfWeek, isHoliday } from '@/data/dates';

describe('Dates', () => {
  it('calculates days between', () => {
    expect(daysBetween('2026-09-01', '2026-09-30')).toBe(29);
  });

  it('adds days', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
  });

  it('leap year end of month', () => {
    expect(endOfMonth('2024-02-15')).toBe('2024-02-29');
    expect(endOfMonth('2025-02-15')).toBe('2025-02-28');
  });

  it('day of week (1=Mon, 7=Sun)', () => {
    // 2026-09-30 is Wednesday (3)
    expect(dayOfWeek('2026-09-30')).toBe(3);
  });

  it('calculates start and end of month', () => {
    expect(startOfMonth('2026-09-15')).toBe('2026-09-01');
    expect(endOfMonth('2026-09-15')).toBe('2026-09-30');
  });

  it('identifies holidays', () => {
    expect(isHoliday('2024-12-25')).toBe(true);
    expect(isHoliday('2026-09-30')).toBe(false);
  });
});
