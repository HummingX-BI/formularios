import { covarianceMatrix, jacobiEigenvalue, transpose, matMul } from '../stats';
import type { MLMeta } from './kaplanMeier';

export interface PCAResult {
  explainedVariance: number[];
  explainedVarianceRatio: number[];
  components: number[][];
  projection2D: number[][];
  meta: MLMeta;
}

export function pca(X: number[][]): PCAResult {
  const n = X.length;
  if (n === 0) throw new Error("Empty dataset");
  const p = X[0]!.length;

  // Center data
  const means = new Array(p).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) means[j] += X[i]![j]!;
  }
  for (let j = 0; j < p; j++) means[j] /= n;
  
  const Xcentered = X.map(row => row.map((val, j) => val - means[j]!));

  // Covariance matrix
  const cov = covarianceMatrix(transpose(Xcentered));
  
  // Eigenvalues and eigenvectors
  const { values, vectors } = jacobiEigenvalue(cov);
  
  // Sort eigenvalues descending
  const eigenPairs = values.map((v, i) => ({ val: v, vec: vectors.map(row => row[i]!) }));
  eigenPairs.sort((a, b) => b.val - a.val);
  
  const explainedVariance = eigenPairs.map(e => e.val);
  const totalVar = explainedVariance.reduce((a, b) => a + b, 0);
  const explainedVarianceRatio = explainedVariance.map(v => v / (totalVar || 1));
  
  // Principal components (columns of vectors)
  const components = eigenPairs.map(e => e.vec);
  
  // Projection to 2D
  const W2 = transpose([components[0]!, components[1]!]);
  const projection2D = matMul(Xcentered, W2);

  return {
    explainedVariance,
    explainedVarianceRatio,
    components,
    projection2D,
    meta: {
      modelName: 'Principal Component Analysis (PCA)',
      inputs: Array.from({ length: p }, (_, i) => `Feature ${i+1}`),
      metrics: { Var2D: (explainedVarianceRatio[0]! + explainedVarianceRatio[1]!).toFixed(4) },
      trainingDate: '2026-09-30',
      limitations: 'Asume combinaciones lineales. Sensible a la escala de las variables originales.',
      tag: 'ilustrativo sobre datos de demostración'
    }
  };
}
