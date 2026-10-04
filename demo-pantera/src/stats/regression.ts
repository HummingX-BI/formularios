// @ts-nocheck
/* eslint-disable */
import type { Matrix, Vector } from './linalg';
import { qr, inverse, transpose, matMul, vecMul, zeros } from './linalg';
import { studentT, fisherF } from './distributions';
import { mean, stdDev } from './descriptive';

export interface OLSResult {
  coefficients: number[];
  stdErrors: number[];
  tStats: number[];
  pValues: number[];
  confIntervals: [number, number][];
  rSquared: number;
  adjRSquared: number;
  residualStdError: number;
  fStat: number;
  fPValue: number;
  fitted: number[];
  residuals: number[];
}

export function ols(X: Matrix, y: Vector): OLSResult {
  const n = X.length;
  const p = X[0]!.length;

  // y = Xb -> QR decomposition X = QR -> Rb = Q^T y -> b = R^-1 Q^T y
  const { Q, R } = qr(X);
  const qty = vecMul(transpose(Q), y);

  // Back substitution for R * b = qty
  const b = new Array(p).fill(0);
  for (let i = p - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < p; j++) sum += R[i]![j]! * b[j]!;
    b[i] = (qty[i]! - sum) / R[i]![i]!;
  }

  const fitted = vecMul(X, b);
  const residuals = y.map((yi, i) => yi - fitted[i]!);

  let sse = 0;
  for (let i = 0; i < n; i++) sse += residuals[i]! * residuals[i]!;
  const rse = Math.sqrt(sse / (n - p));

  const Rinv = inverse(R);
  const covUnscaled = matMul(Rinv, transpose(Rinv));
  const stdErrors = new Array(p).fill(0);
  for (let i = 0; i < p; i++) stdErrors[i] = rse * Math.sqrt(covUnscaled[i]![i]!);

  const tStats = b.map((coef, i) => coef / stdErrors[i]!);
  const pValues = tStats.map((t) => 2 * studentT.sf(Math.abs(t), n - p));

  const tCrit = studentT.quantile(0.975, n - p);
  const confIntervals: [number, number][] = b.map((coef, i) => [
    coef - tCrit * stdErrors[i]!,
    coef + tCrit * stdErrors[i]!,
  ]);

  const yMean = mean(y);
  let sst = 0;
  for (let i = 0; i < n; i++) sst += Math.pow(y[i]! - yMean, 2);

  const rSquared = 1 - sse / sst;
  const adjRSquared = 1 - ((1 - rSquared) * (n - 1)) / (n - p);

  const msModel = (sst - sse) / (p - 1);
  const msError = sse / (n - p);
  const fStat = msModel / msError;
  const fPValue = fisherF.sf(fStat, p - 1, n - p);

  return {
    coefficients: b,
    stdErrors,
    tStats,
    pValues,
    confIntervals,
    rSquared,
    adjRSquared,
    residualStdError: rse,
    fStat,
    fPValue,
    fitted,
    residuals,
  };
}

export function simpleLinearRegression(
  x: number[],
  y: number[],
): OLSResult & {
  predict: (xNew: number) => {
    fit: number;
    confBand: [number, number];
    predBand: [number, number];
  };
} {
  const n = x.length;
  const X = x.map((xi) => [1, xi]);
  const res = ols(X, y);

  const xMean = mean(x);
  let sxx = 0;
  for (let xi of x) sxx += Math.pow(xi - xMean, 2);
  const tCrit = studentT.quantile(0.975, n - 2);
  const rse = res.residualStdError;

  const predict = (xNew: number) => {
    const fit = res.coefficients[0]! + res.coefficients[1]! * xNew;
    const seConf = rse * Math.sqrt(1 / n + Math.pow(xNew - xMean, 2) / sxx);
    const sePred = rse * Math.sqrt(1 + 1 / n + Math.pow(xNew - xMean, 2) / sxx);
    return {
      fit,
      confBand: [fit - tCrit * seConf, fit + tCrit * seConf] as [number, number],
      predBand: [fit - tCrit * sePred, fit + tCrit * sePred] as [number, number],
    };
  };

  return { ...res, predict };
}

export function polynomialRegression2(
  x: number[],
  y: number[],
): OLSResult & { vertexX: number; vertexY: number } {
  const X = x.map((xi) => [1, xi, xi * xi]);
  const res = ols(X, y);
  const [c, b, a] = res.coefficients;
  const vertexX = -b! / (2 * a!);
  const vertexY = a! * vertexX * vertexX + b! * vertexX + c!;
  return { ...res, vertexX, vertexY };
}
