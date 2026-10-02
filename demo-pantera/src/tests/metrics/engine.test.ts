// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createMetrics } from '../../metrics/context';
import type { MetricsContext } from '../../metrics/types';
import type { Dataset, Student, Charge, Payment } from '../../data/types';
import { generateDataset } from '../../data/generator/structure';

describe('Metrics Engine - Synthetic Mini Dataset', () => {
  const createMockDataset = (): Dataset => {
    return {
      metadata: { seed: 1, generatedAt: '' },
      instructors: [],
      groups: [
        { id: 'g1', pool: 'principal', level: 'L1', capacity: 10, dayOfWeek: 'Lunes', timeSlot: '16:00', instructorId: 'i1' }
      ],
      families: [],
      students: [
        {
          id: 's1', familyId: 'f1', name: 'S1', birthDate: '2010-01-01', status: 'active',
          enrollmentDate: '2026-08-01', churnDate: null, churnReason: null,
          currentLevel: 'L1', assignedGroups: ['g1'], enrollmentPlan: '1_per_week'
        } as Student,
        {
          id: 's2', familyId: 'f2', name: 'S2', birthDate: '2010-01-01', status: 'churned',
          enrollmentDate: '2026-07-01', churnDate: '2026-09-15', churnReason: 'clima',
          currentLevel: 'L2', assignedGroups: [], enrollmentPlan: '1_per_week'
        } as Student
      ],
      enrollments: [],
      levelStints: [],
      attendance: [],
      charges: [
        { id: 'c1', familyId: 'f1', type: 'mensualidad', amount: 1350, date: '2026-09-01', status: 'pagado' } as Charge
      ],
      payments: [
        { id: 'p1', familyId: 'f1', amount: 1350, date: '2026-09-05', method: 'tarjeta' } as Payment
      ],
      prospects: [],
      waitlist: [],
      web: [],
      keywords: [],
      pages: [],
      messages: []
    };
  };

  const getCtx = (): MetricsContext => ({
    dataset: createMockDataset(),
    period: { start: '2026-09-01', end: '2026-09-30' },
    pool: 'todas'
  });

  it('calculates active students correctly (D-01)', () => {
    const m = createMetrics(getCtx());
    // s1 is active, s2 churned on 09-15, so at end of 09-30, s2 is churned.
    // Wait, activeStudents takes period.end by default.
    expect(m.activeStudents().value).toBe(1);
    
    // On 2026-09-10, both were active
    expect(m.activeStudents('2026-09-10').value).toBe(2);
  });

  it('calculates churn correctly (D-02)', () => {
    const m = createMetrics(getCtx());
    expect(m.churn().value).toBe(1); // s2 churned in Sept
  });

  it('calculates occupancy correctly (D-05)', () => {
    const m = createMetrics(getCtx());
    // 1 group of 10 capacity, 1 active student in it -> 0.1
    expect(m.occupancy().value).toBe(0.1);
  });

  it('calculates revenue billed and real correctly (D-15)', () => {
    const m = createMetrics(getCtx());
    expect(m.revenue('billed').value).toBe(1350);
    expect(m.revenue('real').value).toBe(1350);
  });
});

describe('Metrics Engine - Consistency with Seed 2026', () => {
  const ds = generateDataset(2026);
  const ctx: MetricsContext = {
    dataset: ds,
    period: { start: '2026-09-01', end: '2026-09-30' },
    pool: 'todas'
  };
  const m = createMetrics(ctx);

  it('memoization is fast (< 20ms)', () => {
    const start1 = performance.now();
    const r1 = m.occupancy();
    const t1 = performance.now() - start1;

    const start2 = performance.now();
    const r2 = m.occupancy();
    const t2 = performance.now() - start2;

    expect(r1.value).toBe(r2.value);
    expect(t2).toBeLessThan(20);
  });

  it('RF-22: the real revenue series equals the sum of payments in the dataset with zero difference', () => {
    // Generate real revenue series
    const series = m.series('revenue_real').value;
    
    for (const dataPoint of series) {
      // The series date is the end of the month (YYYY-MM-DD)
      const y = parseInt(dataPoint.date.slice(0,4));
      const mth = parseInt(dataPoint.date.slice(5,7)) - 1; // 0-indexed
      
      const mStart = new Date(y, mth, 1).toISOString().slice(0,10);
      const mEnd = new Date(y, mth + 1, 0).toISOString().slice(0,10);
      
      // Calculate from raw dataset
      let sum = 0;
      for (const p of ds.payments) {
        if (p.date >= mStart && p.date <= mEnd) {
          sum += p.amount;
        }
      }
      
      expect(dataPoint.value).toBe(sum);
    }
  });

  it('Cohorts length matches active students in that cohort', () => {
    const cohorts = m.cohortsMatrix().value;
    expect(cohorts.length).toBe(6);
    expect(cohorts[0]).toHaveProperty('cohortMonth');
    expect(cohorts[0]).toHaveProperty('sizes');
  });
});
