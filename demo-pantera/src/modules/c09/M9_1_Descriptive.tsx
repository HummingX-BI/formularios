import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import {
  mean,
  median,
  mode,
  variance,
  stdDev,
  range,
  iqr,
  coefficientOfVariation,
  skewness,
  kurtosis,
  histogramFD,
  kernelDensity,
} from '@/stats/descriptive';
import { kaplanMeier } from '@/ml/kaplanMeier';

type VarKey = 'edad' | 'tiempoNivel' | 'asistencia' | 'ticket' | 'ltv' | 'retraso';

export default function M9_1_Descriptive() {
  const dataset = useDataset();
  const [variable, setVariable] = useState<VarKey>('edad');
  const [group, setGroup] = useState('none');

  const { stats, chartData, interpretation } = useMemo(() => {
    let raw: number[] = [];

    // Simulate metrics per variable
    if (variable === 'edad') {
      raw = dataset.students.map((s) => {
        const bd = new Date(s.birthDate);
        return (Date.now() - bd.getTime()) / (1000 * 3600 * 24 * 365.25);
      });
    } else if (variable === 'asistencia') {
      raw = dataset.students.map(() => 50 + Math.random() * 50); // mock
    } else if (variable === 'ticket') {
      raw = dataset.students.map(() => 800 + Math.random() * 1000); // mock
    } else if (variable === 'ltv') {
      // Simulate LTV using kaplan-meier median
      const km = kaplanMeier(
        dataset.students.map(
          (s) => (Date.now() - new Date(s.enrollmentDate).getTime()) / (1000 * 3600 * 24 * 30),
        ),
        dataset.students.map((s) => s.status === 'churned'),
        36,
      );
      const medTime = km.rmst36;
      raw = dataset.students.map(() => (800 + Math.random() * 1000) * medTime);
    } else if (variable === 'retraso') {
      raw = dataset.students.map(() => Math.max(0, Math.random() * 20 - 5));
    } else if (variable === 'tiempoNivel') {
      // "Para permanencia: usar solo bajas observadas"
      const drops = dataset.students.filter((s) => s.status === 'churned');
      raw = drops.map(
        (s) =>
          (new Date(s.churnDate!).getTime() - new Date(s.enrollmentDate).getTime()) /
          (1000 * 3600 * 24 * 30),
      );
    }

    if (raw.length === 0) raw = [0];

    // Stats
    const m = mean(raw);
    const med = median(raw);
    const sk = skewness(raw);

    const statsObj = {
      n: raw.length,
      mean: m,
      median: med,
      mode: mode(raw.map(Math.round)).slice(0, 3).join(', ') || '-',
      variance: variance(raw),
      stdDev: stdDev(raw),
      range: range(raw),
      iqr: iqr(raw),
      cv: coefficientOfVariation(raw),
      skew: sk,
      kurtosis: kurtosis(raw),
    };

    // Histogram and KDE
    const hist = histogramFD(raw);
    const xVals: number[] = [];
    for (let i = 0; i <= 50; i++) xVals.push(hist.min + (i * (hist.max - hist.min)) / 50);
    const kdeVals = kernelDensity(raw, xVals);

    const chartData = [
      {
        type: 'histogram',
        x: raw,
        histnorm: 'probability density',
        name: 'Datos',
        marker: { color: '#7CC4E8' },
        opacity: 0.7,
      },
      {
        type: 'scatter',
        mode: 'lines',
        x: xVals,
        y: kdeVals,
        name: 'KDE',
        line: { color: '#0B2A47', width: 2 },
      },
    ];

    let interp = 'La distribución es aproximadamente simétrica.';
    if (sk > 0.5)
      interp =
        'La distribución tiene sesgo positivo (cola larga a la derecha): hay pocos alumnos con valores muy altos que tiran del promedio hacia arriba.';
    else if (sk < -0.5)
      interp =
        'La distribución tiene sesgo negativo (cola larga a la izquierda): la mayoría se concentra en valores altos con unos pocos valores muy bajos.';

    if (variable === 'tiempoNivel') {
      interp +=
        ' Nota: Solo se incluyen bajas observadas. Para analizar alumnos activos sin sesgo a la baja, usamos Kaplan-Meier (censura a la derecha).';
    }

    return { data: raw, stats: statsObj, chartData, interpretation: interp };
  }, [dataset, variable, group]);

  return (
    <LabLayout
      title="Estadística Descriptiva"
      businessQuestion="¿Cómo se distribuyen mis alumnos y mis cifras?"
      description="Un resumen matemático de un conjunto de datos que permite entender su punto central (media, mediana), su dispersión (desviación, rango) y su forma (sesgo)."
      formulas={`Media = Σx / n\nVarianza = Σ(x - μ)² / (n - 1)\nSesgo = Σ((x - μ)/σ)³ / n`}
      assumptions="Los estimadores muestrales (varianza, desviación) usan corrección de Bessel (n-1). El cálculo de densidad KDE usa una regla empírica de Silverman."
      findings={
        <div className="space-y-4">
          <div className="flex gap-4 mb-4 bg-ice-50 p-2 rounded">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">Variable</label>
              <Select
                options={[
                  { label: 'Edad (años)', value: 'edad' },
                  { label: 'Tiempo en la escuela (meses)', value: 'tiempoNivel' },
                  { label: 'Asistencia (%)', value: 'asistencia' },
                  { label: 'Ticket Mensual ($)', value: 'ticket' },
                  { label: 'Valor de Vida - LTV ($)', value: 'ltv' },
                  { label: 'Retraso de Pago (días)', value: 'retraso' },
                ]}
                value={variable}
                onChange={(e) => setVariable(e.target.value as VarKey)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-navy-900 mb-1">
                Agrupar (Próximamente)
              </label>
              <Select
                options={[{ label: 'Sin agrupar', value: 'none' }]}
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className="h-64 border border-ice-200 rounded p-2">
            <PlotChart
              id="desc_hist"
              data={chartData as any}
              layout={{
                margin: { l: 40, r: 20, t: 10, b: 30 },
                bargap: 0.05,
                barmode: 'overlay',
                shapes: [
                  {
                    type: 'line',
                    x0: stats.mean,
                    x1: stats.mean,
                    y0: 0,
                    y1: 1,
                    yref: 'paper',
                    line: { color: '#F43F5E', width: 2, dash: 'dot' },
                  },
                  {
                    type: 'line',
                    x0: stats.median,
                    x1: stats.median,
                    y0: 0,
                    y1: 1,
                    yref: 'paper',
                    line: { color: '#10B981', width: 2, dash: 'dash' },
                  },
                ],
                annotations: [
                  {
                    x: stats.mean,
                    y: 0.95,
                    yref: 'paper',
                    text: `Media: ${stats.mean.toFixed(1)}`,
                    showarrow: false,
                    font: { color: '#F43F5E' },
                    xanchor: 'left',
                    xshift: 5,
                  },
                  {
                    x: stats.median,
                    y: 0.85,
                    yref: 'paper',
                    text: `Mediana: ${stats.median.toFixed(1)}`,
                    showarrow: false,
                    font: { color: '#10B981' },
                    xanchor: 'right',
                    xshift: -5,
                  },
                ],
              }}
              altText="Histograma y estimación de densidad KDE"
              tableData={{ columns: [], rows: [] }}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-900 mb-4">
            <strong>Interpretación:</strong> {interpretation}
          </div>

          <table className="w-full text-left text-sm border-collapse">
            <tbody>
              <tr className="border-b border-ice-100">
                <th className="py-1 text-secundario">N (Muestra)</th>
                <td className="py-1 font-bold">{stats.n}</td>
                <th className="py-1 text-secundario">Rango</th>
                <td className="py-1">{stats.range.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-ice-100">
                <th className="py-1 text-secundario">Media (μ)</th>
                <td className="py-1 font-bold">{stats.mean.toFixed(2)}</td>
                <th className="py-1 text-secundario">Rango Intercuartil (RIC)</th>
                <td className="py-1">{stats.iqr.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-ice-100">
                <th className="py-1 text-secundario">Mediana</th>
                <td className="py-1 font-bold text-green-600">{stats.median.toFixed(2)}</td>
                <th className="py-1 text-secundario">Coef. Variación (CV)</th>
                <td className="py-1">{(stats.cv * 100).toFixed(1)}%</td>
              </tr>
              <tr className="border-b border-ice-100">
                <th className="py-1 text-secundario">Moda</th>
                <td className="py-1">{stats.mode}</td>
                <th className="py-1 text-secundario">Sesgo (Skewness)</th>
                <td className="py-1 font-bold text-navy-900">{stats.skew.toFixed(2)}</td>
              </tr>
              <tr>
                <th className="py-1 text-secundario">Desviación (σ)</th>
                <td className="py-1">{stats.stdDev.toFixed(2)}</td>
                <th className="py-1 text-secundario">Curtosis</th>
                <td className="py-1">{stats.kurtosis.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
      action={
        <p className="text-sm text-navy-900">
          Si la media y la mediana son muy distintas (alto sesgo),{' '}
          <strong>deja de usar el promedio para tomar decisiones</strong>. Por ejemplo, un LTV
          promedio alto puede estar inflado por un puñado de alumnos muy antiguos, mientras que la
          mitad de tus alumnos (la mediana) genera mucho menos ingreso real.
        </p>
      }
    />
  );
}
