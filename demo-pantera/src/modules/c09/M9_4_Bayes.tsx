import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { GitMerge, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, Sparkles, BrainCircuit } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

export default function M9_4_Bayes() {
  
  // Matriz de Correlación (Factores que causan bajas)
  const correlationData = [{
    type: 'surface',
    z: [[1, -0.8, 0.6], [-0.8, 1, -0.4], [0.6, -0.4, 1]],
    x: ['Asistencia', 'Subida Precio', 'Cambio Profe'],
    y: ['Permanencia', 'Baja', 'Quejas'],
    colorscale: 'RdBu',
    showscale: false
  }];

  // Gráfica de Validación de Tendencias (Antes y Después de una decisión)
  const inferenceData = [{
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Ingresos Históricos',
    x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    y: [100, 105, 102, 110, 108, 115],
    line: { color: '#94a3b8', dash: 'dot', width: 2 },
    marker: { size: 6 }
  }, {
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Impacto tras subir precios (A/B Test)',
    x: ['Jul', 'Ago', 'Sep', 'Oct'],
    y: [125, 130, 128, 135],
    line: { color: '#10b981', width: 3 },
    marker: { size: 8 }
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <BrainCircuit size={12} /> Causalidad y A/B Testing
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            El Porqué de las Cosas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Entiende las relaciones ocultas y el impacto real de tus decisiones operativas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* IMPACTO DE DECISIONES (INFERENCIA) */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-500" /> Evaluación de Decisiones
              </h3>
              <p className="text-xs text-slate-500 mt-1">Impacto de la última subida de precios (+10%)</p>
            </div>
          </div>
          <div className="flex-1 p-6 relative w-full h-[350px]">
            <PlotChart
              id="inference_scatter"
              data={inferenceData as any}
              layout={{
                margin: { t: 20, b: 40, l: 40, r: 20 },
                legend: { orientation: 'h', y: -0.2, font: { family: 'Inter', color: '#64748b' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                xaxis: { gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                yaxis: { gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de inferencia causal"
            />
          </div>
          
          <div className="p-6 bg-slate-900 text-white rounded-b-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
             <div className="relative z-10 flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                 <CheckCircle size={20} className="text-emerald-400" />
               </div>
               <div>
                 <h4 className="text-emerald-400 font-bold text-sm mb-1 uppercase tracking-widest">Decisión Estratégica Exitosa</h4>
                 <p className="text-slate-300 text-sm leading-relaxed">
                   La pérdida natural de 5 alumnos se compensó totalmente. El incremento neto de ganancias es del <strong className="text-white">+18% real</strong>, superando la varianza histórica estacional. No fue casualidad.
                 </p>
               </div>
             </div>
          </div>
        </Card>

        {/* FACTORES DE CRECIMIENTO / BAJAS (CORRELACIÓN Y BAYES) */}
        <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" /> Riesgos y Mapa de Causa y Efecto
              </h3>
              <p className="text-xs text-slate-500 mt-1">Factores subyacentes que detonan bajas o quejas</p>
            </div>
          </div>
          <div className="flex-1 p-6 relative w-full h-[350px]">
            <PlotChart
              id="correlation_heatmap"
              data={correlationData as any}
              layout={{ 
                margin: { t: 0, b: 0, l: 0, r: 0 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'Inter', color: '#475569' },
                scene: {
                  xaxis: { title: 'Factores', titlefont: { size: 10 } },
                  yaxis: { title: 'Resultados', titlefont: { size: 10 } },
                  zaxis: { title: 'Correlación', titlefont: { size: 10 } },
                  camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
                }
              }}
              tableData={{columns: [], rows: []}}
              altText="Mapa de calor de correlaciones"
            />
          </div>
          
          <div className="p-6 bg-amber-50 border-t border-amber-100 rounded-b-3xl">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 shadow-inner">
                 <Lightbulb size={20} className="text-amber-600" />
               </div>
               <div>
                 <h4 className="text-amber-800 font-bold text-sm mb-1 uppercase tracking-widest">Alerta Inteligente de Patrones (Probabilidad)</h4>
                 <p className="text-amber-900/80 text-sm leading-relaxed">
                   Si un alumno presenta faltas durante 2 semanas consecutivas, tiene un <strong className="text-amber-700 bg-amber-200/50 px-1.5 py-0.5 rounded">82% de probabilidad</strong> de darse de baja al mes siguiente. Sugerimos detonar campañas de rescate inmediato al detectar este patrón.
                 </p>
               </div>
             </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
