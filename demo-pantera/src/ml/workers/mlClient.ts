// Client for ML Web Worker

// Since this project uses Vite, we load the worker with ?worker suffix
import MLWorker from './mlWorker?worker';
import { kaplanMeier, logRankTest } from '../kaplanMeier';
import { logisticRegression } from '../logistic';
import { kmeans } from '../kmeans';
import { pca } from '../pca';
import { decomposeTimeSeries } from '../timeseries';
import { holtWinters } from '../forecast';
import { monteCarlo } from '../montecarlo';

export interface MLTaskOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

let workerInstance: Worker | null = null;
let jobId = 0;
const pendingJobs = new Map<number, { resolve: (val: any) => void, reject: (err: any) => void, onProgress?: (p: number) => void }>();

function getWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null;
  if (!workerInstance) {
    workerInstance = new MLWorker();
    workerInstance.onmessage = (e) => {
      const { type, id, result, error, progress } = e.data;
      const job = pendingJobs.get(id);
      if (!job) return;
      
      if (type === 'result') {
        job.resolve(result);
        pendingJobs.delete(id);
      } else if (type === 'error') {
        job.reject(new Error(error));
        pendingJobs.delete(id);
      } else if (type === 'progress' && job.onProgress) {
        job.onProgress(progress);
      }
    };
  }
  return workerInstance;
}

const fallbackTasks: Record<string, (params: any) => any> = {
  kaplanMeier: (p) => kaplanMeier(p.times, p.events, p.maxTime),
  logRankTest: (p) => logRankTest(p.groups),
  logisticRegression: (p) => logisticRegression(p.X, p.y, p.options),
  kmeans: (p) => kmeans(p.X, p.maxK, p.seed, p.targetK),
  pca: (p) => pca(p.X),
  decomposeTimeSeries: (p) => decomposeTimeSeries(p.data, p.method),
  holtWinters: (p) => holtWinters(p.data, p.horizon),
  monteCarlo: (p) => monteCarlo(p)
};

export async function runMLTask<T>(taskName: string, params: any, options?: MLTaskOptions): Promise<T> {
  const worker = getWorker();
  
  if (!worker) {
    // Fallback to main thread
    console.warn(`Web Workers no disponibles. Ejecutando tarea ML '${taskName}' en el hilo principal.`);
    const handler = fallbackTasks[taskName];
    if (!handler) throw new Error(`Unknown task fallback: ${taskName}`);
    if (options?.onProgress) options.onProgress(0.5);
    
    // Simulate async yield to not freeze immediately
    await new Promise(r => setTimeout(r, 0));
    
    if (options?.signal?.aborted) throw new Error("Aborted");
    
    const res = handler(params);
    if (options?.onProgress) options.onProgress(1.0);
    return res as T;
  }

  return new Promise<T>((resolve, reject) => {
    const id = ++jobId;
    
    const abortHandler = () => {
      pendingJobs.delete(id);
      reject(new Error("Aborted"));
    };
    
    if (options?.signal) {
      if (options.signal.aborted) {
        return reject(new Error("Aborted"));
      }
      options.signal.addEventListener('abort', abortHandler);
    }
    
    const cleanup = () => {
      if (options?.signal) options.signal.removeEventListener('abort', abortHandler);
    };

    const job: any = {
      resolve: (val: any) => { cleanup(); resolve(val); },
      reject: (err: any) => { cleanup(); reject(err); }
    };
    if (options?.onProgress) {
      job.onProgress = options.onProgress;
    }
    pendingJobs.set(id, job);
    
    worker.postMessage({ type: 'task', id, taskName, params });
  });
}
