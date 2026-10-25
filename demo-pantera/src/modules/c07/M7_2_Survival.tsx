import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { HeartHandshake, Grid, Activity, TrendingDown, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

export default function M7_2_Survival() {
  
  // Curva de Supervivencia (Kaplan-Meier simplificada)
  const survivalData = [{
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Retención Promedio',
    x: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6', 'Mes 9', 'Mes 12'],
    y: [100, 92, 85, 65, 60, 55, 48, 40],
    line: { color: '#6366f1', width: 4, shape: 'spline' }, // Indigo-500
    marker: { size: 10, color: '#4f46e5', symbol: 'circle' },
    fill: 'tozeroy',
    fillcolor: 'rgba(99, 102, 241, 0.1)'
  }];

  // Generaciones (Retención por generación)
  const heatmapZ = [
    [100, 95, 88, 80, 75, 70], // Enero
    [100, 92, 85, 78, 70, null], // Febrero
    [100, 88, 80, 65, null, null], // Marzo (caída fuerte)
    [100, 96, 90, null, null, null], // Abril
  ];
  
  const cohortsData = [{
    type: 'heatmap',
    z: heatmapZ,
    x: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'],
    y: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    colorscale: [
      [0, '#fff1f2'], // Rose-50 (Baja retención)
      [0.5, '#e0e7ff'], // Indigo-100
      [1, '#6366f1'] // Indigo-500 (Alta retención)
    ],
    showscale: false,
    text: heatmapZ.map(row => row.map(val => val !== null ? `${val}%` : '')),
    texttemplate: "%{text}",
    textfont: {
      color: '#0f172a',
      family: 'Inter',
      weight: 'bold'
    },
    hoverinfo: 'x+y+text'
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <HeartHandshake size={12} /> Permanencia Estructural
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Lealtad y Ciclo de Vida
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Mide cuántos meses duran tus alumnos y compara la lealtad por generaciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CURVA DE SUPERVIVENCIA */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Activity size={20} className="text-indigo-500" /> Curva de Supervivencia
              </h3>
              <p className="text-sm text-slate-500 mt-1">Probabilidad de alumno activo a través del tiempo</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] p-6">
            <PlotChart
              id="survival_curve"
              data={survivalData as any}
              layout={{
                margin: { t: 10, b: 40, l: 40, r: 20 },
                yaxis: { title: '% de Alumnos', range: [0, 105], gridcolor: '#f1f5f9' },
                xaxis: { gridcolor: 'transparent' },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'Inter', color: '#475569' }
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de curva de supervivencia"
              onExplain={() => {}}
            />
          </div>
          
          <div className="p-6 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-rose-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Punto de Quiebre Detectado (IA)</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Tienes una <strong className="text-white">caída dramática del 20%</strong> de retención entre el Mes 3 y el Mes 4. Sugerimos enviar un premio o reconocimiento justo al inicio del Mes 3 para evitar esta fuga.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ANÁLISIS DE COHORTES */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Grid size={20} className="text-emerald-500" /> Evolución de Generaciones
              </h3>
              <p className="text-sm text-slate-500 mt-1">Comparación de retención por mes de ingreso</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] p-6">
            <PlotChart
              id="cohorts_heatmap"
              data={cohortsData as any}
              layout={{
                margin: { t: 10, b: 40, l: 60, r: 20 },
                xaxis: { title: 'Meses de Antigüedad', side: 'bottom' },
                yaxis: { autorange: 'reversed' }, // To show Enero at top
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'Inter', color: '#475569' }
              }}
              tableData={{columns: [], rows: []}}
              altText="Mapa de calor de cohortes"
              onExplain={() => {}}
            />
          </div>
          
          <div className="p-6 bg-emerald-50 border-t border-emerald-100 relative overflow-hidden">
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Mejora Operacional (IA)</h4>
                <p className="text-emerald-900 text-sm leading-relaxed">
                  Los alumnos de <strong className="font-extrabold">Abril</strong> tienen una retención inicial del 96%, mucho mejor que la generación de Marzo (88%). <span className="font-semibold">Tus nuevas políticas de bienvenida funcionaron.</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
