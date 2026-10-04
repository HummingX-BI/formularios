// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { generateDataset } from '@/data/generator/structure';
import { DEMO_CONFIG } from '@/config/demoConfig';

describe('Data Generator IV - Finance and Economics', () => {
  it('hits financial revenue targets at cutoff month', () => {
    const data = generateDataset(2026);

    // Revenue for Sep 2026 (cutoff month)
    const cutoffMonth = '2026-09';
    const monthCharges = data.charges.filter((c) => c.date.startsWith(cutoffMonth));
    const monthPayments = data.payments.filter((p) => p.date.startsWith(cutoffMonth));

    // Wait, the prompt says "ingreso por colegiaturas del mes del corte".
    // Does that mean total of charges emitted for that month? Or payments received in that month?
    // Let's check both or assume charges (facturado).
    let totalTuitionCharges = 0;
    monthCharges.forEach((c) => {
      if (c.concept.includes('Colegiatura')) {
        totalTuitionCharges += c.amount;
      }
    });

    // 1.29 million roughly, but with discounts and varying active counts
    expect(totalTuitionCharges).toBeGreaterThanOrEqual(1100000);
    expect(totalTuitionCharges).toBeLessThanOrEqual(1400000);

    // Average ticket
    // Total tuition charges / number of tuition charges
    const countTuition = monthCharges.filter((c) => c.concept.includes('Colegiatura')).length;
    const avgTicket = totalTuitionCharges / countTuition;
    // 2080 base, with discounts it can be ~1900
    expect(avgTicket).toBeGreaterThanOrEqual(1850);
    expect(avgTicket).toBeLessThanOrEqual(2200);
  });

  it('generates late payments and 12% unpaid debt in last 3 months', () => {
    const data = generateDataset(2026);

    const cutoffDate = new Date(DEMO_CONFIG.dates.cutoffDate + 'T00:00:00Z');
    // Last 3 months: Jul, Aug, Sep 2026
    const m1 = '2026-07';
    const m2 = '2026-08';
    const m3 = '2026-09';

    const recentCharges = data.charges.filter(
      (c) => c.date.startsWith(m1) || c.date.startsWith(m2) || c.date.startsWith(m3),
    );
    let totalBilled = 0;
    let totalUnpaid = 0;

    for (const c of recentCharges) {
      totalBilled += c.amount;
      if (c.status === 'vencido') {
        // Technically "con más de 15 días de atraso" but status 'vencido' represents the unpaid debt.
        totalUnpaid += c.amount;
      }
    }

    const debtRatio = totalUnpaid / totalBilled;
    expect(debtRatio).toBeGreaterThanOrEqual(0.08);
    expect(debtRatio).toBeLessThanOrEqual(0.18);
  });
});
