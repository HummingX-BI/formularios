/* eslint-disable */
export function mean(data: number[]): number {
  if (data.length === 0) return NaN;
  return data.reduce((a, b) => a + b, 0) / data.length;
}

export function median(data: number[]): number {
  if (data.length === 0) return NaN;
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function mode(data: number[]): number[] {
  if (data.length === 0) return [];
  const counts = new Map<number, number>();
  let maxCount = 0;
  for (const val of data) {
    const c = (counts.get(val) || 0) + 1;
    counts.set(val, c);
    if (c > maxCount) maxCount = c;
  }
  const modes: number[] = [];
  for (const [val, count] of counts.entries()) {
    if (count === maxCount) modes.push(val);
  }
  return modes.sort((a, b) => a - b);
}

export function variance(data: number[], sample = true): number {
  if (data.length === 0 || (sample && data.length < 2)) return NaN;
  const m = mean(data);
  const sumSq = data.reduce((a, b) => a + Math.pow(b - m, 2), 0);
  return sumSq / (data.length - (sample ? 1 : 0));
}

export function stdDev(data: number[], sample = true): number {
  return Math.sqrt(variance(data, sample));
}

export function range(data: number[]): number {
  if (data.length === 0) return NaN;
  return Math.max(...data) - Math.min(...data);
}

// Percentile method 7 (linear interpolation), default in R and NumPy
export function percentile(data: number[], p: number): number {
  if (data.length === 0 || p < 0 || p > 1) return NaN;
  const sorted = [...data].sort((a, b) => a - b);
  const h = (sorted.length - 1) * p;
  const i = Math.floor(h);
  const fraction = h - i;
  if (i >= sorted.length - 1) return sorted[sorted.length - 1]!;
  return sorted[i]! + fraction * (sorted[i + 1]! - sorted[i]!);
}

export function iqr(data: number[]): number {
  return percentile(data, 0.75) - percentile(data, 0.25);
}

export function coefficientOfVariation(data: number[]): number {
  const m = mean(data);
  return m === 0 ? NaN : stdDev(data) / m;
}

export function skewness(data: number[], sample = true): number {
  const n = data.length;
  if (n < 3 && sample) return NaN;
  const m = mean(data);
  let m2 = 0;
  let m3 = 0;
  for (const val of data) {
    const diff = val - m;
    m2 += diff * diff;
    m3 += diff * diff * diff;
  }
  m2 /= n;
  m3 /= n;
  let g1 = m2 === 0 ? 0 : m3 / Math.pow(m2, 1.5);
  if (sample) {
    // Adjusted Fisher-Pearson standardized moment coefficient
    g1 *= Math.sqrt(n * (n - 1)) / (n - 2);
  }
  return g1;
}

export function kurtosis(data: number[], sample = true): number {
  const n = data.length;
  if (n < 4 && sample) return NaN;
  const m = mean(data);
  let m2 = 0;
  let m4 = 0;
  for (const val of data) {
    const diff = val - m;
    m2 += diff * diff;
    m4 += diff * diff * diff * diff;
  }
  m2 /= n;
  m4 /= n;
  if (m2 === 0) return 0;

  if (!sample) {
    return m4 / (m2 * m2) - 3;
  }
  // Sample excess kurtosis
  const factor1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
  const term1 = factor1 * (m4 / (m2 * m2)) * (n - 1) * (n - 1);
  const term2 = (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
  return term1 - term2;
}

export function quantiles(data: number[], q: number): number[] {
  const res = [];
  for (let i = 1; i < q; i++) {
    res.push(percentile(data, i / q));
  }
  return res;
}

export function fiveNumberSummary(data: number[]): [number, number, number, number, number] {
  if (data.length === 0) return [NaN, NaN, NaN, NaN, NaN];
  return [
    Math.min(...data),
    percentile(data, 0.25),
    percentile(data, 0.5),
    percentile(data, 0.75),
    Math.max(...data),
  ];
}

export function outliers(data: number[]): {
  lowerBound: number;
  upperBound: number;
  outliers: number[];
} {
  const q1 = percentile(data, 0.25);
  const q3 = percentile(data, 0.75);
  const iqrVal = q3 - q1;
  const lowerBound = q1 - 1.5 * iqrVal;
  const upperBound = q3 + 1.5 * iqrVal;
  const out = data.filter((v) => v < lowerBound || v > upperBound);
  return { lowerBound, upperBound, outliers: out };
}

export function histogramSturges(data: number[]): {
  bins: number;
  min: number;
  max: number;
  width: number;
} {
  const bins = Math.ceil(Math.log2(data.length) + 1);
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { bins, min, max, width: (max - min) / bins };
}

export function histogramFD(data: number[]): {
  bins: number;
  min: number;
  max: number;
  width: number;
} {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const iqrVal = iqr(data);
  let width = 2 * iqrVal * Math.pow(data.length, -1 / 3);
  if (width === 0) width = max - min; // fallback
  const bins = width === 0 ? 1 : Math.ceil((max - min) / width);
  return { bins, min, max, width };
}

export function kernelDensity(data: number[], xVals: number[], bandwidth?: number): number[] {
  const n = data.length;
  if (n === 0) return xVals.map(() => 0);

  // Silverman's rule of thumb
  let h = bandwidth;
  if (!h) {
    const std = stdDev(data);
    const iqrVal = iqr(data);
    const a = Math.min(std, iqrVal / 1.34);
    h = 0.9 * a * Math.pow(n, -0.2);
  }

  if (h === 0) h = 1;

  const factor = 1 / (n * h * Math.sqrt(2 * Math.PI));
  return xVals.map((x) => {
    let sum = 0;
    for (const xi of data) {
      const u = (x - xi) / h!;
      sum += Math.exp(-0.5 * u * u);
    }
    return factor * sum;
  });
}
