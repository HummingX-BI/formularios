import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card } from '@/ui/components/Cards';
import { useAppStore } from '@/app/store';

interface PerfMark {
  name: string;
  duration: number;
  startTime: number;
}

export default function PerfPage() {
  const [marks, setMarks] = useState<PerfMark[]>([]);
  const [memory, setMemory] = useState<any>(null);
  const seed = useAppStore(s => s.seed);

  useEffect(() => {
    // Get all performance entries
    const entries = performance.getEntriesByType('measure') as PerformanceMeasure[];
    setMarks(entries.map(e => ({
      name: e.name,
      duration: e.duration,
      startTime: e.startTime
    })));

    // Get JS Heap memory if available (Chrome/Edge)
    if ((performance as any).memory) {
      setMemory((performance as any).memory);
    }
  }, [seed]);

  const clearMarks = () => {
    performance.clearMeasures();
    performance.clearMarks();
    setMarks([]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold font-jakarta text-navy-900">Métricas de Rendimiento (Perf)</h1>
      <p className="text-secundario">
        Medición real usando <code>performance.mark</code> y <code>performance.measure</code>.
      </p>

      <Card className="p-6 bg-white border border-ice-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-navy-900">Trazas Registradas</h2>
          <button onClick={clearMarks} className="text-sm px-3 py-1 bg-ice-100 rounded text-secundario hover:bg-ice-200">
            Limpiar Trazas
          </button>
        </div>
        
        {marks.length === 0 ? (
          <div className="text-secundario text-sm italic">Navega por los módulos para registrar trazas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ice-200">
                <tr>
                  <th className="pb-2">Operación / Render</th>
                  <th className="pb-2 text-right">Duración (ms)</th>
                  <th className="pb-2 text-right">Presupuesto RNF</th>
                  <th className="pb-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => {
                  let budget = 500; // Default UI render budget
                  if (m.name.includes('Dataset') || m.name.includes('Init')) budget = 3000;
                  if (m.name.includes('ML') || m.name.includes('Simulator')) budget = 1000;
                  if (m.name.includes('Control')) budget = 200;

                  const isPass = m.duration <= budget;

                  return (
                    <tr key={i} className="border-b border-ice-50 last:border-0">
                      <td className="py-2 font-medium">{m.name}</td>
                      <td className="py-2 text-right font-mono">{m.duration.toFixed(2)}</td>
                      <td className="py-2 text-right text-secundario">{budget}</td>
                      <td className="py-2 text-center">
                        {isPass ? <span className="text-emerald-500">✅ Pasa</span> : <span className="text-coral">⚠️ Lento</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Memoria (JS Heap)</h2>
          {memory ? (
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-secundario">Límite:</span>
                <span>{(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secundario">Asignada:</span>
                <span>{(memory.totalJSHeapSize / 1048576).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secundario">Usada Activa:</span>
                <span className="font-bold text-navy-900">{(memory.usedJSHeapSize / 1048576).toFixed(2)} MB</span>
              </div>
            </div>
          ) : (
            <div className="text-secundario text-sm">API de memoria no soportada en este navegador.</div>
          )}
        </Card>

        <Card className="p-6 bg-white border border-ice-100 shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Optimización (Bundle)</h2>
          <ul className="text-sm space-y-2 text-secundario">
            <li>✅ <strong>Code Splitting:</strong> Todos los 58 módulos usan <code>React.lazy</code>.</li>
            <li>✅ <strong>Diferido:</strong> Gráficas Plotly cargadas asíncronamente en <code>PlotChart</code>.</li>
            <li>✅ <strong>Memoización:</strong> Zustand con selectores estables (useMetrics).</li>
            <li>✅ <strong>Heavy ML:</strong> Ejecutado en Web Worker simulado/real.</li>
            <li>✅ <strong>Virtualización:</strong> Agregada en tablas largas.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
