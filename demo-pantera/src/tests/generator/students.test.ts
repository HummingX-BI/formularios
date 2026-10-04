import { describe, it, expect } from 'vitest';
import { generateStructure } from '@/data/generator/structure';
import { DEMO_CONFIG } from '@/config/demoConfig';

describe('Data Generator II - Students, Families and Waitlist', () => {
  it('generates exact student and family totals', () => {
    const data = generateStructure(101);

    expect(data.students.length).toBe(1100);
    expect(data.families.length).toBeGreaterThan(700);
    expect(data.families.length).toBeLessThan(780);

    let totalKids = 0;
    data.families.forEach((f) => {
      const kids = data.students.filter((s) => s.familyId === f.id);
      expect(kids.length).toBeGreaterThan(0);
      expect(kids.length).toBeLessThanOrEqual(3); // Based on our dist, wait, size could be more if they get grouped? No, we set max size 3 in the loop? Actually we just set `size=3`.
      totalKids += kids.length;
    });

    expect(totalKids).toBe(1100);
  });

  it('generates the waitlist correctly', () => {
    const data = generateStructure(101);

    expect(data.waitlist.length).toBeGreaterThanOrEqual(25);
    expect(data.waitlist.length).toBeLessThanOrEqual(45);

    for (const w of data.waitlist) {
      expect(w.studentId).toBeDefined();
      expect(w.requestedSchedule).toBeDefined();
      expect(w.priority).toBeDefined();
      expect(w.status).toBe('waiting');
      expect(new Date(w.dateAdded).getTime()).toBeLessThanOrEqual(
        new Date(DEMO_CONFIG.dates.cutoffDate + 'T00:00:00Z').getTime(),
      );
    }
  });

  it('matches plan distribution', () => {
    const data = generateStructure(101);

    let plan1 = 0,
      plan2 = 0,
      plan3 = 0;
    data.students.forEach((s) => {
      if (s.plan === '1/semana') plan1++;
      if (s.plan === '2/semana') plan2++;
      if (s.plan === '3/semana') plan3++;
    });

    const total = plan1 + plan2 + plan3;
    expect(total).toBe(1100);

    const p1Rate = plan1 / total;
    const p2Rate = plan2 / total;
    const p3Rate = plan3 / total;

    expect(p1Rate).toBeGreaterThan(0.15);
    expect(p1Rate).toBeLessThan(0.25);
    expect(p2Rate).toBeGreaterThan(0.55);
    expect(p2Rate).toBeLessThan(0.65);
    expect(p3Rate).toBeGreaterThan(0.15);
    expect(p3Rate).toBeLessThan(0.25);
  });
});
