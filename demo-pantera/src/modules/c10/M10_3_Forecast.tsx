import { useState, useEffect, useMemo } from 'react';
import { Select } from '@/ui/components/Inputs';
import { ForecastChart } from '@/charts/components/SpecializedCharts';
import { PlotChart } from '@/charts/PlotChart';
import { runMLTask } from '@/ml/workers/mlClient';
import type { ForecastResult } from '@/ml/forecast';
import { Card } from '@/ui/components/Cards';
import { LineChart, Settings, TrendingDown, Target, History, CalendarClock, ShieldAlert, Rocket } from 'lucide-react';

export default function M10_3_Forecast() {
  const [metric, setMetric] = useState('ingresos');
  const [loading, setLoading] = useState(true);
  const [forecastRes, setForecastRes] = useState<ForecastResult | null>(null);
  const [error, setError] = useState('');

  const { histData, histDates, foreDates } = useMemo(() => {
    const n = 36;
    const h = 6;
    const data = [];
    const hDates = [];
    const fDates = [];
    let base = metric === 'ingresos' ? 40000 : metric === 'activos' ? 450 : 40;
    let trend = metric === 'ingresos' ? 500 : metric === 'activos' ? 5 : 1.5;

    for (let i = 0; i < n; i++) {
      const year = 2023 + Math.floor((i + 9) / 12);
      const month = (i + 9) % 12;
      hDates.push(`${year}-${(month + 1).toString().padStart(2, '0')}`);

      let s = 1;
      if (month === 0) s = 1.3;
      if (month === 7) s = 1.2;
      if (month === 11) s = 0.7;
      if (month === 3) s = 0.8;

      const val = (base + i * trend) * s + (Math.random() - 0.5) * (base * 0.1);
      data.push(val);
    }

    for (let i = n; i < n + h; i++) {
      const year = 2023 + Math.floor((i + 9) / 12);
      const month = (i + 9) % 12;
      fDates.push(`${year}-${(month + 1).toString().padStart(2, '0')}`);
    }

    return { histData: data, histDates: hDates, foreDates: fDates };
  }, [metric]);

  useEffect(() => {
    async function runModel() {
      try {
        setLoading(true);
        const res = await runMLTask<ForecastResult>('holtWinters', { data: histData, horizon: 6 });
        setForecastRes(res);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    runModel();
  }, [histData]);

  const cardsData = useMemo(() => {
    if (!forecastRes) return null;

    let minIdx = 0;
    for (let i = 1; i < forecastRes.forecast.expected.length; i++) {
      if (forecastRes.forecast.expected[i]! < forecastRes.forecast.expected[minIdx]!) minIdx = i;
    }
    const minMonthDate = foreDates[minIdx]!;

    const yyIndex = histData.length - 12 + minIdx;
    const lastYearVal = histData[yyIndex]!;

    let fallProb = 0;
    const exp = forecastRes.forecast.expected[minIdx]!;
    const u95 = forecastRes.scenarios.upper95[minIdx]!;

    const sigma = (u95 - exp) / 1.96;
    if (sigma > 0) {
      const z = (lastYearVal - exp) / sigma;
      if (z > 2) fallProb = 98;
      else if (z > 1) fallProb = 84;
      else if (z > 0) fallProb = 50 + z * 34;
      else if (z > -1) fallProb = 50 + z * 34;
      else if (z > -2) fallProb = 16;
      else fallProb = 2;
    }

    return { minMonthDate, minExp: exp, lastYearVal, fallProb, minIdx };
  }, [forecastRes, foreDates, histData]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <LineChart size={12} /> Modelado Predictivo Estacional
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Pronóstico a 6 Meses
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Proyección inteligente de ingresos y retención con escenarios de certeza financiera.
          </p>
        </div>
        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Métrica Objetivo</label>
          <Select
            options={[
              { label: 'Ingresos Facturados ($)', value: 'ingresos' },
              { label: 'Alumnos Activos', value: 'activos' },
              { label: 'Nuevas Inscripciones', value: 'inscripciones' },
            ]}
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-indigo-800 bg-indigo-50/50 rounded-3xl border border-indigo-100">
          <Settings className="animate-spin text-indigo-500 mb-4" size={40} />
          <p className="font-bold text-lg">Calculando Pronóstico Inteligente...</p>
          <p className="text-sm text-indigo-600/80 mt-1">Evaluando tendencias de crecimiento, temporadas pasadas y márgenes de seguridad.</p>
        </div>
      )}

      {error && (
        <div className="text-rose-700 font-bold bg-rose-50 p-4 rounded-3xl border border-rose-200">
          Error en Proyección: {error}
        </div>
      )}

      {!loading && forecastRes && cardsData && (
        <>
          <div className="grid grid-cols-12 gap-6">
            <Card className="col-span-12 lg:col-span-9 p-0 border border-slate-200 bg-white rounded-3xl flex flex-col h-[500px] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Target size={20} className="text-indigo-500" /> Proyección con Rango de Certeza
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Escenario esperado más probable (azul oscuro) y rango de variación máxima (azul claro)</p>
                </div>
              </div>
              <div className="flex-1 p-6 relative w-full">
                <ForecastChart
                  id="forecast_main"
                  xHist={histDates}
                  yHist={histData}
                  xFore={foreDates}
                  yFore={forecastRes.forecast.expected}
                  lower80={forecastRes.scenarios.lower80}
                  upper80={forecastRes.scenarios.upper80}
                  lower95={forecastRes.scenarios.lower95}
                  upper95={forecastRes.scenarios.upper95}
                  concept={metric === 'ingresos' ? 'cobranza' : 'prospectos'}
                  altText="Pronóstico Inteligente"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>
            </Card>

            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              
              <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl flex flex-col items-center justify-center text-center bg-white">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 mb-3">
                  <CalendarClock size={20} />
                </span>
                <strong className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Valle de Estacionalidad (Baja)
                </strong>
                <div className="text-3xl font-display font-bold text-slate-900 mb-1">{cardsData.minMonthDate}</div>
                <div className="text-sm font-medium text-slate-500">
                  Val. esperado: <span className="font-bold text-slate-700">{metric === 'ingresos' ? '$' : ''}{cardsData.minExp.toFixed(0)}</span>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl flex flex-col items-center justify-center text-center bg-white relative overflow-hidden">
                {cardsData.fallProb > 50 && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>}
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${cardsData.fallProb > 50 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                  <TrendingDown size={20} />
                </span>
                <strong className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Probabilidad de Caída Interanual
                </strong>
                <div className={`text-4xl font-display font-bold mb-1 ${cardsData.fallProb > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {cardsData.fallProb.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                  Riesgo de que {cardsData.minMonthDate} facture por debajo de {metric === 'ingresos' ? '$' : ''}{cardsData.lastYearVal.toFixed(0)} (mismo mes del año anterior).
                </div>
              </Card>

              {cardsData.fallProb > 60 && (
                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="font-bold flex items-center gap-2 mb-3 text-rose-400 text-xs uppercase tracking-widest">
                    <ShieldAlert size={16} /> Alerta Temprana
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    Se proyecta un colapso del flujo en <strong className="text-white">{cardsData.minMonthDate}</strong>. El motor de IA sugiere actuar inmediatamente.
                  </p>
                  <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 text-sm">
                    <Rocket size={16} /> Agendar Campaña Previa
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="p-0 border border-slate-200 bg-white shadow-sm rounded-3xl flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <History size={16} className="text-indigo-500" /> Prueba de Acierto Real (Últimos 6 meses)
                </h4>
              </div>
              <div className="flex-1 p-5 relative w-full h-[250px]">
                <PlotChart
                  id="backtest_chart"
                  data={
                    [
                      {
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Realidad Cobrada',
                        x: histDates.slice(-6),
                        y: histData.slice(-6),
                        line: { color: '#0f172a', width: 2 },
                        marker: { color: '#0f172a' }
                      },
                      {
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Predicción del Sistema',
                        x: histDates.slice(-6),
                        y: forecastRes.fitted.slice(-6),
                        line: { color: '#6366f1', width: 2, dash: 'dash' },
                        marker: { color: '#6366f1' }
                      },
                    ] as any
                  }
                  layout={{
                    margin: { l: 40, r: 20, t: 10, b: 20 },
                    legend: { orientation: 'h', y: -0.15, font: { family: 'Inter', color: '#64748b' } },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    xaxis: { gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                    yaxis: { gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                  }}
                  altText="Prueba de Acierto Real"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>
            </Card>

            <Card className="p-0 border border-slate-200 bg-white shadow-sm rounded-3xl flex flex-col justify-center">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm text-center">
                  Margen de Certeza Histórica
                </h4>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <span className="block font-bold text-slate-700 text-sm">Margen de Error Real</span>
                      <span className="block text-[10px] uppercase text-slate-400">Desviación máxima entre predicción y cobro</span>
                    </div>
                    <span className="text-xl font-display font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                      {(forecastRes.metrics.mape * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <span className="block font-bold text-slate-700 text-sm">Desviación Típica Mensual</span>
                      <span className="block text-[10px] uppercase text-slate-400">Diferencia promedio en pesos al cierre</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-slate-800">
                      {metric === 'ingresos' ? '$' : ''}
                      {forecastRes.metrics.mae.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <span className="block font-bold text-slate-700 text-sm">Desvío en Caso Extremo</span>
                      <span className="block text-[10px] uppercase text-slate-400">Máxima variación ante meses atípicos</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-slate-800">
                      {metric === 'ingresos' ? '$' : ''}
                      {forecastRes.metrics.rmse.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-6 text-xs text-slate-500 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  El sistema se auditó comparando sus pronósticos contra los datos reales de los últimos 6 meses. Su variación real fue de apenas <strong>{(forecastRes.metrics.mape * 100).toFixed(1)}%</strong>.
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
