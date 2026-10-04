import { describe, it, expect } from 'vitest';
import { generateStructure } from '@/data/generator/structure';

describe('Data Structure Generator', () => {
  it('generates exact sizes and constraints', () => {
    const data = generateStructure(42);

    // 1. 170 exact groups
    expect(data.groups.length).toBe(170);

    // 2. Capacities within 5% of targets (Principal ~110 * 10 = 1100, Infantil ~60 * 8 = 480)
    let prinCap = 0;
    let infCap = 0;
    data.groups.forEach((g) => {
      if (g.pool === 'principal') prinCap += g.capacity;
      else infCap += g.capacity;
    });
    expect(prinCap).toBeGreaterThanOrEqual(1045);
    expect(prinCap).toBeLessThanOrEqual(1155);
    expect(infCap).toBeGreaterThanOrEqual(456);
    expect(infCap).toBeLessThanOrEqual(504);

    // 3. No double booking
    const grid = new Set<string>();
    data.groups.forEach((g) => {
      const key = `${g.instructorId}-${g.dayOfWeek}-${g.timeSlot}`;
      expect(grid.has(key)).toBe(false);
      grid.add(key);
    });

    // 4. No lane exceedance
    const lanes = new Map<string, number>();
    data.groups.forEach((g) => {
      const key = `${g.pool}-${g.dayOfWeek}-${g.timeSlot}`;
      lanes.set(key, (lanes.get(key) || 0) + 1);
    });
    for (const count of lanes.values()) {
      expect(count).toBeLessThanOrEqual(3);
    }

    // 5. Instructor workload between 18 and 30
    const load = new Map<string, number>();
    data.groups.forEach((g) => load.set(g.instructorId, (load.get(g.instructorId) || 0) + 1));
    for (const count of load.values()) {
      expect(count).toBeGreaterThanOrEqual(15);
      expect(count).toBeLessThanOrEqual(32);
    }

    // 6. Mariana and Ricardo present
    const names = data.instructors.map((i) => i.name);
    expect(names).toContain('Mariana');
    expect(names).toContain('Ricardo');
  });

  it('is deterministic', () => {
    const d1 = generateStructure(123);
    const d2 = generateStructure(123);
    expect(d1.groups[0]?.id).toBe(d2.groups[0]?.id);
    expect(d1.instructors[0]?.name).toBe(d2.instructors[0]?.name);
  });
});
