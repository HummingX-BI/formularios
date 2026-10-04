import { describe, it, expect } from 'vitest';
import { MODULE_REGISTRY } from '@/modules/registry';

describe('Module Registry', () => {
  it('should have exactly 58 modules', () => {
    expect(MODULE_REGISTRY.length).toBe(58);
  });

  it('should have 19 [E], 27 [S], and 12 [P] modules', () => {
    const eCount = MODULE_REGISTRY.filter((m) => m.level === 'E').length;
    const sCount = MODULE_REGISTRY.filter((m) => m.level === 'S').length;
    const pCount = MODULE_REGISTRY.filter((m) => m.level === 'P').length;

    expect(eCount).toBe(19);
    expect(sCount).toBe(27);
    expect(pCount).toBe(12);
  });
});
