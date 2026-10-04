// @ts-nocheck
import { normal, stdDev } from '../stats';
import type { MLMeta } from './kaplanMeier';

export interface ForecastScenario {
  mean: number[];
  lower80: number[];
  upper80: number[];
  lower95: number[];
  upper95: number[];
}

export interface ForecastResult {
  alpha: number;
  beta: number;
  gamma: number;
  fitted: number[];
  residuals: number[];
  metrics: { mae: number; rmse: number; mape: number };
  forecast: {
    expected: number[];
    optimistic: number[];
    conservative: number[];
  };
  scenarios: ForecastScenario;
  meta: MLMeta;
}

export function holtWinters(data: number[], horizon = 6): ForecastResult {
  const n = data.length;
  const slen = 12; // 12 months
  if (n < slen * 2) throw new Error('Need at least 2 full seasons of data');

  // Grid search for best params
  let bestAlpha = 0.1,
    bestBeta = 0.1,
    bestGamma = 0.1;
  let bestRMSE = Infinity;
  let bestFitted: number[] = [];

  const step = 0.1;
  for (let a = 0.1; a <= 0.9; a += step) {
    for (let b = 0.1; b <= 0.9; b += step) {
      for (let g = 0.1; g <= 0.9; g += step) {
        const { rmse, fitted } = runHoltWinters(data, slen, a, b, g, false);
        if (rmse < bestRMSE) {
          bestRMSE = rmse;
          bestAlpha = a;
          bestBeta = b;
          bestGamma = g;
          bestFitted = fitted;
        }
      }
    }
  }

  // Final run with best params
  const model = runHoltWinters(data, slen, bestAlpha, bestBeta, bestGamma, true);
  const residuals = data.map((val, i) => val - model.fitted[i]!);
  const stdRes = stdDev(residuals);

  // Generate Forecast
  const lastLevel = model.level[n - 1]!;
  const lastTrend = model.trend[n - 1]!;
  const expected = [];
  const lower80 = [];
  const upper80 = [];
  const lower95 = [];
  const upper95 = [];

  const z80 = normal.quantile(0.9);
  const z95 = normal.quantile(0.975);

  for (let h = 1; h <= horizon; h++) {
    const sIndex = n - 1 + h - slen * Math.ceil(h / slen);
    const season = model.season[Math.max(0, sIndex)] || 0;
    const yHat = lastLevel + h * lastTrend + season;
    expected.push(yHat);

    // Prediction interval grows with horizon
    const margin = stdRes * Math.sqrt(h);
    lower80.push(yHat - z80 * margin);
    upper80.push(yHat + z80 * margin);
    lower95.push(yHat - z95 * margin);
    upper95.push(yHat + z95 * margin);
  }

  // Cross-validation (backtesting on last 6 months)
  const trainData = data.slice(0, n - 6);
  const testData = data.slice(n - 6);
  let mae = 0,
    rmse = 0,
    mape = 0;

  if (trainData.length >= slen * 2) {
    const cvModel = runHoltWinters(trainData, slen, bestAlpha, bestBeta, bestGamma, true);
    const cvLevel = cvModel.level[trainData.length - 1]!;
    const cvTrend = cvModel.trend[trainData.length - 1]!;

    for (let h = 1; h <= 6; h++) {
      const sIndex = trainData.length - 1 + h - slen * Math.ceil(h / slen);
      const cvSeason = cvModel.season[Math.max(0, sIndex)] || 0;
      const pred = cvLevel + h * cvTrend + cvSeason;
      const actual = testData[h - 1]!;

      const err = pred - actual;
      mae += Math.abs(err);
      rmse += err * err;
      if (actual !== 0) mape += Math.abs(err / actual);
    }
    mae /= 6;
    rmse = Math.sqrt(rmse / 6);
    mape /= 6;
  }

  return {
    alpha: bestAlpha,
    beta: bestBeta,
    gamma: bestGamma,
    fitted: model.fitted,
    residuals,
    metrics: { mae, rmse, mape },
    forecast: {
      expected,
      optimistic: upper80,
      conservative: lower80,
    },
    scenarios: {
      mean: expected,
      lower80,
      upper80,
      lower95,
      upper95,
    },
    meta: {
      modelName: 'Holt-Winters (Aditivo)',
      inputs: ['Serie mensual histórica'],
      metrics: { RMSE: rmse, MAPE: (mape * 100).toFixed(1) + '%' },
      trainingDate: '2026-09-30',
      limitations:
        'Asume tendencia lineal y estacionalidad constante. La incertidumbre crece rápido.',
      tag: 'ilustrativo sobre datos de demostración',
    },
  };
}

function runHoltWinters(
  data: number[],
  slen: number,
  alpha: number,
  beta: number,
  gamma: number,
  full: boolean,
) {
  const n = data.length;
  const level = new Array(n).fill(0);
  const trend = new Array(n).fill(0);
  const season = new Array(n).fill(0);
  const fitted = new Array(n).fill(0);

  // Init
  let sumTrend = 0;
  for (let i = 0; i < slen; i++) {
    sumTrend += (data[slen + i]! - data[i]!) / slen;
  }
  trend[slen - 1] = sumTrend / slen;

  const avgFirstSeason = data.slice(0, slen).reduce((a, b) => a + b, 0) / slen;
  for (let i = 0; i < slen; i++) {
    season[i] = data[i]! - avgFirstSeason;
  }
  level[slen - 1] = avgFirstSeason;

  // Smoothing
  let rmse = 0;
  for (let i = slen; i < n; i++) {
    const lastL = level[i - 1]!;
    const lastT = trend[i - 1]!;
    const s = season[i - slen]!;

    const val = data[i]!;
    const L = alpha * (val - s) + (1 - alpha) * (lastL + lastT);
    const T = beta * (L - lastL) + (1 - beta) * lastT;
    const S = gamma * (val - L) + (1 - gamma) * s;

    level[i] = L;
    trend[i] = T;
    season[i] = S;
    fitted[i] = lastL + lastT + s;

    rmse += Math.pow(val - fitted[i]!, 2);
  }

  rmse = Math.sqrt(rmse / (n - slen));
  return { rmse, fitted, level, trend, season };
}
