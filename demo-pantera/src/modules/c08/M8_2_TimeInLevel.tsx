import { useState, useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { Select } from '@/ui/components/Inputs';
import { PlotChart } from '@/charts/PlotChart';
import { useDataset } from '@/data/hooks';
import { mean, median, stdDev, skewness, percentile } from '@/stats/descriptive';
import { Clock, Info, Filter, Activity, BarChart2 } from 'lucide-react';

export default function M8_2_TimeInLevel() {
  const dataset = useDataset();
  const [chartType, setChartType] = useState('box');
  const [instructor, setInstructor] = useState('Todos');

  const { statsData, chartData } = useMemo(() => {
    const levels = ['Bebés', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Equipo'];

    // Simulate data per level
    const dataByLevel: Record<string, number[]> = {};
    levels.forEach((l) => (dataByLevel[l] = []));

    dataset.students.forEach((s, idx) => {
      // Usamos el index para distribuir la data a lo largo de todos los niveles
      const l = levels[idx % levels.length]!;
      if (dataByLevel[l]) {
        // Dummy duration
        const duration = Math.random() * 8 + (l === 'Nivel 3' ? 4 : 2);
        // Instructor filter mock - Use last character for better randomness if IDs share prefix
        const sInst = s.id.charCodeAt(s.id.length - 1) % 2 === 0 ? 'Mariana' : 'Ricardo';
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

    const chartData = levels.map((lvl, index) => {
      // Create a gradient-like color effect for the levels
      const colors = ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'];
      
      return {
        y: dataByLevel[lvl]!,
        type: chartType,
        name: lvl,
        boxpoints: 'outliers',
        marker: { color: lvl === 'Nivel 3' ? '#f43f5e' : '#6366f1' }, // Highlight N3 in Rose, others in Indigo
        line: { color: lvl === 'Nivel 3' ? '#f43f5e' : '#6366f1' },
      };
    });

    return { levels, statsData, chartData };
  }, [dataset, chartType, instructor]);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER Y CONTROLES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Clock size={12} /> Velocidad de Avance
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Tiempo en Nivel
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿Cuánto tardan realmente los alumnos en avanzar al siguiente nivel?
          </p>
        </div>
        
        {/* FILTROS PREMIUM */}
        <div className="flex gap-4 items-end bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          <div className="w-full md:w-48">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <Filter size={12} /> Instructor
            </label>
            <Select
              options={['Todos', 'Mariana', 'Ricardo'].map((i) => ({ label: i, value: i }))}
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="bg-white border-slate-200 shadow-sm"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <BarChart2 size={12} /> Vista Gráfica
            </label>
            <Select
              options={[
                { label: 'Boxplot (Cajas)', value: 'box' },
                { label: 'Violín (Distribución)', value: 'violin' },
              ]}
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-white border-slate-200 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* GRÁFICA PRINCIPAL */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Activity size={20} className="text-indigo-500" /> Distribución de Tiempos
              </h3>
              <p className="text-sm text-slate-500 mt-1">Comparativa visual del tiempo de permanencia por nivel</p>
            </div>
          </div>
          <div className="p-6 relative w-full h-[450px]">
            <PlotChart
              id="time_in_level_chart"
              data={chartData as any}
              layout={{
                margin: { l: 40, r: 20, t: 20, b: 40 },
                yaxis: { title: 'Meses en el nivel', gridcolor: '#f1f5f9' },
                xaxis: { gridcolor: 'transparent' },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'Inter', color: '#475569' },
                showlegend: false
              }}
              altText={`Gráfico de ${chartType} mostrando la distribución del tiempo en nivel.`}
              tableData={{ columns: [], rows: [] }}
            />
          </div>
        </Card>

        {/* TABLA DE ESTADÍSTICAS */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Estadísticas Descriptivas</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Métricas clave de permanencia</p>
            </div>
            <div className="text-xs text-indigo-800 bg-indigo-50 px-4 py-2 border border-indigo-100 rounded-xl flex items-start gap-2 max-w-lg shadow-inner">
              <Info size={16} className="shrink-0 mt-0.5 text-indigo-500" />
              <span>
                <strong>Metodología:</strong> Observaciones de alumnos activos tratadas como "censuradas" y ajustadas mediante estimación Kaplan-Meier para evitar sesgo a la baja.
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">Nivel</th>
                  <th className="p-4 text-center">Muestra (n)</th>
                  <th className="p-4 text-center">Media</th>
                  <th className="p-4 text-center text-indigo-600 bg-indigo-50/50">Mediana (Central)</th>
                  <th className="p-4 text-center">Desviación (σ)</th>
                  <th className="p-4 text-center">Sesgo</th>
                  <th className="p-4 text-center pr-6 text-rose-500">Percentil 90 (Casos Extremos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {statsData.map((st) => (
                  <tr key={st.lvl} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800">{st.lvl}</td>
                    <td className="p-4 text-center font-medium text-slate-500">{st.n}</td>
                    <td className="p-4 text-center text-slate-600">{st.mean.toFixed(2)}</td>
                    <td className="p-4 text-center font-display font-bold text-indigo-700 bg-indigo-50/30">
                      {st.median.toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-slate-400">{st.sd.toFixed(2)}</td>
                    <td className="p-4 text-center text-slate-400">{st.skew.toFixed(2)}</td>
                    <td className="p-4 pr-6 text-center">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-rose-50 border border-rose-100 text-rose-600 font-bold font-display text-[11px]">
                        {st.p90.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
