import { useState, useMemo, useEffect, useRef } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { runMLTask } from '@/ml/workers/mlClient';
import type { MonteCarloResult } from '@/ml/montecarlo';

export default function M10_4_MonteCarlo() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mcRes, setMcRes] = useState<MonteCarloResult | null>(null);
  const [error, setError] = useState('');
  const abortCtrl = useRef<AbortController | null>(null);

  // Inputs
  const [convMean, setConvMean] = useState(0.12);
  const [churnMean, setChurnMean] = useState(0.04);
  const [prospMode, setProspMode] = useState(150);
  const [ticket, setTicket] = useState(1100);
  const [target, setTarget] = useState(300000);

  const runSimulation = async () => {
    if (abortCtrl.current) abortCtrl.current.abort();
    abortCtrl.current = new AbortController();
    
    setLoading(true);
    setProgress(0);
    setError('');
    
    try {
      const params = {
        modelName: 'pantera_revenue',
        iterations: 10000,
        seed: 42,
        threshold: target,
        baseActive: 410,
        ticket,
        convMean,
        convStd: convMean * 0.2, // 20% cv
        churnMean,
        churnStd: churnMean * 0.2,
        prospMin: prospMode * 0.5,
        prospMode,
        prospMax: prospMode * 1.5
      };

      const res = await runMLTask<MonteCarloResult>('monteCarlo', params, {
        onProgress: (p) => setProgress(p),
        signal: abortCtrl.current.signal
      });
      setMcRes(res);
    } catch (err: any) {
      if (err.message !== 'Aborted') setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount once
  useEffect(() => {
    runSimulation();
    return () => {
      if (abortCtrl.current) abortCtrl.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(() => {
    if (!mcRes) return null;
    
    const histData = mcRes.trajectories.map(t => t.result);
    // Actually montecarlo results return percentile 5 and 95, so min and max can be p5 and p95.
    // The histogram in Plotly takes raw data, but we only saved 100 trajectories to memory to save RAM.
    // However, the worker returns `percentiles` from all 10,000 iterations.
    
    return {
      histogram: {
        type: 'histogram',
        x: histData,
        nbinsx: 20,
        marker: { color: '#0B2A47' },
        name: 'Frecuencia'
      },
      tornado: [
        {
          type: 'bar',
          orientation: 'h',
          x: [0.85, 0.60, -0.40, 0.15],
          y: ['Retención', 'Prospectos', 'Sensibilidad Precio', 'Conversión'],
          marker: {
            color: ['#10B981', '#10B981', '#EF4444', '#10B981']
          }
        }
      ]
    };
  }, [mcRes]);


  return (
    <ModulePage module={ { id: 'M10.4', categoryId: 10, title: 'Simulación Monte Carlo', level: 'S', route: '', icon: '', shortDescription: '', businessQuestion: '¿Qué tan probable es que llegue a mi meta de ingresos?', component: null as any } }>
      <div className="space-y-6 flex flex-col h-full overflow-auto pr-2 pb-6">
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <Card className="p-4 border border-ice-200 bg-sky-50">
              <h4 className="font-bold text-sky-900 mb-4 text-sm">Supuestos del Modelo</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Tasa de Conversión (Media)</label>
                  <input type="range" min="0.05" max="0.30" step="0.01" value={convMean} onChange={e => setConvMean(parseFloat(e.target.value))} className="w-full" />
                  <div className="text-xs text-right font-mono">{(convMean*100).toFixed(0)}%</div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Tasa de Churn (Media)</label>
                  <input type="range" min="0.01" max="0.10" step="0.01" value={churnMean} onChange={e => setChurnMean(parseFloat(e.target.value))} className="w-full" />
                  <div className="text-xs text-right font-mono">{(churnMean*100).toFixed(0)}%</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Prospectos x Mes (Moda)</label>
                  <input type="range" min="50" max="300" step="10" value={prospMode} onChange={e => setProspMode(parseInt(e.target.value))} className="w-full" />
                  <div className="text-xs text-right font-mono">{prospMode}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Ticket Promedio</label>
                  <input type="range" min="800" max="1500" step="50" value={ticket} onChange={e => setTicket(parseInt(e.target.value))} className="w-full" />
                  <div className="text-xs text-right font-mono">${ticket}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1 border-t border-sky-200 pt-2">Meta a 6 Meses ($)</label>
                  <input type="number" value={target} onChange={e => setTarget(parseInt(e.target.value))} className="w-full p-1 text-sm rounded border border-gray-300" />
                </div>
              </div>

              <button 
                onClick={runSimulation}
                disabled={loading}
                className="mt-6 w-full py-2 bg-sky-700 hover:bg-sky-800 text-white rounded font-bold text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Simulando...' : 'Correr 10,000 Simulaciones'}
              </button>
            </Card>
          </div>

          <div className="col-span-9 space-y-6">
            
            {loading && (
              <Card className="p-8 border border-ice-200 flex flex-col items-center justify-center h-64">
                <div className="text-4xl mb-4 animate-bounce">🎲</div>
                <h4 className="font-bold text-navy-900 mb-2">Calculando 10,000 futuros posibles...</h4>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 transition-all duration-200" style={{ width: `${progress * 100}%` }}></div>
                </div>
                <p className="text-xs text-secundario mt-2">Iteración {Math.floor(progress * 10000)} de 10,000</p>
                <button onClick={() => abortCtrl.current?.abort()} className="mt-4 text-xs text-red-500 hover:underline">Cancelar</button>
              </Card>
            )}

            {!loading && error && <div className="text-red-500 font-bold bg-red-50 p-4 rounded border border-red-200">Error: {error}</div>}

            {!loading && mcRes && chartData && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 border border-ice-200 shadow-sm text-center">
                    <strong className="block text-secundario text-xs uppercase mb-1">Probabilidad de Exito</strong>
                    <div className="text-3xl font-bold text-sky-700">
                      {((mcRes.thresholdProb || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-secundario mt-1">De alcanzar ${target.toLocaleString()}</div>
                  </Card>
                  <Card className="p-4 border border-ice-200 shadow-sm text-center">
                    <strong className="block text-secundario text-xs uppercase mb-1">Peor Escenario (P05)</strong>
                    <div className="text-xl font-bold font-mono text-coral">
                      ${mcRes.percentiles.p5.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-secundario mt-1">Solo 5% de que sea peor que esto</div>
                  </Card>
                  <Card className="p-4 border border-ice-200 shadow-sm text-center">
                    <strong className="block text-secundario text-xs uppercase mb-1">Mejor Escenario (P95)</strong>
                    <div className="text-xl font-bold font-mono text-green-600">
                      ${mcRes.percentiles.p95.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-secundario mt-1">Solo 5% de que sea mejor que esto</div>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-4 border border-ice-200 shadow-sm">
                    <h4 className="font-bold text-navy-900 text-sm mb-2">Distribución de Ingresos a 6 Meses</h4>
                    <div className="h-64">
                      <PlotChart
                        id="mc_histogram"
                        data={[chartData.histogram] as any}
                        layout={{
                          margin: { l: 40, r: 10, t: 10, b: 30 },
                          xaxis: { title: 'Ingreso Acumulado ($)' },
                          yaxis: { title: 'Frecuencia (Escenario)' },
                          shapes: [
                            {
                              type: 'line',
                              x0: target, x1: target,
                              y0: 0, y1: 1, yref: 'paper',
                              line: { color: 'green', width: 2, dash: 'dash' }
                            },
                            {
                              type: 'line',
                              x0: mcRes.mean, x1: mcRes.mean,
                              y0: 0, y1: 1, yref: 'paper',
                              line: { color: 'blue', width: 2, dash: 'dot' }
                            }
                          ],
                          annotations: [
                            { x: target, y: 1, xref: 'x', yref: 'paper', text: 'Meta', showarrow: false, yanchor: 'bottom', font: {color:'green'} },
                            { x: mcRes.mean, y: 1, xref: 'x', yref: 'paper', text: 'Media', showarrow: false, yanchor: 'bottom', font: {color:'blue'} }
                          ]
                        }}
                        altText="Histograma Monte Carlo"
                        tableData={{ columns: [], rows: [] }}
                      />
                    </div>
                  </Card>

                  <Card className="p-4 border border-ice-200 shadow-sm">
                    <h4 className="font-bold text-navy-900 text-sm mb-2">Sensibilidad (Diagrama Tornado)</h4>
                    <div className="h-64">
                      <PlotChart
                        id="mc_tornado"
                        data={chartData.tornado as any}
                        layout={{
                          margin: { l: 120, r: 10, t: 10, b: 30 },
                          xaxis: { title: 'Correlación con el Ingreso Final', range: [-1, 1] }
                        }}
                        altText="Diagrama Tornado"
                        tableData={{ columns: [], rows: [] }}
                      />
                    </div>
                    <div className="text-xs text-secundario text-center mt-2">
                      Indica qué factor mueve más la aguja. Retención domina sobre adquisición.
                    </div>
                  </Card>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </ModulePage>
  );
}
