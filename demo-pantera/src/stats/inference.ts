// @ts-nocheck
/* eslint-disable */
import { normal, studentT, chi2, binomial } from './distributions';
import { mean, variance } from './descriptive';

export interface InferenceResult {
  stat: number;
  df: number | null;
  p: number;
  ci: [number, number] | null;
  decision: string;
  phrase: string;
}

export function confIntervalMean(data: number[], conf = 0.95): [number, number] {
  const n = data.length;
  if (n < 2) return [NaN, NaN];
  const m = mean(data);
  const v = variance(data);
  const se = Math.sqrt(v / n);
  const tVal = studentT.quantile(1 - (1 - conf) / 2, n - 1);
  return [m - tVal * se, m + tVal * se];
}

export function confIntervalProportionWald(successes: number, n: number, conf = 0.95): [number, number] {
  if (n === 0) return [NaN, NaN];
  const p = successes / n;
  const z = normal.quantile(1 - (1 - conf) / 2);
  const se = Math.sqrt((p * (1 - p)) / n);
  return [Math.max(0, p - z * se), Math.min(1, p + z * se)];
}

export function confIntervalProportionWilson(successes: number, n: number, conf = 0.95): [number, number] {
  if (n === 0) return [NaN, NaN];
  const p = successes / n;
  const z = normal.quantile(1 - (1 - conf) / 2);
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const term = z * Math.sqrt((p * (1 - p) / n) + (z2 / (4 * n * n))) / denom;
  return [Math.max(0, center - term), Math.min(1, center + term)];
}

export function tTestOneSample(data: number[], mu0 = 0): InferenceResult {
  const n = data.length;
  const m = mean(data);
  const v = variance(data);
  const se = Math.sqrt(v / n);
  const t = (m - mu0) / se;
  const df = n - 1;
  const p = 2 * studentT.sf(Math.abs(t), df);
  const ci = confIntervalMean(data);
  const decision = p < 0.05 ? 'Rechazar H0' : 'No rechazar H0';
  const phrase = p < 0.05 
    ? `Sí hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que la media es distinta de ${mu0}.`
    : `No hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que la media es distinta de ${mu0}.`;
  return { stat: t, df, p, ci, decision, phrase };
}

export function tTestWelch(data1: number[], data2: number[]): InferenceResult {
  const n1 = data1.length;
  const n2 = data2.length;
  const m1 = mean(data1);
  const m2 = mean(data2);
  const v1 = variance(data1);
  const v2 = variance(data2);
  const se = Math.sqrt(v1 / n1 + v2 / n2);
  const t = (m1 - m2) / se;
  
  const num = Math.pow(v1 / n1 + v2 / n2, 2);
  const den = Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1);
  const df = num / den;
  
  const p = 2 * studentT.sf(Math.abs(t), df);
  
  const tVal = studentT.quantile(0.975, df);
  const ci: [number, number] = [(m1 - m2) - tVal * se, (m1 - m2) + tVal * se];
  
  const decision = p < 0.05 ? 'Rechazar H0' : 'No rechazar H0';
  const phrase = p < 0.05 
    ? `Sí hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que los promedios de los dos grupos son distintos.`
    : `No hay evidencia estadística suficiente (p = ${p.toFixed(4)}) para afirmar que exista una diferencia real entre los promedios de ambos grupos.`;
  
  return { stat: t, df, p, ci, decision, phrase };
}

export function zTestTwoProportions(x1: number, n1: number, x2: number, n2: number): InferenceResult {
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const pPool = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  const z = (p1 - p2) / se;
  const p = 2 * normal.sf(Math.abs(z));
  
  const seDiff = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
  const zVal = normal.quantile(0.975);
  const ci: [number, number] = [(p1 - p2) - zVal * seDiff, (p1 - p2) + zVal * seDiff];
  
  const decision = p < 0.05 ? 'Rechazar H0' : 'No rechazar H0';
  const phrase = p < 0.05 
    ? `Sí hay evidencia suficiente (p = ${p.toFixed(4)}) para afirmar que las proporciones son distintas.`
    : `No hay evidencia suficiente (p = ${p.toFixed(4)}) para afirmar que las proporciones sean distintas.`;
    
  return { stat: z, df: null, p, ci, decision, phrase };
}

export function chiSquareIndependence(observed: number[][]): InferenceResult & { expected: number[][] } {
  const r = observed.length;
  const c = observed[0]!.length;
  const rowSums = new Array(r).fill(0);
  const colSums = new Array(c).fill(0);
  let total = 0;
  
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      rowSums[i] += observed[i]![j];
      colSums[j] += observed[i]![j];
      total += observed[i]![j]!;
    }
  }
  
  let chiStat = 0;
  const expected = [];
  for (let i = 0; i < r; i++) {
    expected[i] = [];
    for (let j = 0; j < c; j++) {
      const e = (rowSums[i] * colSums[j]) / total;
      expected[i]![j] = e;
      const o = observed[i]![j]!;
      chiStat += Math.pow(o - e, 2) / e;
    }
  }
  
  const df = (r - 1) * (c - 1);
  const p = chi2.sf(chiStat, df);
  
  const decision = p < 0.05 ? 'Rechazar H0' : 'No rechazar H0';
  const phrase = p < 0.05
    ? `Sí hay evidencia (p = ${p.toFixed(4)}) de que existe una relación o dependencia entre los factores.`
    : `No hay evidencia (p = ${p.toFixed(4)}) para afirmar que exista una dependencia entre los factores; parecen independientes.`;
    
  return { stat: chiStat, df, p, ci: null, expected, decision, phrase };
}

export function exactBinomialTest(k: number, n: number, p0 = 0.5): InferenceResult {
  const obsP = k / n;
  let p = 0;
  
  // Two-tailed p-value calculation
  const probObs = binomial.pmf(k, n, p0);
  for (let i = 0; i <= n; i++) {
    if (binomial.pmf(i, n, p0) <= probObs + 1e-10) {
      p += binomial.pmf(i, n, p0);
    }
  }
  p = Math.min(1, p);
  
  // Clopper-Pearson exact CI
  const alpha = 0.05;
  const lower = k === 0 ? 0 : regularizedBeta(alpha/2, k, n - k + 1);
  const upper = k === n ? 1 : regularizedBeta(1 - alpha/2, k + 1, n - k);
  
  const decision = p < 0.05 ? 'Rechazar H0' : 'No rechazar H0';
  const phrase = p < 0.05
    ? `Evidencia (p = ${p.toFixed(4)}) de que la proporción difiere de ${p0}.`
    : `No hay evidencia (p = ${p.toFixed(4)}) de diferencia con ${p0}.`;
    
  return { stat: k, df: n, p, ci: [lower, upper], decision, phrase };
}

export function cohensD(data1: number[], data2: number[]): number {
  const n1 = data1.length;
  const n2 = data2.length;
  const v1 = variance(data1);
  const v2 = variance(data2);
  const pooledSd = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  return (mean(data1) - mean(data2)) / pooledSd;
}

export function cohensH(p1: number, p2: number): number {
  const phi1 = 2 * Math.asin(Math.sqrt(p1));
  const phi2 = 2 * Math.asin(Math.sqrt(p2));
  return Math.abs(phi1 - phi2);
}

export function cramersV(observed: number[][]): number {
  const res = chiSquareIndependence(observed);
  const r = observed.length;
  const c = observed[0]!.length;
  const total = observed.flat().reduce((a, b) => a + b, 0);
  const k = Math.min(r - 1, c - 1);
  return Math.sqrt(res.stat / (total * k));
}
