import { kaplanMeier, logRankTest } from '../kaplanMeier';
import { logisticRegression } from '../logistic';
import { kmeans } from '../kmeans';
import { pca } from '../pca';
import { decomposeTimeSeries } from '../timeseries';
import { holtWinters } from '../forecast';
import { monteCarlo } from '../montecarlo';

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
        self.postMessage({ type: 'progress', id, progress: 0.1 });
        await new Promise(r => setTimeout(r, 10)); // Yield
        self.postMessage({ type: 'progress', id, progress: 0.5 });
        await new Promise(r => setTimeout(r, 10)); // Yield
      }
      
      const result = handler(params);
      self.postMessage({ type: 'result', id, result });
    } catch (error: any) {
      self.postMessage({ type: 'error', id, error: error.message || String(error) });
    }
  }
};
