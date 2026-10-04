/* eslint-disable */
export interface BayesResult {
  posterior: number;
  naturalFrequencies: {
    total: number;
    a: number;
    notA: number;
    aAndB: number;
    aAndNotB: number;
    notAAndB: number;
    notAAndNotB: number;
  };
  tree: {
    root: number;
    branchA: { p: number; b: number; notB: number };
    branchNotA: { p: number; b: number; notB: number };
  };
}

/**
 * Teorema de Bayes a partir de probabilidades.
 * P(A) = prior
 * P(B|A) = sensitivity (true positive rate)
 * P(B) = probB (evidencia)
 * Si probB no se provee, se usa P(B|not A) = falsePositiveRate para calcularla por Ley de Probabilidad Total.
 */
export function bayesTheorem(
  prior: number,
  sensitivity: number,
  probB?: number,
  falsePositiveRate?: number,
): BayesResult {
  let pB = probB;
  if (pB === undefined) {
    if (falsePositiveRate === undefined)
      throw new Error('Must provide either probB or falsePositiveRate');
    pB = prior * sensitivity + (1 - prior) * falsePositiveRate;
  }

  const posterior = (sensitivity * prior) / pB; // P(A|B)

  // Natural frequencies based on 1000 population
  const total = 1000;
  const a = Math.round(total * prior);
  const notA = total - a;

  const aAndB = Math.round(a * sensitivity);
  const aAndNotB = a - aAndB;

  const notAAndB = Math.round(total * pB) - aAndB;
  const notAAndNotB = notA - notAAndB;

  return {
    posterior,
    naturalFrequencies: { total, a, notA, aAndB, aAndNotB, notAAndB, notAAndNotB },
    tree: {
      root: 1.0,
      branchA: { p: prior, b: sensitivity, notB: 1 - sensitivity },
      branchNotA: {
        p: 1 - prior,
        b: notA === 0 ? 0 : notAAndB / notA,
        notB: notA === 0 ? 0 : notAAndNotB / notA,
      },
    },
  };
}

export function conditionalProb(
  contingencyTable: number[][],
  rowIdx: number,
  colIdx: number,
): number {
  const row = contingencyTable[rowIdx];
  if (!row) return 0;
  const rowSum = row.reduce((a, b) => a + b, 0);
  if (rowSum === 0) return 0;
  return row[colIdx]! / rowSum;
}
