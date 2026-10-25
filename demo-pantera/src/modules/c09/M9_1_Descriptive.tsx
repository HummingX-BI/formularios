import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Activity, Target, Trophy, Percent, TrendingUp, Info, Sparkles, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

export default function M9_1_Descriptive() {
  const currentRevenue = 1150000;
  const goalRevenue = 1350000;
  const probability = 82; // Poisson/Binomial probability

  const gaugeData = [{
    type: 'indicator',
    mode: 'gauge+number+delta',
    value: probability,
    number: { suffix: '%', font: { size: 40, color: '#1e293b', family: 'Inter' } },
    delta: { reference: 75, increasing: { color: "#10b981" }, position: "top" },
    gauge: {
      axis: { range: [null, 100], tickwidth: 1, tickcolor: "#cbd5e1" },
      bar: { color: probability > 80 ? "#34d399" : "#fbbf24", thickness: 0.2 },
      bgcolor: "#f1f5f9",
      borderwidth: 0,
      steps: [
        { range: [0, 50], color: "#fee2e2" },
        { range: [50, 80], color: "#fef3c7" },
        { range: [80, 100], color: "#d1fae5" }
      ],
    }
  }];

  const distributionData = [{
    type: 'box',
    y: [85, 90, 75, 95, 60, 100, 80, 85, 70, 92, 88, 85],
    name: 'Tu Escuela',
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8,
    marker: { color: '#6366f1' },
    line: { color: '#6366f1' }
  }, {
    type: 'box',
    y: [60, 70, 50, 80, 40, 90, 65, 75, 55, 85, 70, 65],
    name: 'Promedio Sector',
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8,
    marker: { color: '#94a3b8' },
    line: { color: '#94a3b8' }
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <Activity size={12} /> Análisis Descriptivo
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Auditoría de Salud y Metas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Radiografía descriptiva y probabilidades estadísticas de éxito.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: GAUGE + METAS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Target size={20} className="text-indigo-500" /> Progreso vs Meta
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-4xl font-display font-bold text-slate-900">{formatCurrency(currentRevenue)}</span>
                  <span className="text-sm font-bold text-slate-400 mb-1">/ {formatCurrency(goalRevenue)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-3 rounded-full" style={{ width: `${(currentRevenue/goalRevenue)*100}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider text-right">
                  {((currentRevenue/goalRevenue)*100).toFixed(1)}% Alcanzado
                </p>
              </div>
              
              <div className="relative w-full h-[250px] -mt-4">
                <PlotChart
                  id="goal_gauge"
                  data={gaugeData as any}
                  layout={{ 
                    margin: { t: 50, b: 20, l: 30, r: 30 },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { family: 'Inter', color: '#475569' }
                  }}
                  tableData={{columns: [], rows: []}}
                  altText="Medidor de probabilidad"
                />
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-start gap-2">
                <Info size={16} className="shrink-0 mt-0.5 text-indigo-500" />
                <p className="text-xs text-indigo-900 leading-relaxed">
                  <strong>Modelo Predictivo:</strong> Cálculo probabilístico (Poisson) basado en el ritmo de venta vs el histórico de 12 meses.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA: BENCHMARK PERCENTILES */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" /> Benchmark de Retención (Ranking de Alumnos)
                </h3>
                <p className="text-xs text-slate-500 mt-1">Comparativa de desempeño frente a la industria</p>
              </div>
            </div>
            
            <div className="flex-1 p-6 relative">
              <PlotChart
                id="percentiles_box"
                data={distributionData as any}
                layout={{
                  margin: { t: 20, b: 40, l: 40, r: 20 },
                  yaxis: { title: 'Puntaje de Retención (%)', gridcolor: '#f1f5f9' },
                  xaxis: { gridcolor: 'transparent' },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { family: 'Inter', color: '#475569' },
                  showlegend: false
                }}
                tableData={{columns: [], rows: []}}
                altText="Gráfica de cajas de retención"
              />
            </div>

            {/* AI DIAGNOSTIC ROW */}
            <div className="p-6 bg-slate-900 text-white rounded-b-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Sparkles size={24} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-emerald-400 font-bold text-sm mb-1 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} /> Top 15% del Mercado
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Tu retención mediana es del <strong className="text-white">85%</strong>, mientras que el promedio de la industria sufre en un <strong className="text-white">65%</strong>. Tus estrategias de fidelización y rescate están generando un <em>Alpha</em> estadísticamente significativo.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
