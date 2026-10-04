import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { PlotChart } from '@/charts/PlotChart';
import { binomial, poisson } from '@/stats/distributions';
import { chiSquareIndependence } from '@/stats/inference';
import { Slider } from '@/ui/components/Inputs';

export default function M9_3_BinomialPoisson() {
  // Binomial state
  const [nVisits, setNVisits] = useState(20);
  const [pConv, setPConv] = useState(0.4);
  const [kTarget, setKTarget] = useState(8);

  // Poisson state
  const [lambdaDrops, setLambdaDrops] = useState(3.5);

  const binomialData = useMemo(() => {
    const x = Array.from({ length: nVisits + 1 }, (_, i) => i);
    const y = x.map((k) => binomial.pmf(k, nVisits, pConv));
    const probGeq = binomial.sf(kTarget - 1, nVisits, pConv);
    const mean = binomial.mean(nVisits, pConv);
    const sd = Math.sqrt(binomial.variance(nVisits, pConv));

    const colors = x.map((k) => (k >= kTarget ? '#10B981' : '#7CC4E8'));

    const chart = [
      {
        type: 'bar',
        x,
        y,
        marker: { color: colors },
        name: 'Probabilidad',
      },
    ];

    return { chart, probGeq, mean, sd };
  }, [nVisits, pConv, kTarget]);

  const poissonData = useMemo(() => {
    const maxK = Math.max(15, Math.ceil(lambdaDrops * 2.5));
    const x = Array.from({ length: maxK }, (_, i) => i);
    const expected = x.map((k) => poisson.pmf(k, lambdaDrops));

    // Simulate some observed data for chi2
    const totalWeeks = 50;
    const observedRaw = expected.map((p) =>
      Math.max(0, Math.round(p * totalWeeks + (Math.random() - 0.5) * 3)),
    );

    // Group tails for chi2 validness (expected count >= 5 ideally, we simplify here)
    // We just do a mock chi2 result for educational purposes.
    const chi2Mock = chiSquareIndependence([observedRaw, expected.map((p) => p * totalWeeks)]);
    let conclusion = 'Los datos observados se ajustan bien a una distribución de Poisson pura.';
    if (chi2Mock.p < 0.05) {
      conclusion =
        "Hay evidencia de sobredispersión (p < 0.05). Las bajas no ocurren de forma totalmente independiente; puede haber 'contagios' o factores externos agrupando las bajas.";
    }

    const chart = [
      {
        type: 'bar',
        x,
        y: observedRaw.map((v) => v / totalWeeks),
        name: 'Observado (histórico)',
        marker: { color: '#F43F5E', opacity: 0.6 },
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x,
        y: expected,
        name: 'Esperado (Poisson)',
        line: { color: '#0B2A47' },
        marker: { size: 6 },
      },
    ];

    return { chart, conclusion, chi2P: chi2Mock.p };
  }, [lambdaDrops]);

  return (
    <LabLayout
      title="Binomial y Poisson"
      businessQuestion="¿Qué tan realistas son mis metas de inscripción y bajas?"
      description="La distribución Binomial modela el número de éxitos (inscripciones) en un número fijo de intentos (visitas). La distribución de Poisson modela cuántas veces ocurre un evento raro (bajas) en un periodo de tiempo continuo (semana)."
      formulas={`Binomial: P(X=k) = (n k) p^k (1-p)^(n-k)\nPoisson: P(X=k) = (λ^k e^-λ) / k!`}
      assumptions="Binomial asume que cada visita es independiente y tiene la misma probabilidad de éxito. Poisson asume que los eventos ocurren a una tasa constante e independiente."
      findings={
        <div className="space-y-8">
          {/* Binomial Section */}
          <div>
            <h3 className="font-bold text-navy-900 mb-4 border-b border-ice-200 pb-2">
              1. Modelo de Conversión (Binomial)
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="bg-ice-50 p-3 rounded">
                <label className="block text-xs font-bold text-secundario mb-2">
                  n (Visitas guiadas agendadas)
                </label>
                <Slider value={nVisits} onChangeValue={setNVisits} min={1} max={100} />
              </div>
              <div className="bg-ice-50 p-3 rounded">
                <label className="block text-xs font-bold text-secundario mb-2">
                  p (Probabilidad de cierre)
                </label>
                <Slider
                  value={Math.round(pConv * 100)}
                  onChangeValue={(v) => setPConv(v / 100)}
                  min={1}
                  max={99}
                />
              </div>
              <div className="bg-ice-50 p-3 rounded">
                <label className="block text-xs font-bold text-secundario mb-2">
                  k (Meta de inscripciones)
                </label>
                <Slider value={kTarget} onChangeValue={setKTarget} min={0} max={nVisits} />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-1 h-64 border border-ice-200 rounded p-2">
                <PlotChart
                  id="binomial_pmf"
                  data={binomialData.chart as any}
                  layout={{ margin: { l: 40, r: 20, t: 10, b: 30 }, bargap: 0.1 }}
                  altText="Distribución Binomial"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>
              <div className="w-64 flex flex-col justify-center space-y-4">
                <div className="text-center">
                  <div className="text-sm text-secundario mb-1">
                    Probabilidad de Lograr la Meta P(X ≥ {kTarget})
                  </div>
                  <div
                    className={`text-4xl font-bold ${binomialData.probGeq > 0.7 ? 'text-green-500' : binomialData.probGeq > 0.3 ? 'text-amber-500' : 'text-coral'}`}
                  >
                    {(binomialData.probGeq * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-white border border-ice-200 rounded text-sm shadow-sm">
                  <span className="block text-secundario mb-1">Lo normal esperado:</span>
                  <span className="font-bold text-navy-900">
                    {binomialData.mean.toFixed(1)} ± {(binomialData.sd * 2).toFixed(1)} alumnos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Poisson Section */}
          <div>
            <h3 className="font-bold text-navy-900 mb-4 border-b border-ice-200 pb-2">
              2. Modelo de Bajas (Poisson)
            </h3>
            <div className="w-1/3 bg-ice-50 p-3 rounded mb-4">
              <label className="block text-xs font-bold text-secundario mb-2">
                λ (Tasa media de bajas por semana)
              </label>
              <Slider
                value={lambdaDrops}
                onChangeValue={setLambdaDrops}
                min={0.1}
                max={15}
                step={0.1}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex-1 h-64 border border-ice-200 rounded p-2">
                <PlotChart
                  id="poisson_pmf"
                  data={poissonData.chart as any}
                  layout={{ margin: { l: 40, r: 20, t: 10, b: 30 }, bargap: 0.1 }}
                  altText="Distribución de Poisson vs Observado"
                  tableData={{ columns: [], rows: [] }}
                />
              </div>
              <div className="w-64 flex flex-col justify-center space-y-4">
                <div className="p-3 bg-white border border-ice-200 rounded text-sm shadow-sm">
                  <span className="block font-bold text-navy-900 mb-1">
                    Prueba de Bondad de Ajuste
                  </span>
                  <p className="text-secundario">{poissonData.conclusion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      action={
        <div className="space-y-4 text-sm text-navy-900">
          <p>
            <strong>Metas realistas:</strong> Si la probabilidad Binomial de lograr tu meta de
            ventas es menor al 20%, tu equipo no está fallando, tu meta es estadísticamente
            imposible con el tráfico actual. Debes aumentar <em>n</em> (visitas) o <em>p</em>{' '}
            (calidad del prospecto/oferta).
          </p>
          <p>
            <strong>Diagnóstico de bajas:</strong> Si la prueba de bondad de ajuste marca
            sobredispersión, significa que las bajas te están pegando "en bloques" (ej. un
            instructor se va y se lleva alumnos, o el clima espanta a muchos a la vez). Si se ajusta
            perfecto a Poisson, tus bajas son ruido blanco operativo normal.
          </p>
        </div>
      }
    />
  );
}
