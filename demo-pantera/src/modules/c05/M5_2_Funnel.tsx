import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Filter, Users, UserCheck, AlertCircle, AlertTriangle, TrendingDown, ArrowDownRight, ArrowUpRight, Sparkles, ChevronRight } from 'lucide-react';

export default function M5_2_Funnel() {
  
  // Data del embudo (Prospectos -> Visitas -> Inscritos)
  const funnelData = [{
    type: 'funnel',
    y: ['1. Informes', '2. Agendan Visita', '3. Asisten (Show-up)', '4. Inscritos'],
    x: [120, 85, 50, 30],
    textinfo: 'value+percent initial',
    marker: {
      color: ['#0f172a', '#6366f1', '#10b981', '#059669'],
    },
    connector: { line: { color: '#e2e8f0', width: 2, dash: 'dot' } }
  }];

  // Data de motivos de pérdida (Por qué se caen de la etapa 1 a la 4)
  const lossReasonsData = [{
    type: 'bar',
    x: ['Horarios', 'Precio/Competencia', 'Falta Seguimiento', 'Lejanía', 'Otros'],
    y: [40, 25, 15, 8, 2],
    marker: { 
      color: ['#f43f5e', '#fb923c', '#94a3b8', '#94a3b8', '#94a3b8'], 
      opacity: 0.9 
    },
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Filter className="text-indigo-600 w-8 h-8" />
            Análisis de Embudo y Fugas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Métricas de conversión y diagnóstico de pérdida de prospectos.
          </p>
        </div>
      </div>

      {/* MÉTRICAS CLAVE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
              <Users size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20">
              <ArrowUpRight size={12} /> +2%
            </span>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tasa de Cierre Final</div>
            <div className="text-4xl font-display font-extrabold text-white mb-2">25%</div>
            <div className="text-sm text-slate-300 font-medium">De cada 100 prospectos, inscribes 25.</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
              <ArrowDownRight size={12} /> -5%
            </span>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tasa de Asistencia (Show-up)</div>
            <div className="text-4xl font-display font-extrabold text-slate-800 mb-2">58%</div>
            <div className="text-sm text-slate-500 font-medium"><span className="font-bold text-rose-500">42% agenda pero nunca asiste</span>.</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs font-bold text-rose-800/60 uppercase tracking-widest mb-1">Fuga Principal</div>
            <div className="text-4xl font-display font-extrabold text-rose-600 mb-2">Horarios</div>
            <div className="text-sm text-rose-700/80 font-medium">Pierdes al 44% por falta de cupo o malas horas.</div>
          </div>
        </div>

      </div>

      {/* DASHBOARDS VISUALES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        
        {/* EMBUDO DE CONVERSIÓN */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-500" /> Tasa de Conversión (Pipeline)
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Rastrea cuántas personas sobreviven en cada etapa del proceso de venta.
            </p>
          </div>
          <div className="flex-1 min-h-[350px]">
            <PlotChart
              id="sales_funnel"
              data={funnelData as any}
              layout={{
                margin: { l: 150, r: 20, t: 20, b: 20 },
                xaxis: { visible: false },
                yaxis: { tickfont: { size: 13, color: '#475569', family: 'Inter', weight: 'bold' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de embudo de ventas"
              onExplain={() => {}}
            />
          </div>
        </div>

        {/* MOTIVOS DE PÉRDIDA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 relative z-10">
              <AlertCircle className="w-5 h-5 text-rose-500" /> Diagnóstico de Pérdidas
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1 relative z-10">
              ¿Por qué se cayeron las 90 ventas que no lograste cerrar este mes?
            </p>
          </div>
          
          <div className="flex-1 min-h-[250px] relative z-10">
            <PlotChart
              id="loss_reasons_bar"
              data={lossReasonsData as any}
              layout={{
                margin: { l: 40, r: 20, t: 20, b: 40 },
                xaxis: { tickfont: { size: 11, color: '#64748b', family: 'Inter' } },
                yaxis: { tickfont: { color: '#64748b', family: 'Inter' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de motivos de pérdida"
              onExplain={() => {}}
            />
          </div>
          
          {/* AI Insight Card */}
          <div className="mt-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  Insight Oportuno (IA)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Estás perdiendo 40 prospectos por "Horario Incompatible". El algoritmo estima que existe demanda comprobada para abrir un nuevo <span className="font-bold text-amber-400">grupo entre semana a las 18:00 hrs</span> y llenarlo inmediatamente.
                </p>
                <button className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
                  Configurar Nuevo Horario <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
