import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { HelpCircle, AlertCircle, TrendingDown, DollarSign, Activity, AlertTriangle, PieChart, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

export default function M7_4_LossReasons() {
  
  // Data de motivos de baja de alumnos INSCRITOS
  const lossReasonsData = [{
    type: 'pie',
    labels: ['Problemas Económicos', 'Mudanza / Lejanía', 'Incompatibilidad de Horario', 'Mal Servicio / Profesor', 'Motivos de Salud'],
    values: [35, 15, 25, 15, 10],
    hole: 0.65,
    marker: {
      colors: ['#64748b', '#cbd5e1', '#6366f1', '#f43f5e', '#f1f5f9'] // Slate-500, Slate-300, Indigo-500, Rose-500, Slate-100
    },
    textinfo: 'percent',
    textposition: 'outside',
    cliponaxis: false,
    hoverinfo: 'label+percent+value',
  }];

  // Impacto económico
  const financialImpact = [
    { reason: 'Problemas Económicos', count: 14, impact: 16800, controllable: false },
    { reason: 'Incompatibilidad de Horario', count: 10, impact: 12000, controllable: true },
    { reason: 'Mal Servicio / Profesor', count: 6, impact: 7200, controllable: true },
    { reason: 'Mudanza / Lejanía', count: 6, impact: 7200, controllable: false },
    { reason: 'Motivos de Salud', count: 4, impact: 4800, controllable: false },
  ];

  const totalLost = financialImpact.reduce((acc, curr) => acc + curr.impact, 0);
  const controllableLoss = financialImpact.filter(f => f.controllable).reduce((acc, curr) => acc + curr.impact, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 mb-3">
            <Activity size={12} /> Análisis Post-Mortem
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Diagnóstico de Bajas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            La autopsia operativa: por qué nos abandonan y cuánto dinero nos está costando.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI: DINERO PERDIDO */}
        <Card className="lg:col-span-1 p-8 bg-gradient-to-br from-rose-50 to-white border border-rose-200 shadow-sm rounded-3xl flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-rose-500/20"></div>
          <div className="absolute right-4 bottom-4 opacity-5"><DollarSign size={120} className="text-rose-900" /></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-6 border border-rose-200">
              <TrendingDown size={24} className="text-rose-600" />
            </div>
            <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-2">
              Fuga Financiera Mensual
            </h3>
            <div className="text-5xl font-display font-bold text-rose-600 mb-4 tracking-tight">{formatCurrency(totalLost)}</div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Pérdida recurrente acumulada por las <span className="font-bold text-rose-600">40 cancelaciones</span> procesadas este mes.
            </p>
          </div>
        </Card>

        {/* GRÁFICA DE MOTIVOS DE BAJA */}
        <Card className="lg:col-span-2 p-6 bg-white border border-slate-200 shadow-sm rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <PieChart size={20} className="text-indigo-500" /> Distribución de Quejas y Salidas
              </h3>
              <p className="text-sm text-slate-500 mt-1">Porcentaje de bajas según motivo principal</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <PlotChart
              id="loss_reasons_pie"
              data={lossReasonsData as any}
              layout={{
                margin: { t: 50, b: 50, l: 50, r: 50 },
                showlegend: true,
                legend: { orientation: 'h', y: -0.1 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { family: 'Inter', color: '#475569' }
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de dona de motivos de baja"
              onExplain={() => {}}
            />
          </div>
        </Card>

      </div>

      {/* TABLA DE IMPACTO */}
      <Card className="p-0 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <AlertCircle size={20} className="text-slate-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Impacto Económico por Causa</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Desglose de fuga operativa</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6 font-bold text-[10px] uppercase tracking-wider text-slate-400">Motivo de la Baja</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-wider text-slate-400 text-center">Alumnos Perdidos</th>
                <th className="p-4 font-bold text-[10px] uppercase tracking-wider text-slate-400 text-right">Impacto Mensual</th>
                <th className="p-4 pr-6 font-bold text-[10px] uppercase tracking-wider text-slate-400 text-center">Controlabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {financialImpact.map((item, idx) => {
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.controllable ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
                      {item.reason}
                    </td>
                    <td className="p-4 text-center font-bold text-slate-600">{item.count}</td>
                    <td className="p-4 text-right font-display font-bold text-rose-600">{formatCurrency(item.impact)}</td>
                    <td className="p-4 pr-6 text-center">
                      {item.controllable ? (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-rose-200 uppercase tracking-wider">
                          Alta (Resolver)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200 uppercase tracking-wider">
                          Baja (Externo)
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* AI INSIGHT CARD (FOOTER) */}
        <div className="p-8 bg-slate-900 border-t border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 relative z-10">
            <Sparkles size={32} className="text-rose-400" />
          </div>
          
          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 mb-3">
              <AlertTriangle size={12} /> Fuga Operativa Detectada
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              Estás perdiendo <span className="text-2xl font-display font-bold text-white mx-1">{formatCurrency(controllableLoss)}</span> mensuales por motivos que <strong className="text-rose-400">tú puedes controlar</strong> (Horarios y Mal Servicio). Habla con tu equipo de instructores hoy mismo o ejecuta el Optimizador de Horarios.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto relative z-10">
             <button className="w-full md:w-auto py-3 px-6 bg-white text-slate-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg">
              Ir a Optimizador
            </button>
          </div>
        </div>
      </Card>
      
    </div>
  );
}
