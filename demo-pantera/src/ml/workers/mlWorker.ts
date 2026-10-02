import { kaplanMeier, logRankTest } from '../kaplanMeier';
import { logisticRegression } from '../logistic';
import { kmeans } from '../kmeans';
import { pca } from '../pca';
import { decomposeTimeSeries } from '../timeseries';
import { holtWinters } from '../forecast';
import { monteCarlo, createDistributions } from '../montecarlo';

const tasks: Record<string, (params: any) => any> = {
  kaplanMeier: (p) => kaplanMeier(p.times, p.events, p.maxTime),
  logRankTest: (p) => logRankTest(p.groups),
  logisticRegression: (p) => logisticRegression(p.X, p.y, p.options),
  kmeans: (p) => kmeans(p.X, p.maxK, p.seed, p.targetK),
  pca: (p) => pca(p.X),
  decomposeTimeSeries: (p) => decomposeTimeSeries(p.data, p.method),
  holtWinters: (p) => holtWinters(p.data, p.horizon),
  monteCarlo: (p) => {
    // In a real worker, functions can't be passed in messages easily.
    // We would need to define standard models by name, or use string evaluation (unsafe).
    // For demo purposes, we expect `p.modelName` and predefined distributions if run in worker.
    // If run in fallback mode, functions work fine.
    
    // We'll simulate a long running task with progress if it's monte carlo
    if (p.modelName === 'demo') {
      const inputs = {
        conversion: () => 0.05 + Math.random() * 0.1,
        traffic: () => 1000 + Math.random() * 500
      };
      const model = (i: Record<string, number>) => i['conversion']! * i['traffic']!;
      return monteCarlo({ iterations: p.iterations, inputs, model, seed: p.seed, threshold: p.threshold });
    }
    
    if (p.modelName === 'pantera_revenue') {
      const dists = createDistributions(p.seed);
      // p params: baseActive, ticket, convMean, convStd, churnMean, churnStd, prospMin, prospMode, prospMax
      const inputs = {
        conversion: () => dists.normal(p.convMean, p.convStd),
        churn: () => dists.normal(p.churnMean, p.churnStd),
        prospects: () => dists.triangular(p.prospMin, p.prospMode, p.prospMax),
        ticket: () => dists.normal(p.ticket, p.ticket * 0.05)
      };
      const model = (i: Record<string, number>) => {
        let active = p.baseActive;
        let totalRev = 0;
        // Simular 6 meses
        for(let m=0; m<6; m++) {
          const conv = Math.max(0, Math.min(1, i['conversion']!));
          const chrn = Math.max(0, Math.min(1, i['churn']!));
          const p = Math.max(0, i['prospects']!);
          const t = Math.max(0, i['ticket']!);
          
          const nuevos = p * conv;
          active = (active + nuevos) * (1 - chrn);
          totalRev += active * t;
        }
        return totalRev;
      };
      return monteCarlo({ iterations: p.iterations, inputs, model, seed: p.seed, threshold: p.threshold });
    }
    
    // Default pass-through (only works in fallback main-thread mode)
    return monteCarlo(p);
  }
};

self.onmessage = async (e: MessageEvent) => {
  const { type, id, taskName, params } = e.data;
  if (type === 'task') {
    try {
      const handler = tasks[taskName];
      if (!handler) throw new Error(`Unknown task: ${taskName}`);
      
      // Simulate progress for heavy tasks
      if (taskName === 'monteCarlo' || taskName === 'holtWinters' || taskName === 'logisticRegression') {
        for(let i=1; i<=9; i++) {
          self.postMessage({ type: 'progress', id, progress: i / 10 });
          await new Promise(r => setTimeout(r, 20));
        }
      }
      
      const result = handler(params);
      self.postMessage({ type: 'result', id, result });
    } catch (error: any) {
      self.postMessage({ type: 'error', id, error: error.message || String(error) });
    }
  }
};
