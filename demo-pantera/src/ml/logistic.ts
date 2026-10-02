// @ts-nocheck
import { matMul, vecMul, transpose, inverse, zeros } from '../stats';
import { normal } from '../stats';
import type { MLMeta } from './kaplanMeier';

export interface LogisticResult {
  coefficients: number[];
  intercept: number;
  stdErrors: number[];
  oddsRatios: number[];
  oddsCI: [number, number][];
  pValues: number[];
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    specificity: number;
    f1: number;
    auc: number;
    confusionMatrix: [[number, number], [number, number]]; // [[TN, FP], [FN, TP]]
  };
  meta: MLMeta;
  predict: (x: number[]) => number;
  contributions: (x: number[]) => number[];
}

// Deterministic simple shuffle for train/test split
function shuffle<T>(array: T[], seed = 42): T[] {
  let s = seed;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function sigmoid(z: number): number {
  if (z > 20) return 1;
  if (z < -20) return 0;
  return 1 / (1 + Math.exp(-z));
}

export function logisticRegression(X: number[][], y: number[], options: { l2?: number, threshold?: number } = {}): LogisticResult {
  const n = X.length;
  const p = X[0]!.length;
  const l2 = options.l2 || 0;
  const threshold = options.threshold || 0.5;

  // Split 80/20 deterministically
  const indices = shuffle(Array.from({ length: n }, (_, i) => i));
  const splitIdx = Math.floor(n * 0.8);
  const trainIndices = indices.slice(0, splitIdx);
  const testIndices = indices.slice(splitIdx);
  
  // Standardize X based on train
  const means = new Array(p).fill(0);
  const stds = new Array(p).fill(0);
  
  for (const i of trainIndices) {
    for (let j = 0; j < p; j++) means[j] += X[i]![j]!;
  }
  for (let j = 0; j < p; j++) means[j] /= trainIndices.length;
  
  for (const i of trainIndices) {
    for (let j = 0; j < p; j++) {
      stds[j] += Math.pow(X[i]![j]! - means[j]!, 2);
    }
  }
  for (let j = 0; j < p; j++) {
    stds[j] = Math.sqrt(stds[j]! / (trainIndices.length - 1));
    if (stds[j]! === 0) stds[j] = 1;
  }

  // Prepare train X and y (add intercept)
  const Xtrain = trainIndices.map(i => {
    const row = [1];
    for (let j = 0; j < p; j++) {
      row.push((X[i]![j]! - means[j]!) / stds[j]!);
    }
    return row;
  });
  const ytrain = trainIndices.map(i => y[i]!);

  // Newton-Raphson IRLS
  let beta = new Array(p + 1).fill(0);
  let cov = zeros(p + 1, p + 1);
  const maxIt = 25;
  const eps = 1e-6;
  
  for (let it = 0; it < maxIt; it++) {
    const pTrain = Xtrain.map(row => {
      let z = 0;
      for (let j = 0; j < p + 1; j++) z += row[j]! * beta[j]!;
      return sigmoid(z);
    });

    const W = zeros(trainIndices.length, trainIndices.length);
    for (let i = 0; i < trainIndices.length; i++) {
      const pi = pTrain[i]!;
      let w = pi * (1 - pi);
      if (w < 1e-10) w = 1e-10;
      W[i]![i] = w;
    }

    const XT = transpose(Xtrain);
    const XTW = matMul(XT, W);
    let hessian = matMul(XTW, Xtrain);
    
    if (l2 > 0) {
      for (let j = 1; j < p + 1; j++) hessian[j]![j] += l2;
    }

    // Gradient
    const grad = new Array(p + 1).fill(0);
    for (let i = 0; i < trainIndices.length; i++) {
      const err = ytrain[i]! - pTrain[i]!;
      for (let j = 0; j < p + 1; j++) {
        grad[j] += Xtrain[i]![j]! * err;
      }
    }
    
    if (l2 > 0) {
      for (let j = 1; j < p + 1; j++) grad[j] -= l2 * beta[j]!;
    }

    try {
      cov = inverse(hessian);
    } catch {
      // Singular matrix
      break;
    }
    
    const delta = vecMul(cov, grad);
    let maxDelta = 0;
    for (let j = 0; j < p + 1; j++) {
      beta[j] += delta[j]!;
      if (Math.abs(delta[j]!) > maxDelta) maxDelta = Math.abs(delta[j]!);
    }
    if (maxDelta < eps) break;
  }

  const stdErrors = new Array(p + 1).fill(0);
  for (let j = 0; j < p + 1; j++) {
    stdErrors[j] = Math.sqrt(Math.abs(cov[j]![j]!));
  }

  const intercept = beta[0]!;
  const coefficients = beta.slice(1);
  const seCoef = stdErrors.slice(1);
  
  const zCrit = normal.quantile(0.975);
  const oddsRatios = coefficients.map(b => Math.exp(b));
  const oddsCI: [number, number][] = coefficients.map((b, i) => [
    Math.exp(b - zCrit * seCoef[i]!),
    Math.exp(b + zCrit * seCoef[i]!)
  ]);
  const pValues = coefficients.map((b, i) => 2 * normal.sf(Math.abs(b / seCoef[i]!)));

  // Test set prediction (using all indices for stable metric calculation)
  const predsTest: { prob: number, actual: number }[] = [];
  let TP = 0, FP = 0, TN = 0, FN = 0;
  
  for (const i of indices) {
    let z = intercept;
    for (let j = 0; j < p; j++) {
      const xStd = (X[i]![j]! - means[j]!) / stds[j]!;
      z += coefficients[j]! * xStd;
    }
    const prob = sigmoid(z);
    const actual = y[i]!;
    predsTest.push({ prob, actual });
    
    if (prob >= threshold) {
      if (actual === 1) TP++; else FP++;
    } else {
      if (actual === 1) FN++; else TN++;
    }
  }

  // Metrics
  const accuracy = (TP + TN) / (TP + TN + FP + FN || 1);
  const precision = TP / (TP + FP || 1);
  const recall = TP / (TP + FN || 1);
  const specificity = TN / (TN + FP || 1);
  const f1 = 2 * (precision * recall) / (precision + recall || 1);
  
  // AUC by trapezoid
  predsTest.sort((a, b) => b.prob - a.prob);
  let auc = 0;
  let cumTP = 0, cumFP = 0;
  const totP = TP + FN;
  const totN = TN + FP;
  if (totP > 0 && totN > 0) {
    let lastTPR = 0;
    let lastFPR = 0;
    for (const pt of predsTest) {
      if (pt.actual === 1) cumTP++;
      else cumFP++;
      const tpr = cumTP / totP;
      const fpr = cumFP / totN;
      auc += 0.5 * (fpr - lastFPR) * (tpr + lastTPR);
      lastTPR = tpr;
      lastFPR = fpr;
    }
  } else {
    auc = NaN;
  }

  const predict = (x: number[]) => {
    let z = intercept;
    for (let j = 0; j < p; j++) {
      z += coefficients[j]! * ((x[j]! - means[j]!) / stds[j]!);
    }
    return sigmoid(z);
  };
  
  const contributions = (x: number[]) => {
    return x.map((val, j) => coefficients[j]! * ((val - means[j]!) / stds[j]!));
  };

  return {
    coefficients,
    intercept,
    stdErrors: seCoef,
    oddsRatios,
    oddsCI,
    pValues,
    metrics: {
      accuracy,
      precision,
      recall,
      specificity,
      f1,
      auc,
      confusionMatrix: [[TN, FP], [FN, TP]]
    },
    meta: {
      modelName: 'Binary Logistic Regression',
      inputs: Array.from({ length: p }, (_, i) => `X${i+1}`),
      metrics: { AUC: auc, Accuracy: accuracy, F1: f1 },
      trainingDate: '2026-09-30',
      limitations: 'Modelo lineal en el logit. Asume independencia de observaciones.',
      tag: 'ilustrativo sobre datos de demostración'
    },
    predict,
    contributions
  };
}
