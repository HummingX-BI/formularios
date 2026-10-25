import { useState, useMemo } from 'react';
import { LabLayout } from './LabLayout';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { percentile } from '@/stats/descriptive';

type VarKey = 'asistencia' | 'tiempoNivel';

export default function M9_2_Percentiles() {
  const dataset = useDataset();
  const [variable, setVariable] = useState<VarKey>('asistencia');
  const [targetValue, setTargetValue] = useState<number>(85);

  const { boxData, ptiles, ecdf } = useMemo(() => {
    let raw: number[] = [];

    if (variable === 'asistencia') {
      raw = dataset.students.map(() => 40 + Math.random() * 60);
    } else {
      raw = dataset.students.map(() => Math.random() * 24);
    }

    if (raw.length === 0) raw = [0];
    raw.sort((a, b) => a - b);

    // Removed unused qs
    const pVals = [5, 10, 25, 50, 75, 90, 95].map((p) => ({
      p,
      val: percentile(raw, p / 100),
    }));

    const box = [
      {
        type: 'box',
        y: raw,
        name: 'Distribución',
        boxpoints: 'outliers',
        marker: { color: '#2FB6D4' },
      },
    ];

    // Empirical CDF
    const ecdf = (x: number) => {
      const less = raw.filter((v) => v <= x).length;
      return less / raw.length;
    };

    return { data: raw, boxData: box, ptiles: pVals, ecdf };
  }, [dataset, variable]);

  const pFound = Math.round(ecdf(targetValue) * 100);

  return (
    <LabLayout
      title="Ranking y Desempeño Comparativo de Alumnos"
      businessQuestion="¿Dónde se ubica un alumno o grupo respecto a todo el historial de la escuela?"
      description="Esta herramienta compara el nivel o asistencia de cualquier alumno contra el resto de la escuela para identificar a los más destacados o a quienes necesitan apoyo antes de desertar."
      findings={
        <div className="space-y-6">
          <div className="w-64">
            <label className="block text-xs font-bold text-navy-900 mb-1">
              Variable de Referencia
            </label>
            <Select
              options={[
                { label: 'Asistencia Histórica (%)', value: 'asistencia' },
                { label: 'Tiempo en Nivel (meses)', value: 'tiempoNivel' },
              ]}
              value={variable}
              onChange={(e) => setVariable(e.target.value as VarKey)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="h-72 border border-ice-200 rounded p-2">
              <PlotChart
                id="percentiles_box"
                data={boxData as any}
                layout={{ margin: { l: 40, r: 20, t: 10, b: 30 } }}
                altText="Boxplot con atípicos"
                tableData={{ columns: [], rows: [] }}
              />
            </div>

            <div>
              <h4 className="font-bold text-navy-900 mb-2">Tabla de Desempeño y Posición Relativa</h4>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-ice-200 text-secundario">
                    <th className="pb-1">Nivel / Rango</th>
                    <th className="pb-1 text-right">Valor</th>
                    <th className="pb-1 text-right">Interpretación en la Escuela</th>
                  </tr>
                </thead>
                <tbody>
                  {ptiles.map((pt) => (
                    <tr
                      key={pt.p}
                      className={`border-b border-ice-50 ${pt.p === 50 ? 'bg-ice-50 font-bold text-navy-900' : ''}`}
                    >
                      <td className="py-2">
                        {pt.p === 50 ? 'Promedio Central (Top 50%)' : pt.p < 50 ? `Zona Baja (${pt.p}%)` : `Zona Alta (${pt.p}%)`}
                      </td>
                      <td className="py-2 text-right">{pt.val.toFixed(1)}</td>
                      <td className="py-2 text-right text-xs text-secundario">
                        {pt.p === 50
                          ? 'Punto medio de la escuela'
                          : pt.p < 30
                          ? 'Alumnos que requieren seguimiento'
                          : pt.p > 70
                          ? 'Alumnos de rendimiento sobresaliente'
                          : `Supera al ${pt.p}% de los alumnos`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-ice-200 rounded p-4 bg-ice-50">
            <h4 className="font-bold text-navy-900 mb-4">Herramienta: Evaluar y Clasificar a un Alumno</h4>
            <div className="flex gap-4 items-end">
              <div className="w-48">
                <label className="block text-xs text-secundario mb-1">
                  Ingresa el valor del alumno/grupo
                </label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full bg-white border border-ice-200 rounded p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-1 bg-white border border-ice-200 rounded p-2 flex items-center">
                <span className="text-navy-900">
                  Este registro se ubica en el{' '}
                  <strong className="text-blue-600 text-lg">Top {100 - pFound}% de la escuela</strong>. Supera al{' '}
                  {pFound}% de los alumnos históricos.
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      action={
        <p className="text-sm text-navy-900">
          Usa los rangos de desempeño para detectar a tiempo al 10% de alumnos con menor asistencia o avance,
          y programa llamadas de seguimiento antes de que se den de baja. Al mismo tiempo, reconoce al 10% superior
          para incentivar su lealtad e invitarlos a equipos representativos.
        </p>
      }
    />
  );
}
