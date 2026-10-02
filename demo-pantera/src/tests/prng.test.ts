import { describe, it, expect } from 'vitest';
import {
  createPRNG,
  randInt,
  randFloat,
  randPick,
  randBool,
  randNormal,
  shuffle,
  randExponential,
} from '@/data/generator/prng';

describe('PRNG (Mulberry32)', () => {
  it('is deterministic: same seed → same sequence', () => {
    const rng1 = createPRNG(42);
    const rng2 = createPRNG(42);

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it('produces values in [0, 1)', () => {
    const rng = createPRNG(123);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds produce different sequences', () => {
    const rng1 = createPRNG(1);
    const rng2 = createPRNG(2);

    const v1 = rng1();
    const v2 = rng2();

    expect(v1).not.toBe(v2);
  });

  it('produces known reference values for seed=42', () => {
    const rng = createPRNG(42);
    // These are the exact values the Mulberry32 algorithm produces for seed=42
    const first = rng();
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(1);
    // Snapshot the first 3 values for regression testing
    const rng2 = createPRNG(42);
    const snapshot = [rng2(), rng2(), rng2()];
    expect(snapshot).toMatchSnapshot();
  });
});

describe('randInt', () => {
  it('returns integers in [min, max] inclusive', () => {
    const rng = createPRNG(99);
    const results = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = randInt(rng, 1, 5);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
      expect(Number.isInteger(v)).toBe(true);
      results.add(v);
    }
    // With 500 tries, all values 1–5 should appear
    expect(results.size).toBe(5);
  });
});

describe('randFloat', () => {
  it('returns floats in [min, max)', () => {
    const rng = createPRNG(77);
    for (let i = 0; i < 200; i++) {
      const v = randFloat(rng, 10, 20);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThan(20);
    }
  });
});

describe('randPick', () => {
  it('picks only elements from the given array', () => {
    const rng = createPRNG(55);
    const arr = ['a', 'b', 'c'] as const;
    for (let i = 0; i < 100; i++) {
      const v = randPick(rng, arr);
      expect(arr).toContain(v);
    }
  });
});

describe('randBool', () => {
  it('returns booleans with approximate probability', () => {
    const rng = createPRNG(33);
    let trueCount = 0;
    const n = 10000;
    for (let i = 0; i < n; i++) {
      if (randBool(rng, 0.3)) trueCount++;
    }
    const ratio = trueCount / n;
    // Should be approximately 0.3, within ±0.05
    expect(ratio).toBeGreaterThan(0.25);
    expect(ratio).toBeLessThan(0.35);
  });
});

describe('randNormal (Box-Muller)', () => {
  it('produces values with approximately correct mean and stddev', () => {
    const rng = createPRNG(7);
    const n = 5000;
    const values: number[] = [];
    for (let i = 0; i < n; i++) {
      values.push(randNormal(rng, 100, 15));
    }
    // mean ≈ 100 (formula: sum(xi) / n)
    const mean = values.reduce((a, b) => a + b, 0) / n;
    expect(mean).toBeCloseTo(100, 0);

    // stddev ≈ 15 (formula: sqrt(sum((xi - mean)^2) / n))
    const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
    const stddev = Math.sqrt(variance);
    expect(stddev).toBeCloseTo(15, 0);
  });
});

describe('shuffle', () => {
  it('preserves all elements', () => {
    const rng = createPRNG(11);
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(rng, [...arr]);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('is deterministic with same seed', () => {
    const arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
    const arr2 = [...arr1];
    const shuffled1 = shuffle(createPRNG(42), arr1);
    const shuffled2 = shuffle(createPRNG(42), arr2);
    expect(shuffled1).toEqual(shuffled2);
  });
});

describe('randExponential', () => {
  it('produces positive values', () => {
    const rng = createPRNG(88);
    for (let i = 0; i < 200; i++) {
      const v = randExponential(rng, 1);
      expect(v).toBeGreaterThan(0);
    }
  });

  it('has approximately correct mean (1/lambda)', () => {
    const rng = createPRNG(44);
    const lambda = 0.5;
    const n = 5000;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += randExponential(rng, lambda);
    }
    // Mean of exponential(λ) = 1/λ = 2.0
    const mean = sum / n;
    expect(mean).toBeCloseTo(1 / lambda, 0);
  });
});
