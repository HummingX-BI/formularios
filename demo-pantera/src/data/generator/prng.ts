/**
 * Seeded Pseudo-Random Number Generator (Mulberry32).
 *
 * Deterministic: same seed always produces the same sequence.
 * This ensures every user sees the exact same demo data.
 *
 * Algorithm: Mulberry32 — a 32-bit PRNG with period 2^32.
 * Reference: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */

export type PRNG = () => number;

/**
 * Creates a seeded PRNG using the Mulberry32 algorithm.
 * @param seed - integer seed value
 * @returns A function that returns a float in [0, 1) on each call
 */
export function createPRNG(seed: number): PRNG {
  let state = seed | 0;

  return (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a random integer in [min, max] (inclusive).
 */
export function randInt(rng: PRNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Returns a random float in [min, max).
 */
export function randFloat(rng: PRNG, min: number, max: number): number {
  return rng() * (max - min) + min;
}

/**
 * Picks a random element from an array.
 */
export function randPick<T>(rng: PRNG, arr: readonly T[]): T {
  const idx = Math.floor(rng() * arr.length);
  return arr[idx] as T;
}

/**
 * Returns true with the given probability (0–1).
 */
export function randBool(rng: PRNG, probability: number): boolean {
  return rng() < probability;
}

/**
 * Generates a value from a normal distribution using Box-Muller transform.
 *
 * Formula: z = sqrt(-2 * ln(u1)) * cos(2 * pi * u2)
 * Result:  mean + z * stddev
 */
export function randNormal(rng: PRNG, mean: number, stddev: number): number {
  const u1 = rng();
  const u2 = rng();
  // Box-Muller transform: z = sqrt(-2 * ln(u1)) * cos(2π * u2)
  const z = Math.sqrt(-2.0 * Math.log(u1 || 1e-10)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * stddev;
}

/**
 * Shuffles an array in-place using Fisher-Yates with a seeded PRNG.
 */
export function shuffle<T>(rng: PRNG, arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr;
}

/**
 * Generates a value from an exponential distribution.
 *
 * Formula: x = -ln(1 - u) / lambda
 */
export function randExponential(rng: PRNG, lambda: number): number {
  return -Math.log(1 - rng() + 1e-10) / lambda;
}
