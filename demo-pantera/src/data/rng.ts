/**
 * Implementación de PRNG SFC32 para aleatoriedad reproducible.
 */

// Helper to hash string to 4 32-bit seeds (cyrb128)
function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

export class RandomGenerator {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor(a: number, b: number, c: number, d: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    // warm up
    for(let i = 0; i < 15; i++) this.next();
  }

  // Returns float [0, 1)
  next(): number {
    this.a >>>= 0; this.b >>>= 0; this.c >>>= 0; this.d >>>= 0; 
    let t = (this.a + this.b) | 0;
    this.a = this.b ^ (this.b >>> 9);
    this.b = (this.c + (this.c << 3)) | 0;
    this.c = (this.c << 21) | (this.c >>> 11);
    this.d = (this.d + 1) | 0;
    t = (t + this.d) | 0;
    this.c = (this.c + t) | 0;
    return (t >>> 0) / 4294967296;
  }

  fork(label: string): RandomGenerator {
    const s = this.next().toString() + label;
    const [a, b, c, d] = cyrb128(s);
    return new RandomGenerator(a, b, c, d);
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  bool(p: number = 0.5): boolean {
    return this.next() < p;
  }

  normal(mu: number = 0, sigma: number = 1): number {
    // Box-Muller
    let u = 0, v = 0;
    while(u === 0) u = this.next();
    while(v === 0) v = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * sigma + mu;
  }

  logNormal(mu: number, sigma: number): number {
    return Math.exp(this.normal(mu, sigma));
  }

  exponential(rate: number): number {
    let u = 0;
    while(u === 0) u = this.next();
    return -Math.log(u) / rate;
  }

  gamma(k: number, theta: number): number {
    let sum = 0;
    for (let i = 0; i < k; i++) {
      let u = 0;
      while(u === 0) u = this.next();
      sum += -Math.log(u);
    }
    return sum * theta;
  }

  beta(a: number, b: number): number {
    const x = this.gamma(a, 1);
    const y = this.gamma(b, 1);
    return x / (x + y);
  }

  poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= this.next();
    } while (p > L);
    return k - 1;
  }

  binomial(n: number, p: number): number {
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (this.next() < p) k++;
    }
    return k;
  }

  choice<T>(items: T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  weightedChoice<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((acc, w) => acc + w, 0);
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= (weights[i] as number);
      if (r <= 0) return items[i] as T;
    }
    return items[items.length - 1] as T;
  }

  shuffle<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
    }
    return arr;
  }

  sample<T>(items: T[], k: number): T[] {
    return this.shuffle(items).slice(0, k);
  }
}

export function createRng(seed: number | string): RandomGenerator {
  const [a, b, c, d] = cyrb128(seed.toString());
  return new RandomGenerator(a, b, c, d);
}
