import { useState, useEffect } from 'react';
import { Card } from '@/ui/components/Cards';
import { Badge } from '@/ui/components/DataDisplay';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { runMLTask } from '@/ml/workers/mlClient';
import type { KMResult } from '@/ml/kaplanMeier';

export default function M7_2_Survival() {
  const dataset = useDataset();
  const [loading, setLoading] = useState(true);
  const [strata, setStrata] = useState('level');

  const [kmResults, setKmResults] = useState<{ name: string; data: KMResult }[]>([]);
  const [logRank, setLogRank] = useState<{ stat: number; pValue: number; df: number } | null>(null);

  useEffect(() => {
    async function calculateSurvival() {
      setLoading(true);
      try {
        const groups = new Map<string, { times: number[]; events: boolean[] }>();

        dataset.students.forEach((s) => {
          // Calculate tenure in months
          const enrollDate = new Date(s.enrollmentDate);
          const endDate =
            s.status === 'churned' && s.churnDate ? new Date(s.churnDate) : new Date(Date.now());
          const tenure = (endDate.getTime() - enrollDate.getTime()) / (1000 * 3600 * 24 * 30.4);

          let groupName = 'General';
          if (strata === 'level') groupName = s.level.split(' ')[0] || 'Desconocido';
          if (strata === 'source') groupName = s.plan || 'Orgánico';
          // Using random for demo if other strata requested
          if (strata === 'plan') groupName = s.plan || 'regular';

          if (!groups.has(groupName)) groups.set(groupName, { times: [], events: [] });
          groups.get(groupName)!.times.push(tenure);
          groups.get(groupName)!.events.push(s.status === 'churned');
        });

        // Take top 6 groups by size
        const topGroups = Array.from(groups.entries())
          .sort((a, b) => b[1].times.length - a[1].times.length)
          .slice(0, 6);

        const results: { name: string; data: KMResult }[] = [];
        const testGroups: { times: number[]; events: boolean[] }[] = [];

        for (const [name, data] of topGroups) {
          const res = await runMLTask<KMResult>('kaplanMeier', {
            times: data.times,
            events: data.events,
            maxTime: 36,
          });
          results.push({ name, data: res });
          testGroups.push(data);
        }

        const logRankRes = await runMLTask<{ stat: number; pValue: number; df: number }>(
          'logRankTest',
          { groups: testGroups },
        );

        setKmResults(results);
        setLogRank(logRankRes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    calculateSurvival();
  }, [dataset, strata]);

  if (loading) {
    return (
      <div className="p-10 text-center text-secundario">
        Calculando curvas de supervivencia en Worker...
      </div>
    );
  }

  const chartData = kmResults.flatMap((res, i) => {
    const color = ['#2FB6D4', '#F43F5E', '#F59E0B', '#10B981', '#6366F1', '#8B5CF6'][i % 6];
    return [
      {
        type: 'scatter' as const,
        x: res.data.times,
        y: res.data.survival.map((s) => s * 100),
        name: res.name,
        line: { shape: 'hv' as const, color, width: 3 },
      },
      // Confidence intervals could be added here as shaded regions if PlotChart supports fill
    ];
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Curvas de Supervivencia</h1>
          <p className="text-lg text-secundario mt-1">
            ¿Cuánto tiempo se queda un alumno típico y de qué depende?
          </p>
        </div>
        <div className="w-64">
          <label className="block text-xs font-bold text-navy-900 mb-1">Estratificar por:</label>
          <Select
            options={[
              { label: 'Nivel Actual', value: 'level' },
              { label: 'Fuente de Adquisición', value: 'source' },
              { label: 'Plan', value: 'plan' },
            ]}
            value={strata}
            onChange={(e) => setStrata(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        <Card className="col-span-8 p-6 bg-white border border-ice-100 shadow-sm flex flex-col">
          <PlotChart
            id="km_survival"
            data={chartData}
            layout={{
              title: 'Supervivencia (Kaplan-Meier)',
              xaxis: { title: 'Meses desde Inscripción', range: [0, 24] },
              yaxis: { title: 'Retención (%)', range: [0, 105] },
              margin: { l: 50, r: 20, t: 30, b: 50 },
              legend: { orientation: 'h', y: -0.2 },
            }}
            tableData={{ columns: [], rows: [] }}
            altText="Curvas de supervivencia de Kaplan-Meier"
            onExplain={() => {}}
          />
        </Card>

        <div className="col-span-4 flex flex-col gap-4">
          <Card className="p-4 bg-white border border-ice-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-2">Prueba de Diferencias (Log-Rank)</h3>
            {logRank && logRank.pValue < 0.05 ? (
              <div className="text-sm">
                <Badge color="bg-green-100 text-green-800 mb-2">
                  Significativo (p = {logRank.pValue.toFixed(4)})
                </Badge>
                <p className="text-secundario">
                  Existe una diferencia estadística real en el tiempo de retención entre estos
                  grupos.
                </p>
              </div>
            ) : (
              <div className="text-sm">
                <Badge color="bg-ice-100 text-navy-900 mb-2">
                  No Significativo (p = {logRank?.pValue.toFixed(4)})
                </Badge>
                <p className="text-secundario">
                  No hay suficiente evidencia para afirmar que estos grupos se comportan distinto.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-4 bg-white border border-ice-100 shadow-sm flex-1 overflow-auto">
            <h3 className="font-bold text-navy-900 mb-4">Retención a 6 y 12 meses</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ice-200 text-secundario">
                  <th className="pb-2">Grupo</th>
                  <th className="pb-2">6m</th>
                  <th className="pb-2">12m</th>
                  <th className="pb-2">RMST(36)</th>
                </tr>
              </thead>
              <tbody>
                {kmResults.map((r, i) => {
                  const getSurvivalAt = (months: number) => {
                    const idx = r.data.times.findIndex((t) => t >= months);
                    if (idx === -1) return r.data.survival[r.data.survival.length - 1] || 0;
                    return r.data.survival[Math.max(0, idx - 1)] || 1;
                  };
                  return (
                    <tr key={i} className="border-b border-ice-50">
                      <td className="py-2 font-bold text-navy-900">{r.name}</td>
                      <td className="py-2 text-secundario">
                        {(getSurvivalAt(6) * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 text-secundario">
                        {(getSurvivalAt(12) * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 text-navy-900 font-bold">{r.data.rmst36.toFixed(1)}m</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
