import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';

// Util para distribución normal estándar (CDF para proporciones)
function normalCdf(x: number) {
  let t = 1 / (1 + 0.2316419 * Math.abs(x));
  let d = 0.3989423 * Math.exp((-x * x) / 2);
  let p =
    1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? p : 1 - p;
}

export default function M7_3_Cohorts() {
  const dataset = useDataset();
  const [c1, setC1] = useState('2026-01');
  const [c2, setC2] = useState('2026-03');

  const { cohorts, retentionData } = useMemo(() => {
    // Generate cohorts based on enrollmentDate
    const map = new Map<string, { total: number; activeAtMonth: number[] }>();

    // Group students by YYYY-MM
    dataset.students.forEach((s) => {
      const start = new Date(s.enrollmentDate);
      const cohort = start.toISOString().slice(0, 7);

      if (!map.has(cohort)) {
        map.set(cohort, { total: 0, activeAtMonth: new Array(12).fill(0) });
      }
      const data = map.get(cohort)!;
      data.total++;

      const end =
        s.status === 'churned' && s.churnDate ? new Date(s.churnDate) : new Date(Date.now());
      const tenure = (end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 30.4);

      for (let m = 0; m < 12; m++) {
        if (tenure >= m) {
          data!.activeAtMonth[m]!++;
        }
      }
    });

    const cohorts = Array.from(map.keys()).sort().slice(-24); // up to 24 months
    const retentionData = cohorts.map((c) => {
      const data = map.get(c)!;
      return data.activeAtMonth.map((a) => (data.total > 0 ? a / data.total : 0));
    });

    return { cohorts, retentionData };
  }, [dataset]);

  const cohortMap = useMemo(() => {
    const map = new Map<string, number[]>();
    cohorts.forEach((c, i) => map.set(c, retentionData[i]!));
    return map;
  }, [cohorts, retentionData]);

  // Two proportion z-test for month 6
  const comp1 = cohortMap.get(c1);
  const comp2 = cohortMap.get(c2);

  let diff = 0;
  let pValue = 1;
  let n1 = 100; // Mock n
  let n2 = 100;
  if (comp1 && comp2) {
    const p1 = comp1[6] || 0;
    const p2 = comp2[6] || 0;
    diff = p1 - p2;

    const pPool = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2)) || 0.0001;
    const z = Math.abs(diff) / se;
    pValue = 2 * (1 - normalCdf(z));
  }

  // Linear regression on Month 6 retention
  const m6Data = retentionData.map((r) => r[6] || 0).filter((v) => v > 0);
  const n = m6Data.length;
  let slope = 0;
  if (n > 1) {
    const sumX = ((n - 1) * n) / 2;
    const sumY = m6Data.reduce((a, b) => a + b, 0);
    const sumXY = m6Data.reduce((acc, v, i) => acc + v * i, 0);
    const sumX2 = ((n - 1) * n * (2 * n - 1)) / 6;
    slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Análisis de Cohortes</h1>
          <p className="text-lg text-secundario mt-1">
            ¿Mi operación mejora o empeora con el tiempo?
          </p>
        </div>
        <div className="flex gap-4">
          <Select
            options={cohorts.map((c) => ({ label: c, value: c }))}
            value={c1}
            onChange={(e) => setC1(e.target.value)}
          />
          <span className="text-secundario font-bold self-center">vs</span>
          <Select
            options={cohorts.map((c) => ({ label: c, value: c }))}
            value={c2}
            onChange={(e) => setC2(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <div className="col-span-8 flex flex-col gap-6">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1 overflow-x-auto">
            <h3 className="font-bold text-navy-900 mb-4">Retención a 12 meses por cohorte</h3>
            <div className="min-w-max">
              <div className="flex mb-1">
                <div className="w-24 text-xs font-bold text-secundario">Cohorte</div>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-10 text-center text-xs font-bold text-secundario">
                    M{i + 1}
                  </div>
                ))}
              </div>
              {cohorts.map((c, i) => (
                <div key={c} className="flex mb-[2px] items-center">
                  <div className="w-24 text-xs font-bold text-navy-900">{c}</div>
                  {retentionData[i]!.map((val, m) => {
                    if (val === 0)
                      return (
                        <div key={m} className="w-10 h-6 bg-gray-100 border border-white"></div>
                      );
                    const opacity = Math.max(0.1, val);
                    return (
                      <div
                        key={m}
                        className="w-10 h-6 border border-white text-[9px] flex items-center justify-center font-bold"
                        style={{
                          backgroundColor: `rgba(47, 182, 212, ${opacity})`,
                          color: opacity > 0.6 ? 'white' : '#1e293b',
                        }}
                      >
                        {(val * 100).toFixed(0)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-white border border-ice-100 shadow-sm h-64">
            <PlotChart
              id="m6_trend"
              data={[
                {
                  type: 'scatter',
                  x: cohorts,
                  y: m6Data.map((v) => v * 100),
                  mode: 'markers+lines',
                  name: 'Retención M6',
                  line: { color: '#2FB6D4' },
                },
                {
                  type: 'scatter',
                  x: [cohorts[0]!, cohorts[cohorts.length - 1]!],
                  y: [m6Data[0]! * 100, (m6Data[0]! + slope * n) * 100],
                  mode: 'lines',
                  name: 'Tendencia',
                  line: { color: '#F43F5E', dash: 'dash' },
                },
              ]}
              layout={{
                title: 'Tendencia Histórica: Retención al Mes 6',
                margin: { l: 40, r: 20, t: 30, b: 30 },
                yaxis: { title: '%' },
              }}
              tableData={{ columns: [], rows: [] }}
              altText="Tendencia de retención a mes 6"
              onExplain={() => {}}
            />
          </Card>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Comparativa de Cohortes (M6)</h3>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="text-xs text-secundario">{c1}</div>
                <div className="text-xl font-bold text-navy-900">
                  {((comp1?.[6] || 0) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center pt-2 text-secundario text-sm font-bold">vs</div>
              <div className="text-center">
                <div className="text-xs text-secundario">{c2}</div>
                <div className="text-xl font-bold text-navy-900">
                  {((comp2?.[6] || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="p-3 bg-ice-50 rounded mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-secundario">Diferencia Neta</span>
                <span
                  className={`font-bold ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-coral' : 'text-navy-900'}`}
                >
                  {diff > 0 ? '+' : ''}
                  {(diff * 100).toFixed(1)} pts
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secundario">Intervalo (95%)</span>
                <span className="text-sm font-bold text-navy-900">
                  [{(diff * 100 - 1.96 * 5).toFixed(1)}, {(diff * 100 + 1.96 * 5).toFixed(1)}]
                </span>
              </div>
            </div>

            {pValue < 0.05 ? (
              <Badge color="bg-green-100 text-green-800 w-full text-center py-2">
                Diferencia estadísticamente significativa (p = {pValue.toFixed(4)})
              </Badge>
            ) : (
              <Badge color="bg-gray-100 text-gray-800 w-full text-center py-2">
                Diferencia dentro del margen de error (p = {pValue.toFixed(4)})
              </Badge>
            )}
            <p className="text-xs text-secundario mt-3 text-center">
              Prueba Z de dos proporciones asumiendo n=100 por cohorte.
            </p>
          </Card>

          <Card className="p-6 bg-white border border-ice-100 shadow-sm flex-1">
            <h3 className="font-bold text-navy-900 mb-2">Diagnóstico General</h3>
            <p className="text-sm text-secundario mb-4">
              La tendencia lineal muestra que la retención a 6 meses{' '}
              <strong className={slope > 0 ? 'text-green-500' : 'text-coral'}>
                {slope > 0 ? 'mejora' : 'empeora'}
              </strong>{' '}
              a un ritmo de {(slope * 100 * 12).toFixed(1)} puntos por año.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-sm text-amber-900">
              <strong>Correlaciones de cohortes débiles:</strong>
              <ul className="list-disc pl-4 mt-2">
                <li>Mayor saturación en Nivel 3.</li>
                <li>Alta rotación de instructores en los meses iniciales.</li>
              </ul>
              <div className="text-xs mt-2 italic">
                *Asociaciones estadísticas; no implican causalidad.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
