import { describe, it, expect } from 'vitest';
import { MODULE_REGISTRY } from '@/modules/registry';

describe('Module Registry', () => {
  it('should have correct number of parent modules', () => {
    expect(MODULE_REGISTRY.length).toBeGreaterThan(30);
  });

  it('should have E, S, and P modules', () => {
    const eCount = MODULE_REGISTRY.filter((m) => m.level === 'E').length;
    const sCount = MODULE_REGISTRY.filter((m) => m.level === 'S').length;
    const pCount = MODULE_REGISTRY.filter((m) => m.level === 'P').length;

    expect(eCount).toBeGreaterThan(10);
    expect(sCount).toBeGreaterThan(10);
    expect(pCount).toBeGreaterThan(5);
  });
});
