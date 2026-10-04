import { movingAverage } from '../stats';

export interface DecompositionResult {
  trend: (number | null)[];
  seasonal: number[];
  residual: (number | null)[];
  seasonalIndices: number[]; // Length 12
  seasonOverSeason: { month: number; diff: number; pct: number }[];
}

export function decomposeTimeSeries(
  data: number[],
  method: 'additive' | 'multiplicative' = 'additive',
): DecompositionResult {
  const n = data.length;
  // Centered 12-month moving average
  // MA of 12 elements, then MA of 2 elements of the first MA
  const ma12 = movingAverage(data, 12);
  const trend: (number | null)[] = new Array(n).fill(null);

  if (ma12.length > 0) {
    const centeredMA = movingAverage(ma12, 2);
    // Centered MA aligns at index 6 (0-indexed) for month 7
    for (let i = 0; i < centeredMA.length; i++) {
      trend[i + 6] = centeredMA[i]!;
    }
  }

  // De-trended series
  const detrended = new Array(n).fill(null);
  for (let i = 0; i < n; i++) {
    if (trend[i] !== null) {
      if (method === 'additive') {
        detrended[i] = data[i]! - trend[i]!;
      } else {
        detrended[i] = trend[i]! !== 0 ? data[i]! / trend[i]! : 1;
      }
    }
  }

  // Calculate seasonal indices (average of detrended per month)
  const seasonalSums = new Array(12).fill(0);
  const seasonalCounts = new Array(12).fill(0);
  for (let i = 0; i < n; i++) {
    if (detrended[i] !== null) {
      const month = i % 12;
      seasonalSums[month] += detrended[i]!;
      seasonalCounts[month]++;
    }
  }

  let seasonalIndices = new Array(12).fill(0);
  for (let i = 0; i < 12; i++) {
    seasonalIndices[i] =
      seasonalCounts[i]! > 0
        ? seasonalSums[i]! / seasonalCounts[i]!
        : method === 'additive'
          ? 0
          : 1;
  }

  // Normalize seasonal indices
  let sumIdx = seasonalIndices.reduce((a, b) => a + b, 0);
  if (method === 'additive') {
    const bias = sumIdx / 12;
    seasonalIndices = seasonalIndices.map((s) => s - bias);
  } else {
    const bias = sumIdx / 12;
    seasonalIndices = seasonalIndices.map((s) => s / (bias || 1));
  }

  // Reconstruct seasonal component & residuals
  const seasonal = new Array(n).fill(0);
  const residual: (number | null)[] = new Array(n).fill(null);
  for (let i = 0; i < n; i++) {
    const s = seasonalIndices[i % 12]!;
    seasonal[i] = s;
    if (trend[i] !== null) {
      if (method === 'additive') {
        residual[i] = data[i]! - trend[i]! - s;
      } else {
        residual[i] = data[i]! / (trend[i]! * s || 1);
      }
    }
  }

  // Season over season comparison
  const seasonOverSeason = [];
  for (let i = 12; i < n; i++) {
    const prev = data[i - 12]!;
    const diff = data[i]! - prev;
    const pct = prev !== 0 ? diff / prev : 0;
    seasonOverSeason.push({ month: i % 12, diff, pct });
  }

  return {
    trend,
    seasonal,
    residual,
    seasonalIndices,
    seasonOverSeason,
  };
}
