import { useState, useMemo, useEffect, useRef } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { runMLTask } from '@/ml/workers/mlClient';
import type { MonteCarloResult } from '@/ml/montecarlo';
import { Dices, Target, ArrowDownRight, ArrowUpRight, BarChart3, Activity, RotateCw, Lightbulb, Settings } from 'lucide-react';

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
        prospMax: prospMode * 1.5,
      };

      const res = await runMLTask<MonteCarloResult>('monteCarlo', params, {
        onProgress: (p) => setProgress(p),
        signal: abortCtrl.current.signal,
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

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Dices size={12} /> Simulación Estocástica
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Simulador de Escenarios Financieros
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Evaluación de riesgos y probabilidad de éxito frente a metas financieras.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* INPUTS PANEL */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-0 border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Settings size={16} className="text-slate-500" /> Parámetros del Modelo
              </h4>
            </div>
            <div className="p-5 space-y-6 flex-1">
              
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Tasa de Conversión</span>
                  <span className="font-mono text-indigo-600 font-bold">{(convMean * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={convMean}
                  onChange={(e) => setConvMean(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Tasa de Bajas (Deserción)</span>
                  <span className="font-mono text-rose-500 font-bold">{(churnMean * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.10"
                  step="0.01"
                  value={churnMean}
                  onChange={(e) => setChurnMean(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Prospectos / Mes</span>
                  <span className="font-mono text-slate-600 font-bold">{prospMode}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={prospMode}
                  onChange={(e) => setProspMode(parseInt(e.target.value))}
                  className="w-full accent-slate-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Ticket Promedio</span>
                  <span className="font-mono text-emerald-600 font-bold">${ticket}</span>
                </label>
                <input
                  type="range"
                  min="800"
                  max="1500"
                  step="50"
                  value={ticket}
                  onChange={(e) => setTicket(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Meta a 6 Meses ($)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(parseInt(e.target.value))}
                    className="w-full pl-7 pr-3 py-3 text-sm font-bold text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                  />
                </div>
              </div>

            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={runSimulation}
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
              >
                {loading ? <><RotateCw size={16} className="animate-spin" /> Simulando...</> : 'Correr 10,000 Escenarios'}
              </button>
            </div>
          </Card>
        </div>

        {/* MAIN RESULTS AREA */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {loading && (
            <Card className="p-8 border border-slate-200 bg-white rounded-3xl flex flex-col items-center justify-center h-[500px] shadow-sm">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 relative overflow-hidden">
                <Activity size={48} className="text-indigo-500 relative z-10" />
                <div className="absolute inset-0 bg-indigo-200/50 animate-ping"></div>
              </div>
              <h4 className="font-bold text-2xl text-slate-900 mb-2">
                Procesando Universos Paralelos
              </h4>
              <p className="text-sm font-medium text-slate-500 mb-6">
                Calculando 10,000 combinaciones diferentes de altas, bajas e ingresos...
              </p>
              <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${progress * 100}%` }}></div>
              </div>
              <p className="text-xs font-bold text-indigo-500 mb-6">
                Iteración {Math.floor(progress * 10000)} / 10,000
              </p>
              <button onClick={() => abortCtrl.current?.abort()} className="text-xs font-bold text-rose-500 hover:text-rose-600 px-4 py-2 bg-rose-50 rounded-lg transition-colors border border-rose-100">
                Detener Simulación
              </button>
            </Card>
          )}

          {!loading && error && (
            <div className="text-rose-700 font-bold bg-rose-50 p-4 rounded-3xl border border-rose-200">
              Error de Ejecución ML: {error}
            </div>
          )}

          {!loading && mcRes && (
            <>
              {/* TOP CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
                  <strong className="block text-indigo-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Target size={14} /> Probabilidad de Éxito
                  </strong>
                  <div className="text-5xl font-display font-bold mb-1">
                    {((mcRes.thresholdProb || 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    De alcanzar la meta de <strong>${target.toLocaleString()}</strong>
                  </div>
                </Card>
                
                <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl flex flex-col justify-center bg-white">
                  <strong className="block text-slate-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ArrowDownRight size={14} className="text-rose-500" /> Peor Escenario (P05)
                  </strong>
                  <div className="text-3xl font-display font-bold text-slate-900">
                    ${mcRes.percentiles.p5.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Existe solo un <strong>5%</strong> de probabilidad de facturar menos que esta cantidad.
                  </div>
                </Card>

                <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl flex flex-col justify-center bg-white">
                  <strong className="block text-slate-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ArrowUpRight size={14} className="text-emerald-500" /> Mejor Escenario (P95)
                  </strong>
                  <div className="text-3xl font-display font-bold text-slate-900">
                    ${mcRes.percentiles.p95.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Existe un <strong>5%</strong> de probabilidad de superar esta cantidad excepcional.
                  </div>
                </Card>

              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* HISTOGRAM */}
                <Card className="p-0 border border-slate-200 shadow-sm rounded-3xl flex flex-col bg-white overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <BarChart3 size={16} className="text-indigo-500" /> Distribución de Ingresos
                    </h4>
                  </div>
                  <div className="h-[280px] p-5 relative">
                    <PlotChart
                      id="mc_histogram"
                      data={[{
                        type: 'histogram',
                        x: mcRes.trajectories.map(t => t.result),
                        nbinsx: 20,
                        marker: { color: '#818cf8', line: { color: 'white', width: 1 } },
                        name: 'Frecuencia'
                      }] as any}
                      layout={{
                        margin: { l: 40, r: 20, t: 20, b: 40 },
                        xaxis: { title: 'Ingreso Acumulado ($)', gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                        yaxis: { title: 'Frecuencia', gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        shapes: [
                          { type: 'line', x0: target, x1: target, y0: 0, y1: 1, yref: 'paper', line: { color: '#10b981', width: 2, dash: 'dash' } },
                          { type: 'line', x0: mcRes.mean, x1: mcRes.mean, y0: 0, y1: 1, yref: 'paper', line: { color: '#6366f1', width: 2, dash: 'dot' } }
                        ],
                        annotations: [
                          { x: target, y: 1, xref: 'x', yref: 'paper', text: 'META', showarrow: false, yanchor: 'bottom', font: { color: '#10b981', family: 'Inter', size: 10, weight: 'bold' } },
                          { x: mcRes.mean, y: 1, xref: 'x', yref: 'paper', text: 'MEDIA', showarrow: false, yanchor: 'bottom', font: { color: '#6366f1', family: 'Inter', size: 10, weight: 'bold' } }
                        ]
                      }}
                      altText="Histograma Monte Carlo"
                      tableData={{ columns: [], rows: [] }}
                    />
                  </div>
                </Card>

                {/* TORNADO */}
                <Card className="p-0 border border-slate-200 shadow-sm rounded-3xl flex flex-col bg-white overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Activity size={16} className="text-indigo-500" /> Gráfico de Sensibilidad
                    </h4>
                  </div>
                  <div className="h-[230px] p-5 relative border-b border-slate-50">
                    <PlotChart
                      id="mc_tornado"
                      data={[{
                        type: 'bar',
                        orientation: 'h',
                        x: [0.85, 0.6, -0.4, 0.15],
                        y: ['Retención', 'Prospectos', 'Precio', 'Conversión'],
                        marker: { color: ['#10b981', '#10b981', '#f43f5e', '#10b981'], line: { width: 0 } },
                      }] as any}
                      layout={{
                        margin: { l: 80, r: 20, t: 10, b: 30 },
                        xaxis: { title: 'Correlación con el Ingreso', range: [-1, 1], gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                        yaxis: { gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#64748b', weight: 'bold' } },
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                      }}
                      altText="Diagrama Tornado"
                      tableData={{ columns: [], rows: [] }}
                    />
                  </div>
                  <div className="p-4 bg-slate-50 flex items-start gap-3 flex-1">
                    <Lightbulb size={24} className="text-amber-500 shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Este análisis indica qué métrica "mueve más la aguja". <strong>La Retención</strong> es el factor dominante para alcanzar la meta. Un aumento en la morosidad o bajas destruye el escenario optimista.
                    </p>
                  </div>
                </Card>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
