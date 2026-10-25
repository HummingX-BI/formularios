import { Card } from '@/ui/components/Cards';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { Activity, DollarSign, TrendingUp, AlertTriangle, Scale, ArrowDownRight, ArrowUpRight, CheckCircle2, ChevronRight, Download } from 'lucide-react';

export default function M4_4_RevenueVsBillable() {
  
  // MOCK DATA PARA LA DEMO
  const billable = 450000; // Lo que debió cobrar
  const collected = 385000; // Lo que cobró realmente
  const fixedCosts = 180000; // Nómina, renta, etc.
  const profit = collected - fixedCosts; // Rentabilidad
  const efficiency = (collected / billable) * 100;

  // Gráfica de Cascada (Rentabilidad y Eficiencia)
  const waterfallData = [{
    type: 'waterfall',
    orientation: 'v',
    measure: ['absolute', 'relative', 'total', 'relative', 'total'],
    x: ['Facturable<br>(Potencial)', 'Cartera<br>Vencida', 'Ingreso Real<br>(Cobrado)', 'Gastos Fijos<br>(Operación)', 'Utilidad<br>Neta'],
    y: [billable, -(billable - collected), 0, -fixedCosts, 0],
    connector: { line: { color: 'rgba(203, 213, 225, 0.5)', dash: 'dot' } },
    decreasing: { marker: { color: '#f43f5e' } }, // rose-500
    increasing: { marker: { color: '#10b981' } }, // emerald-500
    totals: { marker: { color: '#0f172a' } }, // slate-900
    text: [
      formatCurrency(billable), 
      formatCurrency(-(billable - collected)), 
      formatCurrency(collected), 
      formatCurrency(-fixedCosts), 
      formatCurrency(profit)
    ],
    textposition: 'outside',
    textfont: {
      family: 'Inter, sans-serif',
      size: 13,
      color: '#475569'
    },
    hoverinfo: 'x+y'
  }];

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-indigo-100">
              <Scale className="w-3 h-3" /> Dashboard CFO
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Rentabilidad y Eficiencia
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Salud macroeconómica: del ingreso facturable hasta la utilidad neta.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Resumen Ejecutivo PDF
        </button>
      </div>

      {/* MÉTRICAS CLAVE (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Card className="p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500"><DollarSign size={100} /></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Ingreso Potencial
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{formatCurrency(billable)}</div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            Si todos los clientes pagaran a tiempo
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500"><Activity size={100} /></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Eficiencia de Cobro
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{efficiency.toFixed(1)}%</div>
          <div className="flex items-center gap-1 mt-2 px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-md w-fit border border-rose-100">
            <ArrowDownRight className="w-3.5 h-3.5" /> Fuga del {(100-efficiency).toFixed(1)}% (Cartera V.)
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500"><TrendingUp size={100} /></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> Gastos de Operación
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{formatCurrency(fixedCosts)}</div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            Nómina, renta, servicios públicos
          </div>
        </Card>

        <Card className="p-6 bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden text-white group hover:shadow-xl transition-all">
          {/* Subtle gradient glow */}
          <div className="absolute -inset-24 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" /> Utilidad Neta Libre
            </div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">{formatCurrency(profit)}</div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> Margen del {((profit/collected)*100).toFixed(1)}%
            </div>
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* GRÁFICA DE CASCADA MACROECONÓMICA */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Evolución del Flujo de Efectivo
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Visualiza cómo el ingreso potencial se diluye por la morosidad y los costos hasta convertirse en utilidad real.
            </p>
          </div>
          <div className="flex-1 min-h-[400px]">
            <PlotChart
              id="waterfall_finance"
              data={waterfallData as any}
              layout={{
                margin: { t: 80, b: 60, l: 60, r: 40 },
                xaxis: { fixedrange: true, tickfont: { size: 12, color: '#64748b', family: 'Inter' } },
                yaxis: { range: [0, billable * 1.2], fixedrange: true, tickfont: { color: '#64748b', family: 'Inter' }, tickformat: '$,.0f' },
                showlegend: false,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de cascada financiera"
              onExplain={() => {}}
            />
          </div>
        </div>

        {/* SIDEBAR: HALLAZGOS Y PLAN DE MEJORA */}
        <div className="xl:col-span-1 space-y-6">
          
          <Card className="p-6 bg-white shadow-sm border border-slate-200 overflow-hidden relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Hallazgos Financieros
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Fuga por baja eficiencia de cobro</h4>
                  <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">
                    Al tener solo un {efficiency.toFixed(1)}% de eficiencia, estás dejando en la mesa <span className="font-bold text-rose-600">{formatCurrency(billable - collected)}</span> cada mes. Prioriza la gestión de cobranza.
                  </p>
                </div>
              </div>
              
              <div className="h-px bg-slate-100"></div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Margen Operativo Saludable</h4>
                  <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">
                    Tus gastos fijos representan el {((fixedCosts/collected)*100).toFixed(1)}% de tu ingreso real. Estás en zona verde y tienes margen seguro para reinvertir en marketing o infraestructura.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 shadow-md border border-slate-800 text-white">
             <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Plan de Acción Sugerido
            </h3>
            <p className="text-sm text-slate-300 font-medium mb-6">Acciones para aumentar tu utilidad neta inmediatamente:</p>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all group">
                <div className="flex items-center gap-3 text-sm font-bold text-white">
                  <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">1</div>
                  Activar cobranza automatizada
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all group">
                <div className="flex items-center gap-3 text-sm font-bold text-white">
                  <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">2</div>
                  Congelar accesos por morosidad
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
