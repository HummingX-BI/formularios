import type { Family, Student, Charge, Payment } from '../types';
import type { RandomGenerator } from '../rng';
import { DEMO_CONFIG } from '../../config/demoConfig';

export function generateFinance(rng: RandomGenerator, families: Family[], students: Student[]) {
  const charges: Charge[] = [];
  const payments: Payment[] = [];

  // To evaluate active students easily, build a map familyId -> students
  const familyKids = new Map<string, Student[]>();
  for (const s of students) {
    if (!familyKids.has(s.familyId)) familyKids.set(s.familyId, []);
    familyKids.get(s.familyId)!.push(s);
  }

  const MONTHS: string[] = [];
  const tmpM = new Date(DEMO_CONFIG.dates.startDate + 'T12:00:00Z');
  for (let i = 0; i < 24; i++) {
    MONTHS.push(tmpM.toISOString().slice(0, 7));
    tmpM.setUTCMonth(tmpM.getUTCMonth() + 1);
  }

  let chargeIdSeq = 1;
  let paymentIdSeq = 1;

  for (const f of families) {
    const kids = familyKids.get(f.id) || [];
    if (kids.length === 0) continue;

    // Assign properties
    const pmRand = rng.float(0, 1);
    if (pmRand < 0.38) f.paymentMethod = 'efectivo';
    else if (pmRand < 0.68) f.paymentMethod = 'transferencia';
    else if (pmRand < 0.88) f.paymentMethod = 'tarjeta';
    else f.paymentMethod = 'en_linea';

    const isQuarterly = rng.bool(0.25);
    const has3Kids = kids.length >= 3;

    for (let mIdx = 0; mIdx < MONTHS.length; mIdx++) {
      const monthStr = MONTHS[mIdx]!;
      const monthDate = new Date(monthStr + '-01T12:00:00Z');
      const dueStr = monthStr + '-05';

      const activeKidsThisMonth = kids.filter((k) => {
        const enrM = k.enrollmentDate.slice(0, 7);
        let active = enrM <= monthStr;
        if (active && k.churnDate) {
          if (k.churnDate.slice(0, 7) < monthStr) active = false; // Churned before this month
        }
        return active;
      });

      if (activeKidsThisMonth.length === 0) continue;

      // Annual Enrollments
      for (const k of activeKidsThisMonth) {
        const enrM = k.enrollmentDate.slice(5, 7);
        if (monthStr.slice(5, 7) === enrM) {
          const chId = 'CH_' + chargeIdSeq++;
          charges.push({
            id: chId,
            familyId: f.id,
            date: dueStr,
            amount: DEMO_CONFIG.plans.annualEnrollmentFee,
            concept: `Inscripción Anual - ${k.name}`,
            status: 'pagado',
          });
          // Usually paid on time
          payments.push({
            id: 'PAY_' + paymentIdSeq++,
            chargeId: chId,
            familyId: f.id,
            date: dueStr,
            amount: DEMO_CONFIG.plans.annualEnrollmentFee,
          });
        }
      }

      // Monthly Tuition
      // Sibling discount (e.g., 10% if 2 kids, 15% if 3+)
      let discount = 0;
      if (kids.length === 2) discount = 0.1;
      if (kids.length >= 3) discount = 0.15;
      if (isQuarterly) discount += DEMO_CONFIG.plans.quarterlyDiscount;

      for (const k of activeKidsThisMonth) {
        let tuitionAmount = 0;
        if (k.plan === '1/semana') tuitionAmount = DEMO_CONFIG.plans.freq1.price;
        else if (k.plan === '2/semana') tuitionAmount = DEMO_CONFIG.plans.freq2.price;
        else tuitionAmount = DEMO_CONFIG.plans.freq3.price;

        tuitionAmount = Math.round(tuitionAmount * (1 - discount));

        const chId = 'CH_' + chargeIdSeq++;
        const chargeObj: Charge = {
          id: chId,
          familyId: f.id,
          date: dueStr,
          amount: tuitionAmount,
          concept: `Colegiatura ${monthStr} - ${k.name}`,
          status: 'pagado',
        };

        // Determine payment date
        let delayDays = Math.round(rng.logNormal(Math.log(2), 1.0)) - 2;
        if (f.paymentMethod === 'efectivo' && has3Kids && rng.bool(0.4)) {
          delayDays = rng.int(20, 30);
        }

        const isUncollectible = rng.bool(0.1); // Tweak to get 12% unpaid overall

        if (isUncollectible && monthStr >= '2026-07') {
          chargeObj.status = 'vencido';
        } else {
          chargeObj.status = 'pagado';

          const pDate = new Date(monthDate);
          pDate.setUTCDate(5 + delayDays);
          if (pDate.getTime() > new Date(DEMO_CONFIG.dates.cutoffDate + 'T23:59:59Z').getTime()) {
            chargeObj.status = 'vencido';
          } else {
            payments.push({
              id: 'PAY_' + paymentIdSeq++,
              chargeId: chId,
              familyId: f.id,
              date: pDate.toISOString().slice(0, 10),
              amount: tuitionAmount,
            });
          }
        }

        charges.push(chargeObj);

        // Late Fee
        if (delayDays > 10 && chargeObj.status !== 'vencido') {
          const lfId = 'CH_' + chargeIdSeq++;
          const lfCharge: Charge = {
            id: lfId,
            familyId: f.id,
            date: new Date(monthDate.getTime() + 15 * 86400000).toISOString().slice(0, 10), // Day 15
            amount: DEMO_CONFIG.plans.lateFee,
            concept: `Recargo pago tardío ${monthStr} - ${k.name}`,
            status: 'vencido',
          };

          if (rng.bool(0.6)) {
            lfCharge.status = 'pagado';
            payments.push({
              id: 'PAY_' + paymentIdSeq++,
              chargeId: lfId,
              familyId: f.id,
              date: new Date(monthDate.getTime() + (5 + delayDays) * 86400000)
                .toISOString()
                .slice(0, 10),
              amount: DEMO_CONFIG.plans.lateFee,
            });
          }
          charges.push(lfCharge);
        }
      }
    }
  }

  return { charges, payments };
}
