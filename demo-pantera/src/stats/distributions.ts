/* eslint-disable */
import { erf, erfinv, regularizedGammaP, regularizedBeta, logGamma } from './special';

// === Distribución Normal ===
export const normal = {
  pdf(x: number, mu = 0, sigma = 1): number {
    return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
  },
  cdf(x: number, mu = 0, sigma = 1): number {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
  },
  sf(x: number, mu = 0, sigma = 1): number {
    return 1 - normal.cdf(x, mu, sigma);
  },
  quantile(p: number, mu = 0, sigma = 1): number {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    return mu + sigma * Math.sqrt(2) * erfinv(2 * p - 1);
  },
};

// === Distribución t de Student ===
export const studentT = {
  pdf(x: number, df: number): number {
    const term1 = logGamma((df + 1) / 2) - logGamma(df / 2);
    const term2 = -0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + (x * x) / df);
    return Math.exp(term1 + term2);
  },
  cdf(x: number, df: number): number {
    const x2 = df / (df + x * x);
    const p = 1 - regularizedBeta(x2, df / 2, 0.5);
    return x > 0 ? 0.5 + p / 2 : 0.5 - p / 2;
  },
  sf(x: number, df: number): number {
    return 1 - studentT.cdf(x, df);
  },
  quantile(p: number, df: number): number {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    // Approach via inverse regularized beta is complex. We use a Newton-Raphson approx using normal if df large,
    // or numerical inversion for simplicity and exactness.
    if (df > 100) return normal.quantile(p);
    // Bisection method to find root
    let lower = -20;
    let upper = 20;
    for (let i = 0; i < 50; i++) {
      const mid = (lower + upper) / 2;
      const val = studentT.cdf(mid, df);
      if (Math.abs(val - p) < 1e-7) return mid;
      if (val < p) lower = mid;
      else upper = mid;
    }
    return (lower + upper) / 2;
  },
};

// === Distribución Chi Cuadrada ===
export const chi2 = {
  pdf(x: number, df: number): number {
    if (x <= 0) return 0;
    return Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - logGamma(df / 2));
  },
  cdf(x: number, df: number): number {
    if (x <= 0) return 0;
    return regularizedGammaP(df / 2, x / 2);
  },
  sf(x: number, df: number): number {
    return 1 - chi2.cdf(x, df);
  },
  quantile(p: number, df: number): number {
    if (p <= 0) return 0;
    if (p >= 1) return Infinity;
    let lower = 0;
    let upper = df * 10;
    for (let i = 0; i < 60; i++) {
      const mid = (lower + upper) / 2;
      const val = chi2.cdf(mid, df);
      if (Math.abs(val - p) < 1e-7) return mid;
      if (val < p) lower = mid;
      else upper = mid;
    }
    return (lower + upper) / 2;
  },
};

// === Distribución F de Fisher ===
export const fisherF = {
  pdf(x: number, df1: number, df2: number): number {
    if (x <= 0) return 0;
    const lnum =
      (df1 / 2) * Math.log(df1) + (df2 / 2) * Math.log(df2) + (df1 / 2 - 1) * Math.log(x);
    const lden =
      ((df1 + df2) / 2) * Math.log(df1 * x + df2) +
      logGamma(df1 / 2) +
      logGamma(df2 / 2) -
      logGamma((df1 + df2) / 2);
    return Math.exp(lnum - lden);
  },
  cdf(x: number, df1: number, df2: number): number {
    if (x <= 0) return 0;
    return regularizedBeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2);
  },
  sf(x: number, df1: number, df2: number): number {
    return 1 - fisherF.cdf(x, df1, df2);
  },
};

// === Distribución Binomial ===
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return Math.exp(logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1));
}

export const binomial = {
  pmf(k: number, n: number, p: number): number {
    if (k < 0 || k > n || !Number.isInteger(k)) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return choose(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },
  cdf(k: number, n: number, p: number): number {
    if (k < 0) return 0;
    if (k >= n) return 1;
    // CDF is 1 - regularizedBeta(p, k+1, n-k)
    return 1 - regularizedBeta(p, Math.floor(k) + 1, n - Math.floor(k));
  },
  sf(k: number, n: number, p: number): number {
    return 1 - binomial.cdf(k, n, p);
  },
  quantile(q: number, n: number, p: number): number {
    if (q <= 0) return 0;
    if (q >= 1) return n;
    let cumulative = 0;
    for (let k = 0; k <= n; k++) {
      cumulative += binomial.pmf(k, n, p);
      if (cumulative >= q) return k;
    }
    return n;
  },
  mean(n: number, p: number): number {
    return n * p;
  },
  variance(n: number, p: number): number {
    return n * p * (1 - p);
  },
};

// === Distribución Poisson ===
export const poisson = {
  pmf(k: number, lambda: number): number {
    if (k < 0 || !Number.isInteger(k)) return 0;
    if (lambda === 0) return k === 0 ? 1 : 0;
    return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1));
  },
  cdf(k: number, lambda: number): number {
    if (k < 0) return 0;
    return 1 - regularizedGammaP(Math.floor(k) + 1, lambda);
  },
  sf(k: number, lambda: number): number {
    return 1 - poisson.cdf(k, lambda);
  },
};

// === Distribución Exponencial ===
export const exponential = {
  pdf(x: number, lambda: number): number {
    return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
  },
  cdf(x: number, lambda: number): number {
    return x < 0 ? 0 : 1 - Math.exp(-lambda * x);
  },
  sf(x: number, lambda: number): number {
    return x < 0 ? 1 : Math.exp(-lambda * x);
  },
  quantile(p: number, lambda: number): number {
    if (p < 0 || p >= 1) return NaN;
    return -Math.log(1 - p) / lambda;
  },
};

// === Distribución Uniforme ===
export const uniform = {
  pdf(x: number, a: number, b: number): number {
    return x >= a && x <= b ? 1 / (b - a) : 0;
  },
  cdf(x: number, a: number, b: number): number {
    if (x < a) return 0;
    if (x > b) return 1;
    return (x - a) / (b - a);
  },
};
