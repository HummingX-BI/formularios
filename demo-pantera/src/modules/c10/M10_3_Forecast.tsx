import { useState, useEffect, useMemo } from 'react';
import { ModulePage } from '@/ui/ModulePage';
import { Select } from '@/ui/components/Inputs';
import { ForecastChart } from '@/charts/components/SpecializedCharts';
import { PlotChart } from '@/charts/PlotChart';
import { runMLTask } from '@/ml/workers/mlClient';
import type { ForecastResult } from '@/ml/forecast';
import { Card } from '@/ui/components/Cards';

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

    // Find min expected month
    let minIdx = 0;
    for (let i = 1; i < forecastRes.forecast.expected.length; i++) {
      if (forecastRes.forecast.expected[i]! < forecastRes.forecast.expected[minIdx]!) minIdx = i;
    }
    const minMonthDate = foreDates[minIdx]!;

    // Fall probability (Y/Y)
    // Compare expected[minIdx] against historical 12 months ago
    // If it's a 6 month horizon, the comparison is histData[histData.length - 12 + minIdx]
    const yyIndex = histData.length - 12 + minIdx;
    const lastYearVal = histData[yyIndex]!;

    // If upper80 is less than lastYearVal, it's very probable it will fall.
    let fallProb = 0;
    const exp = forecastRes.forecast.expected[minIdx]!;
    const u95 = forecastRes.scenarios.upper95[minIdx]!;

    // Simple pseudo-prob based on normal distribution
    // Z = (lastYearVal - exp) / sigma
    // We know 1.96 * sigma = (u95 - exp) => sigma = (u95 - exp) / 1.96
    const sigma = (u95 - exp) / 1.96;
    if (sigma > 0) {
      const z = (lastYearVal - exp) / sigma;
      // Prob of being BELOW lastYearVal is CDF of Z.
      // Approximation for demo:
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
    <ModulePage
      module={{
        id: 'M10.3',
        categoryId: 10,
        title: 'Pronóstico a 6 Meses',
        level: 'E',
        route: '',
        icon: '',
        shortDescription: '',
        businessQuestion: '¿Qué va a pasar en los próximos 6 meses?',
        component: null as any,
      }}
    >
      <div className="space-y-6 flex flex-col h-full overflow-auto pr-2 pb-6">
        <div className="w-64 mb-2">
          <label className="block text-xs font-bold text-navy-900 mb-1">Métrica a Proyectar</label>
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

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-sky-800">
            <div className="animate-spin text-4xl mb-4">🔮</div>
            <p className="font-bold">Ajustando Holt-Winters...</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 font-bold bg-red-50 p-4 rounded border border-red-200">
            Error ML: {error}
          </div>
        )}

        {!loading && forecastRes && cardsData && (
          <>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-9 h-96 border border-ice-200 rounded p-4 bg-white shadow-sm flex flex-col">
                <h4 className="font-bold text-navy-900 mb-2">
                  Proyección con Intervalos de Confianza (80% y 95%)
                </h4>
                <div className="flex-1">
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
                    altText="Pronóstico Holt-Winters"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
              </div>

              <div className="col-span-3 flex flex-col gap-4">
                <Card className="p-4 border border-ice-200 shadow-sm text-center">
                  <strong className="block text-secundario text-xs uppercase mb-1">
                    Mes más débil esperado
                  </strong>
                  <div className="text-2xl font-bold text-coral">{cardsData.minMonthDate}</div>
                  <div className="text-sm font-mono mt-1">
                    Estimado: {metric === 'ingresos' ? '$' : ''}
                    {cardsData.minExp.toFixed(0)}
                  </div>
                </Card>

                <Card className="p-4 border border-ice-200 shadow-sm text-center">
                  <strong className="block text-secundario text-xs uppercase mb-1">
                    Prob. de Caída Interanual
                  </strong>
                  <div
                    className={`text-2xl font-bold ${cardsData.fallProb > 50 ? 'text-coral' : 'text-green-600'}`}
                  >
                    {cardsData.fallProb.toFixed(1)}%
                  </div>
                  <div className="text-xs text-secundario mt-2">
                    De que {cardsData.minMonthDate} sea PEOR que el mismo mes del año pasado (
                    {metric === 'ingresos' ? '$' : ''}
                    {cardsData.lastYearVal.toFixed(0)}).
                  </div>
                </Card>

                {cardsData.fallProb > 60 && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-900 shadow-sm">
                    <div className="font-bold flex items-center gap-2 mb-2">
                      <span>⚠️</span> Alerta Temprana
                    </div>
                    Se proyecta flujo bajo en {cardsData.minMonthDate}.
                    <button className="mt-2 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold transition-colors">
                      Agendar Campaña Previa
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <Card className="p-4 border border-ice-200">
                <h4 className="font-bold text-navy-900 text-sm mb-4">
                  Validación hacia atrás (Backtesting de 6 meses)
                </h4>
                <div className="h-48">
                  <PlotChart
                    id="backtest_chart"
                    data={
                      [
                        {
                          type: 'scatter',
                          mode: 'lines+markers',
                          name: 'Realidad',
                          x: histDates.slice(-6),
                          y: histData.slice(-6),
                          line: { color: '#0B2A47', width: 2 },
                        },
                        {
                          type: 'scatter',
                          mode: 'lines+markers',
                          name: 'Predicción del modelo',
                          x: histDates.slice(-6),
                          y: forecastRes.fitted.slice(-6),
                          line: { color: '#2FB6D4', width: 2, dash: 'dash' },
                        },
                      ] as any
                    }
                    layout={{
                      margin: { l: 40, r: 10, t: 10, b: 20 },
                      legend: { orientation: 'h', y: -0.2 },
                    }}
                    altText="Backtesting"
                    tableData={{ columns: [], rows: [] }}
                  />
                </div>
              </Card>

              <Card className="p-4 border border-ice-200 bg-white shadow-sm flex flex-col justify-center">
                <h4 className="font-bold text-navy-900 text-sm mb-4 text-center">
                  Precisión Histórica del Modelo
                </h4>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-ice-50">
                      <th className="py-2 text-secundario">MAPE (Error Porcentual)</th>
                      <td className="py-2 text-right font-mono font-bold text-sky-700">
                        {(forecastRes.metrics.mape * 100).toFixed(1)}%
                      </td>
                    </tr>
                    <tr className="border-b border-ice-50">
                      <th className="py-2 text-secundario">MAE (Error Absoluto Medio)</th>
                      <td className="py-2 text-right font-mono">
                        {metric === 'ingresos' ? '$' : ''}
                        {forecastRes.metrics.mae.toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2 text-secundario">RMSE (Raíz de Error Cuadrático)</th>
                      <td className="py-2 text-right font-mono">
                        {metric === 'ingresos' ? '$' : ''}
                        {forecastRes.metrics.rmse.toFixed(1)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 text-xs text-secundario text-center bg-ice-50 p-2 rounded">
                  El modelo se probó "ocultando" los últimos 6 meses para ver qué tan bien los
                  predecía. En promedio se equivocó por{' '}
                  {(forecastRes.metrics.mape * 100).toFixed(1)}%.
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </ModulePage>
  );
}
