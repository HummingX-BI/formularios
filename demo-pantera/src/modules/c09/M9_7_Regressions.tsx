import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { TrendingUp, CalendarDays, ArrowUpRight, ArrowDownRight, Lightbulb, TrendingDown, Sparkles, BrainCircuit } from 'lucide-react';

export default function M9_7_Regressions() {
  
  // Regresión y Series de tiempo
  const forecastData = [{
    type: 'scatter',
    mode: 'lines',
    name: 'Histórico',
    x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    y: [120, 125, 122, 130, 128, 140, 145, 142],
    line: { color: '#334155', width: 3 } // slate-700
  }, {
    type: 'scatter',
    mode: 'lines',
    name: 'Pronóstico IA (Regresión)',
    x: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    y: [142, 135, 130, 145, 155],
    line: { color: '#6366f1', width: 3, dash: 'dot' } // indigo-500
  }, {
    type: 'scatter',
    mode: 'lines',
    name: 'Banda de Confianza Superior',
    x: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    y: [142, 140, 138, 155, 165],
    line: { color: 'transparent' },
    showlegend: false
  }, {
    type: 'scatter',
    mode: 'lines',
    name: 'Banda Inferior',
    x: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    y: [142, 130, 122, 135, 145],
    fill: 'tonexty',
    fillcolor: 'rgba(99, 102, 241, 0.1)', // indigo-500 with 10% opacity
    line: { color: 'transparent' },
    showlegend: false
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 mb-3">
            <BrainCircuit size={12} /> Modelos Predictivos
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Radar de Pronósticos
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Prevé el futuro de tu negocio evaluando estacionalidad y modelos de regresión predictiva.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICA DE PRONÓSTICO (SERIES DE TIEMPO) */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col h-[550px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <CalendarDays size={20} className="text-indigo-500" /> Proyección de Ingresos a 4 Meses
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  El modelo considera tu crecimiento natural, la época del año (estacionalidad) y tus precios actuales.
                </p>
              </div>
            </div>
            <div className="flex-1 p-6 relative w-full">
              <PlotChart
                id="forecast_series"
                data={forecastData as any}
                layout={{
                  margin: { t: 20, b: 40, l: 40, r: 20 },
                  legend: { orientation: 'h', y: -0.15, font: { family: 'Inter', color: '#64748b' } },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  xaxis: { gridcolor: 'transparent', tickfont: { family: 'Inter', color: '#94a3b8' } },
                  yaxis: { gridcolor: '#f1f5f9', tickfont: { family: 'Inter', color: '#94a3b8' } },
                }}
                tableData={{columns: [], rows: []}}
                altText="Gráfica de series de tiempo y regresión"
              />
            </div>
          </Card>
        </div>

        {/* CONCLUSIONES DEL MODELO PREDICTIVO */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <Card className="p-6 bg-amber-50 border border-amber-200 shadow-sm rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                <TrendingDown size={20} className="text-amber-600" /> Alerta de Estacionalidad (Sept-Oct)
              </h3>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                El modelo detecta una caída natural inminente. Basado en los últimos 3 años, septiembre y octubre son meses lentos por el regreso a clases. <strong className="text-amber-900 bg-amber-200/50 px-1 rounded">Se espera una baja temporal del 8% en ingresos.</strong>
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-emerald-50 border border-emerald-200 shadow-sm rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                <ArrowUpRight size={20} className="text-emerald-600" /> Recuperación en Noviembre
              </h3>
              <p className="text-sm text-emerald-800/80 leading-relaxed">
                La curva volverá a subir drásticamente a mediados de Noviembre. Tu proyección optimista para cierre de año es de <strong className="text-emerald-900 bg-emerald-200/50 px-1 rounded">165 alumnos activos</strong> si mantienes tus tasas de conversión actuales.
              </p>
            </div>
          </Card>

          <div className="bg-slate-900 text-white shadow-xl rounded-3xl flex flex-col relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-6 relative z-10">
              <h3 className="font-bold text-indigo-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                <Lightbulb size={16} /> Acción Estratégica
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Para contrarrestar la caída de Septiembre, la IA sugiere lanzar una <strong className="text-white">Campaña de Pre-Venta Anual</strong> a finales de Agosto para asegurar el flujo de efectivo.
              </p>
              <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 text-sm">
                <Sparkles size={16} /> Crear Campaña en CRM
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
