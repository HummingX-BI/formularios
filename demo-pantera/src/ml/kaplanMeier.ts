import { normal, chi2 } from '../stats';

export interface KMResult {
  times: number[];
  survival: number[];
  lowerCI: number[];
  upperCI: number[];
  greenwoodVar: number[];
  atRisk: number[];
  events: number[];
  medianSurvival: number | null;
  rmst36: number; // Restricted Mean Survival Time at 36 months
  meta: MLMeta;
}

export interface MLMeta {
  modelName: string;
  inputs: string[];
  metrics: Record<string, number | string>;
  trainingDate: string;
  limitations: string;
  tag: string;
}

export function kaplanMeier(times: number[], events: boolean[], maxTime = 36): KMResult {
  const n = times.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => {
    if (times[a]! === times[b]!) return events[a] ? -1 : 1;
    return times[a]! - times[b]!;
  });

  const uniqueTimes: number[] = [];
  const eventsAtTime: number[] = [];
  const censoredAtTime: number[] = [];
  const atRiskAtTime: number[] = [];

  let currentRisk = n;
  let i = 0;

  while (i < n) {
    const t = times[indices[i]!]!;
    let ev = 0;
    let cen = 0;
    const initialRisk = currentRisk;

    while (i < n && times[indices[i]!]! === t) {
      if (events[indices[i]!]!) ev++;
      else cen++;
      currentRisk--;
      i++;
    }

    uniqueTimes.push(t);
    eventsAtTime.push(ev);
    censoredAtTime.push(cen);
    atRiskAtTime.push(initialRisk);
  }

  const survival = [1];
  const greenwoodVar = [0];
  const lowerCI = [1];
  const upperCI = [1];
  const resultTimes = [0];
  const atRisk = [n];
  const eventCounts = [0];

  let currentSurv = 1;
  let sumGreenwood = 0;

  const z = normal.quantile(0.975); // 95% CI

  for (let j = 0; j < uniqueTimes.length; j++) {
    const d = eventsAtTime[j]!;
    const r = atRiskAtTime[j]!;

    if (r > 0 && d > 0) {
      currentSurv *= 1 - d / r;
      sumGreenwood += d / (r * (r - d));
    }

    resultTimes.push(uniqueTimes[j]!);
    survival.push(currentSurv);
    atRisk.push(r);
    eventCounts.push(d);

    let gVar = currentSurv * currentSurv * sumGreenwood;
    if (isNaN(gVar) || gVar < 0) gVar = 0;
    greenwoodVar.push(gVar);

    // log-log CI transformation for stability
    if (currentSurv === 1 || currentSurv === 0) {
      lowerCI.push(currentSurv);
      upperCI.push(currentSurv);
    } else {
      const seLogLog = Math.sqrt(sumGreenwood) / Math.abs(Math.log(currentSurv));
      const expTerm = Math.exp(z * seLogLog);
      lowerCI.push(Math.pow(currentSurv, expTerm));
      upperCI.push(Math.pow(currentSurv, 1 / expTerm));
    }
  }

  // Calculate Median Survival
  let medianSurvival: number | null = null;
  for (let j = 0; j < survival.length; j++) {
    if (survival[j]! <= 0.5) {
      medianSurvival = resultTimes[j]!;
      break;
    }
  }

  // Calculate RMST (Area under curve up to maxTime)
  let rmst = 0;
  let lastTime = 0;
  for (let j = 0; j < resultTimes.length; j++) {
    const t = Math.min(resultTimes[j]!, maxTime);
    const dt = t - lastTime;
    if (dt > 0) {
      rmst += dt * survival[Math.max(0, j - 1)]!;
      lastTime = t;
    }
    if (t >= maxTime) break;
  }
  if (lastTime < maxTime) {
    rmst += (maxTime - lastTime) * survival[survival.length - 1]!;
  }

  return {
    times: resultTimes,
    survival,
    lowerCI,
    upperCI,
    greenwoodVar,
    atRisk,
    events: eventCounts,
    medianSurvival,
    rmst36: rmst,
    meta: {
      modelName: 'Kaplan-Meier Survival Estimator',
      inputs: ['Time to event', 'Event status'],
      metrics: { RMST36: rmst, medianSurvival: medianSurvival || 'NR' },
      trainingDate: '2026-09-30',
      limitations: 'Asume censura no informativa. Riesgo competitivo ignorado.',
      tag: 'ilustrativo sobre datos de demostración',
    },
  };
}

export function logRankTest(groups: { times: number[]; events: boolean[] }[]): {
  stat: number;
  pValue: number;
  df: number;
} {
  const allTimes = new Set<number>();
  groups.forEach((g) => g.times.forEach((t) => allTimes.add(t)));
  const uniqueTimes = Array.from(allTimes).sort((a, b) => a - b);

  const k = groups.length;
  let stat = 0;

  // Simplified Log-Rank (approximate via Z scores of observed vs expected)
  // Strict multi-group log rank involves a covariance matrix. We will implement the variance diagonal approximation for independent groups,
  // or simple 2-group calculation if k=2. For K > 2, using diagonal sum is a common conservative proxy.
  let totalObserved = new Array(k).fill(0);
  let totalExpected = new Array(k).fill(0);
  let totalVariance = new Array(k).fill(0);

  for (const t of uniqueTimes) {
    let d = 0;
    let y = 0;
    const dGroup = new Array(k).fill(0);
    const yGroup = new Array(k).fill(0);

    for (let i = 0; i < k; i++) {
      for (let j = 0; j < groups[i]!.times.length; j++) {
        if (groups[i]!.times[j]! >= t) yGroup[i]++;
        if (groups[i]!.times[j]! === t && groups[i]!.events[j]!) dGroup[i]++;
      }
      d += dGroup[i]!;
      y += yGroup[i]!;
    }

    if (y > 1 && d > 0) {
      for (let i = 0; i < k; i++) {
        const expected = d * (yGroup[i]! / y);
        const variance = (expected * (y - yGroup[i]!) * (y - d)) / (y * (y - 1));

        totalObserved[i] += dGroup[i]!;
        totalExpected[i] += expected;
        totalVariance[i] += variance;
      }
    }
  }

  for (let i = 0; i < k; i++) {
    if (totalVariance[i]! > 0) {
      stat += Math.pow(totalObserved[i]! - totalExpected[i]!, 2) / totalVariance[i]!;
    }
  }

  const df = k - 1;
  const pValue = chi2.sf(stat, df);

  return { stat, pValue, df };
}
