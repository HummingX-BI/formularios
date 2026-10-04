// @ts-nocheck
/* eslint-disable */
import { mean, stdDev, variance } from './descriptive';
import { studentT, normal } from './distributions';

export interface CorrelationResult {
  r: number;
  p: number;
}

export function covariance(x: number[], y: number[], sample = true): number {
  const n = x.length;
  if (n !== y.length || n < 2) return NaN;
  const mx = mean(x);
  const my = mean(y);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (x[i]! - mx) * (y[i]! - my);
  }
  return sum / (n - (sample ? 1 : 0));
}

export function pearson(x: number[], y: number[]): CorrelationResult {
  const n = x.length;
  if (n < 3) return { r: NaN, p: NaN };
  const cov = covariance(x, y);
  const sdx = stdDev(x);
  const sdy = stdDev(y);
  let r = cov / (sdx * sdy);
  if (r > 1) r = 1;
  if (r < -1) r = -1;

  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = 2 * studentT.sf(Math.abs(t), n - 2);
  return { r, p };
}

function rank(data: number[]): number[] {
  const indexed = data.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(data.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i;
    let sumRanks = 0;
    while (j < indexed.length && indexed[j]!.v === indexed[i]!.v) {
      sumRanks += j + 1;
      j++;
    }
    const avgRank = sumRanks / (j - i);
    for (let k = i; k < j; k++) {
      ranks[indexed[k]!.i] = avgRank;
    }
    i = j;
  }
  return ranks;
}

export function spearman(x: number[], y: number[]): CorrelationResult {
  const rx = rank(x);
  const ry = rank(y);
  return pearson(rx, ry);
}

export function kendall(x: number[], y: number[]): CorrelationResult {
  const n = x.length;
  if (n < 3) return { r: NaN, p: NaN };

  let concordant = 0;
  let discordant = 0;
  let tx = 0;
  let ty = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = Math.sign(x[i]! - x[j]!);
      const dy = Math.sign(y[i]! - y[j]!);
      if (dx !== 0 && dy !== 0) {
        if (dx === dy) concordant++;
        else discordant++;
      }
      if (dx === 0 && dy !== 0) tx++;
      if (dy === 0 && dx !== 0) ty++;
    }
  }

  const totalPairs = (n * (n - 1)) / 2;
  const num = concordant - discordant;
  const den = Math.sqrt((totalPairs - tx) * (totalPairs - ty));
  const tau = den === 0 ? 0 : num / den;

  const varianceTau = (4 * n + 10) / (9 * n * (n - 1));
  const z = tau / Math.sqrt(varianceTau);
  const p = 2 * normal.sf(Math.abs(z));

  return { r: tau, p };
}

export function correlationMatrix(
  data: number[][],
  method: 'pearson' | 'spearman' | 'kendall' = 'pearson',
): number[][] {
  const k = data.length;
  const matrix = Array.from({ length: k }, () => new Array(k).fill(1));

  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      let r = 0;
      if (method === 'pearson') r = pearson(data[i]!, data[j]!).r;
      else if (method === 'spearman') r = spearman(data[i]!, data[j]!).r;
      else r = kendall(data[i]!, data[j]!).r;
      matrix[i]![j] = r;
      matrix[j]![i] = r;
    }
  }
  return matrix;
}

export function covarianceMatrix(data: number[][]): number[][] {
  const k = data.length;
  const matrix = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let i = 0; i < k; i++) {
    for (let j = i; j < k; j++) {
      const cov = covariance(data[i]!, data[j]!);
      matrix[i]![j] = cov;
      matrix[j]![i] = cov;
    }
  }
  return matrix;
}
