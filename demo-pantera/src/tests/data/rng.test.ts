import { describe, it, expect } from 'vitest';
import { createRng } from '@/data/rng';

describe('RNG', () => {
  it('same seed produces same sequence', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    expect(rng1.next()).toBeCloseTo(rng2.next(), 6);
    expect(rng1.next()).toBeCloseTo(rng2.next(), 6);
  });

  it('fork produces independent sequences', () => {
    const rng = createRng(42);
    const sub1 = rng.fork('A');
    const sub2 = rng.fork('B');
    expect(sub1.next()).not.toBe(sub2.next());
  });

  it('normal distribution has expected mean and variance', () => {
    const rng = createRng('test');
    let sum = 0;
    let sumSq = 0;
    const n = 100000;
    for (let i = 0; i < n; i++) {
      const v = rng.normal(10, 2);
      sum += v;
      sumSq += v * v;
    }
    const mean = sum / n;
    const varEst = sumSq / n - mean * mean;
    expect(mean).toBeCloseTo(10, 1);
    expect(varEst).toBeCloseTo(4, 1);
  });
});
