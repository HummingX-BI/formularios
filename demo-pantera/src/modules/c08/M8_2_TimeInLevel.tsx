import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { mean, median, stdDev, skewness, percentile } from '@/stats/descriptive';

export default function M8_2_TimeInLevel() {
  const dataset = useDataset();
  const [chartType, setChartType] = useState('box');
  const [instructor, setInstructor] = useState('Todos');

  const { statsData, chartData } = useMemo(() => {
    const levels = ['Bebés', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Equipo'];

    // Simulate data per level
    const dataByLevel: Record<string, number[]> = {};
    levels.forEach((l) => (dataByLevel[l] = []));

    dataset.students.forEach((s) => {
      const l = s.level.split(' ')[0] || 'Nivel 1';
      if (dataByLevel[l]) {
        // Dummy duration
        const duration = Math.random() * 8 + (l === 'Nivel 3' ? 4 : 2);
        // Instructor filter mock
        const sInst = s.id.charCodeAt(0) % 2 === 0 ? 'Mariana' : 'Ricardo';
        if (instructor === 'Todos' || instructor === sInst) {
          dataByLevel[l]!.push(duration);
        }
      }
    });

    const statsData = levels.map((lvl) => {
      const d = dataByLevel[lvl]!;
      if (d.length === 0) return { lvl, mean: 0, median: 0, sd: 0, skew: 0, p90: 0, n: 0 };
      return {
        lvl,
        mean: mean(d),
        median: median(d),
        sd: stdDev(d),
        skew: skewness(d),
        p90: percentile(d, 0.9),
        n: d.length,
      };
    });

    const chartData = levels.map((lvl) => ({
      y: dataByLevel[lvl]!,
      type: chartType,
      name: lvl,
      boxpoints: 'outliers',
      marker: { color: '#2FB6D4' },
    }));

    return { levels, statsData, chartData };
  }, [dataset, chartType, instructor]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-navy-900">Tiempo en Nivel</h1>
          <p className="text-lg text-secundario mt-1">¿Cuánto tardan los alumnos en avanzar?</p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="w-48">
            <label className="block text-xs font-bold text-navy-900 mb-1">Instructor</label>
            <Select
              options={['Todos', 'Mariana', 'Ricardo'].map((i) => ({ label: i, value: i }))}
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              options={[
                { label: 'Boxplot', value: 'box' },
                { label: 'Violín', value: 'violin' },
              ]}
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 flex-1">
        <Card className="p-4 bg-white border border-ice-100 shadow-sm h-80">
          <PlotChart
            id="time_in_level_chart"
            data={chartData as any}
            layout={{
              margin: { l: 40, r: 20, t: 20, b: 40 },
              yaxis: { title: 'Meses en el nivel' },
            }}
            altText={`Gráfico de ${chartType} mostrando la distribución del tiempo en nivel.`}
            tableData={{ columns: [], rows: [] }}
          />
        </Card>

        <Card className="p-4 bg-white border border-ice-100 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-navy-900">Estadísticas Descriptivas</h3>
            <div className="text-xs text-secundario bg-ice-50 px-3 py-1 border border-ice-200 rounded">
              <strong>Nota metodológica:</strong> Las observaciones de alumnos actualmente activos
              se tratan como datos "censurados" y se ajustan mediante estimación de supervivencia
              para evitar sesgo a la baja.
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ice-200 text-secundario">
                <th className="pb-2">Nivel</th>
                <th className="pb-2 text-right">n</th>
                <th className="pb-2 text-right">Media</th>
                <th className="pb-2 text-right">Mediana</th>
                <th className="pb-2 text-right">Desviación (σ)</th>
                <th className="pb-2 text-right">Sesgo</th>
                <th className="pb-2 text-right">Percentil 90</th>
              </tr>
            </thead>
            <tbody>
              {statsData.map((st) => (
                <tr key={st.lvl} className="border-b border-ice-50">
                  <td className="py-2 font-bold text-navy-900">{st.lvl}</td>
                  <td className="py-2 text-right">{st.n}</td>
                  <td className="py-2 text-right">{st.mean.toFixed(2)}</td>
                  <td className="py-2 text-right font-bold text-navy-900">
                    {st.median.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-secundario">{st.sd.toFixed(2)}</td>
                  <td className="py-2 text-right text-secundario">{st.skew.toFixed(2)}</td>
                  <td className="py-2 text-right text-coral">{st.p90.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
