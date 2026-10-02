import { useState, useRef } from 'react';
import { runMLTask } from '../../ml/workers/mlClient';

export default function MLDebugPage() {
  const [logs, setLogs] = useState<{ id: number, task: string, time: number, status: string, progress: number, result?: any }[]>([]);
  let nextId = useRef(0);

  const addLog = (task: string) => {
    const id = ++nextId.current;
    setLogs(prev => [{ id, task, time: 0, status: 'running', progress: 0 }, ...prev]);
    return id;
  };

  const updateLog = (id: number, updates: Partial<{ time: number, status: string, progress: number, result: any }>) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const runTest = async (taskName: string, params: any) => {
    const id = addLog(taskName);
    const start = performance.now();
    try {
      const result = await runMLTask(taskName, params, {
        onProgress: (p) => updateLog(id, { progress: p })
      });
      const time = performance.now() - start;
      updateLog(id, { status: 'success', progress: 1, time, result });
    } catch (e: any) {
      updateLog(id, { status: 'error', result: e.message });
    }
  };

  const runKaplan = () => runTest('kaplanMeier', { times: [10, 20, 30], events: [true, false, true], maxTime: 36 });
  const runLogistic = () => runTest('logisticRegression', { 
    X: [[1], [2], [3], [4], [10], [11], [12]], 
    y: [0, 0, 0, 0, 1, 1, 1] 
  });
  const runKmeans = () => runTest('kmeans', { 
    X: [[1, 1], [1.1, 1.1], [10, 10], [10.1, 10.1]], 
    maxK: 2, seed: 42 
  });
  const runPca = () => runTest('pca', { X: [[1, 1], [2, 2], [3, 3]] });
  const runMonteCarlo = () => runTest('monteCarlo', { modelName: 'demo', iterations: 5000 });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-navy-900">ML Worker Debug</h1>
      <div className="flex gap-4 mb-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800" onClick={runKaplan}>Test Kaplan-Meier</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800" onClick={runLogistic}>Test Logistic</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800" onClick={runKmeans}>Test K-Means</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800" onClick={runPca}>Test PCA</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-800" onClick={runMonteCarlo}>Test MonteCarlo</button>
      </div>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-lg">{log.task}</span>
              <span className={`px-2 py-1 text-xs rounded text-white ${log.status === 'success' ? 'bg-verde-agua' : log.status === 'error' ? 'bg-coral' : 'bg-amber-500'}`}>
                {log.status.toUpperCase()} ({log.time.toFixed(1)}ms)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded transition-all duration-300" style={{ width: `${log.progress * 100}%` }}></div>
            </div>
            {log.result && (
              <pre className="text-xs bg-gray-50 p-2 overflow-auto max-h-40 border border-gray-200">
                {JSON.stringify(log.result, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
