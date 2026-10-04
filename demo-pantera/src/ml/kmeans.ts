import type { MLMeta } from './kaplanMeier';

export interface KMeansResult {
  k: number;
  assignments: number[];
  centroids: number[][];
  inertia: number;
  silhouette: number;
  elbow: { k: number; inertia: number }[];
  meta: MLMeta;
}

function seededRNG(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function distSq(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i]! - b[i]!;
    sum += diff * diff;
  }
  return sum;
}

export function kmeans(X: number[][], maxK = 8, seed = 42, targetK?: number): KMeansResult {
  const n = X.length;
  const p = X[0]!.length;

  if (n < maxK) maxK = n;

  // Standardize X
  const means = new Array(p).fill(0);
  const stds = new Array(p).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) means[j] += X[i]![j]!;
  }
  for (let j = 0; j < p; j++) means[j] /= n;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      stds[j] += Math.pow(X[i]![j]! - means[j]!, 2);
    }
  }
  for (let j = 0; j < p; j++) {
    stds[j] = Math.sqrt(stds[j]! / (n - 1));
    if (stds[j]! === 0) stds[j] = 1;
  }

  const Xstd = X.map((row) => row.map((val, j) => (val - means[j]!) / stds[j]!));

  const runKMeansForK = (k: number, rng: () => number) => {
    let bestInertia = Infinity;
    let bestAssignments: number[] = [];
    let bestCentroids: number[][] = [];

    // 5 restarts
    for (let restart = 0; restart < 5; restart++) {
      // k-means++ init
      const centroids: number[][] = [Xstd[Math.floor(rng() * n)]!];

      for (let c = 1; c < k; c++) {
        const dSq = new Array(n).fill(Infinity);
        let sumD = 0;
        for (let i = 0; i < n; i++) {
          for (let prev = 0; prev < c; prev++) {
            const d = distSq(Xstd[i]!, centroids[prev]!);
            if (d < dSq[i]!) dSq[i] = d;
          }
          sumD += dSq[i]!;
        }
        let target = rng() * sumD;
        let selected = n - 1;
        for (let i = 0; i < n; i++) {
          target -= dSq[i]!;
          if (target <= 0) {
            selected = i;
            break;
          }
        }
        centroids.push(Xstd[selected]!);
      }

      let assignments = new Array(n).fill(-1);
      let changed = true;
      let it = 0;
      let inertia = 0;

      while (changed && it < 100) {
        changed = false;
        inertia = 0;
        const newCentroids = Array.from({ length: k }, () => new Array(p).fill(0));
        const counts = new Array(k).fill(0);

        for (let i = 0; i < n; i++) {
          let minDist = Infinity;
          let bestC = -1;
          for (let c = 0; c < k; c++) {
            const d = distSq(Xstd[i]!, centroids[c]!);
            if (d < minDist) {
              minDist = d;
              bestC = c;
            }
          }
          if (assignments[i] !== bestC) {
            assignments[i] = bestC;
            changed = true;
          }
          inertia += minDist;
          for (let j = 0; j < p; j++) newCentroids[bestC]![j] += Xstd[i]![j]!;
          counts[bestC]++;
        }

        for (let c = 0; c < k; c++) {
          if (counts[c] > 0) {
            for (let j = 0; j < p; j++) centroids[c]![j] = newCentroids[c]![j]! / counts[c]!;
          } else {
            // Handle empty cluster
            centroids[c] = Xstd[Math.floor(rng() * n)]!;
          }
        }
        it++;
      }

      if (inertia < bestInertia) {
        bestInertia = inertia;
        bestAssignments = assignments;
        bestCentroids = centroids.map((c) => c.map((val, j) => val * stds[j]! + means[j]!)); // Un-standardize
      }
    }
    return { inertia: bestInertia, assignments: bestAssignments, centroids: bestCentroids };
  };

  const rng = seededRNG(seed);
  const elbow: { k: number; inertia: number }[] = [];
  let finalK = targetK;

  if (!finalK) {
    // Elbow method heuristic
    const results = [];
    for (let k = 2; k <= maxK; k++) {
      const res = runKMeansForK(k, rng);
      elbow.push({ k, inertia: res.inertia });
      results.push(res);
    }

    let maxAngle = 0;
    finalK = 2;
    for (let i = 1; i < elbow.length - 1; i++) {
      const prev = elbow[i - 1]!.inertia;
      const curr = elbow[i]!.inertia;
      const next = elbow[i + 1]!.inertia;
      const drop1 = prev - curr;
      const drop2 = curr - next;
      if (drop1 / (drop2 || 1e-10) > maxAngle) {
        maxAngle = drop1 / (drop2 || 1e-10);
        finalK = elbow[i]!.k;
      }
    }
  }

  const finalRes = runKMeansForK(finalK, rng);

  // Simplified Silhouette approximation (sample 100 max)
  let silhouette = 0;
  if (finalK > 1 && n > 1) {
    let sumS = 0;
    const sampleSize = Math.min(n, 100);
    const sampleIndices = Array.from({ length: sampleSize }, () => Math.floor(rng() * n));

    for (const i of sampleIndices) {
      const c = finalRes.assignments[i]!;
      let a = 0;
      let aCount = 0;
      let minB = Infinity;

      const bSums = new Array(finalK).fill(0);
      const bCounts = new Array(finalK).fill(0);

      for (const j of sampleIndices) {
        if (i === j) continue;
        const d = Math.sqrt(distSq(Xstd[i]!, Xstd[j]!));
        const c2 = finalRes.assignments[j]!;
        if (c === c2) {
          a += d;
          aCount++;
        } else {
          bSums[c2] += d;
          bCounts[c2]++;
        }
      }

      a = aCount > 0 ? a / aCount : 0;
      for (let k = 0; k < finalK; k++) {
        if (k !== c && bCounts[k]! > 0) {
          const bAvg = bSums[k]! / bCounts[k]!;
          if (bAvg < minB) minB = bAvg;
        }
      }

      if (minB === Infinity) minB = 0;
      const s = (minB - a) / Math.max(a, minB || 1e-10);
      sumS += s;
    }
    silhouette = sumS / sampleSize;
  }

  return {
    k: finalK,
    assignments: finalRes.assignments,
    centroids: finalRes.centroids,
    inertia: finalRes.inertia,
    silhouette,
    elbow,
    meta: {
      modelName: 'K-Means Clustering',
      inputs: Array.from({ length: p }, (_, i) => `Feature ${i + 1}`),
      metrics: { k: finalK, Silhouette: silhouette },
      trainingDate: '2026-09-30',
      limitations: 'Asume clústeres convexos esféricos. Sensible a la estandarización.',
      tag: 'ilustrativo sobre datos de demostración',
    },
  };
}
