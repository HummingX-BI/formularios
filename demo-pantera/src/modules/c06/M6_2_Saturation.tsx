import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Badge } from '@/ui/components/DataDisplay';
import { AlertTriangle, TrendingUp, DollarSign, Sparkles, Activity, Clock, ArrowRight, Settings2 } from 'lucide-react';
import { formatCurrency } from '@/insights/templates';

const SATURATED = [
  {
    day: 'Sábado',
    hour: '10:00',
    occ: 100,
    waitlist: 8,
    lostLow: 4800,
    lostExpected: 6600,
    lostHigh: 8400,
  },
  {
    day: 'Lunes',
    hour: '17:00',
    occ: 95,
    waitlist: 5,
    lostLow: 3000,
    lostExpected: 4125,
    lostHigh: 5250,
  },
  {
    day: 'Martes',
    hour: '17:00',
    occ: 95,
    waitlist: 4,
    lostLow: 2400,
    lostExpected: 3300,
    lostHigh: 4200,
  },
];

const UNDERUTILIZED = [
  {
    day: 'Miércoles',
    hour: '11:00',
    occ: 40,
    free: 12,
    potLow: 2500,
    potExpected: 4500,
    potHigh: 7000,
  },
  {
    day: 'Jueves',
    hour: '11:00',
    occ: 45,
    free: 11,
    potLow: 2200,
    potExpected: 4000,
    potHigh: 6500,
  },
  {
    day: 'Viernes',
    hour: '08:00',
    occ: 50,
    free: 10,
    potLow: 2000,
    potExpected: 3800,
    potHigh: 6000,
  },
];

export default function M6_2_Saturation() {
  const [probConversion, setProbConversion] = useState(55);
  const [probFill, setProbFill] = useState(40);

  const totalLost = SATURATED.reduce(
    (acc, s) => acc + s.waitlist * 1500 * (probConversion / 100),
    0,
  );
  const totalPot = UNDERUTILIZED.reduce(
    (acc, u) => acc + u.free * 150 * 4.33 * (probFill / 100),
    0,
  );

  const waterfallData = [
    {
      name: 'Impacto',
      type: 'waterfall',
      orientation: 'v',
      measure: ['absolute', 'relative', 'relative', 'total'],
      x: ['Ingreso Actual', 'Fuga (Lista Espera)', 'Potencial (Vacíos)', 'Ingreso Óptimo'],
      textposition: 'outside',
      cliponaxis: false,
      text: [
        formatCurrency(250000), 
        `+${formatCurrency(totalLost)}`, 
        `+${formatCurrency(totalPot)}`, 
        formatCurrency(250000 + totalLost + totalPot)
      ],
      y: [250000, totalLost, totalPot, 0],
      connector: { line: { color: '#94a3b8', width: 2, dash: 'dot' } },
      decreasing: { marker: { color: '#f43f5e' } }, // Rose
      increasing: { marker: { color: '#10b981' } }, // Emerald
      totals: { marker: { color: '#6366f1' } }, // Indigo
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <AlertTriangle className="text-rose-600 w-8 h-8" />
            Detector de Oportunidades y Fugas
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿Cuánto dinero estás dejando en la mesa por ineficiencias de horarios?
          </p>
        </div>
      </div>

      {/* CONTROLES / SIMULADOR */}
      <Card className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Settings2 className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Simulador de Conversión</h3>
              <p className="text-slate-400 text-sm">Ajusta tu probabilidad de cierre</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row gap-8 w-full border-l border-slate-800 pl-8">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cierre Lista de Espera</label>
                <span className="text-sm font-bold text-rose-400">{probConversion}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="70"
                step="5"
                value={probConversion}
                onChange={(e) => setProbConversion(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Llenado Horario Libre</label>
                <span className="text-sm font-bold text-emerald-400">{probFill}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={probFill}
                onChange={(e) => setProbFill(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* TABLA SATURADOS */}
        <Card className="bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
          <div className="p-6 border-b border-rose-100 bg-rose-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-rose-950 text-lg flex items-center gap-2">
                <AlertTriangle size={20} className="text-rose-500" /> Franjas Saturadas ({'>'}90%)
              </h3>
              <p className="text-sm text-rose-700/70 font-medium">Grupos llenos perdiendo prospectos</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Fuga Estimada</div>
              <div className="text-xl font-display font-bold text-rose-600">{formatCurrency(totalLost)}<span className="text-sm font-normal text-rose-400">/mes</span></div>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">Horario</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Ocupación</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">En Espera</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Fuga Calculada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SATURATED.map((s, i) => (
                  <tr key={i} className="hover:bg-rose-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" /> {s.day} {s.hour}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex px-2 py-1 rounded bg-rose-100 text-rose-700 font-bold text-xs">{s.occ}%</span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-600">{s.waitlist}</td>
                    <td className="p-4 text-right font-bold text-rose-600">
                      {formatCurrency(s.waitlist * 1500 * (probConversion / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* TABLA SUBUTILIZADOS */}
        <Card className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
          <div className="p-6 border-b border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-emerald-950 text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" /> Franjas Subutilizadas ({'<'}60%)
              </h3>
              <p className="text-sm text-emerald-700/70 font-medium">Horas con capacidad ociosa</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Potencial de Ingreso</div>
              <div className="text-xl font-display font-bold text-emerald-600">{formatCurrency(totalPot)}<span className="text-sm font-normal text-emerald-400">/mes</span></div>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">Horario</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Ocupación</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Lugares Libres</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Potencial Calculado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {UNDERUTILIZED.map((u, i) => (
                  <tr key={i} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" /> {u.day} {u.hour}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold text-xs">{u.occ}%</span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-600">{u.free}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">
                      {formatCurrency(u.free * 150 * 4.33 * (probFill / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        
        {/* GRAFICA IMPACTO */}
        <Card className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <DollarSign size={20} className="text-indigo-500" /> Impacto Económico Total
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Diferencia entre tu ingreso actual y el ingreso optimizado mensual.
            </p>
          </div>
          <div className="min-h-[350px]">
            <PlotChart
              id="saturation_waterfall"
              data={waterfallData as any}
              layout={{ 
                margin: { l: 60, r: 20, t: 80, b: 60 },
                yaxis: { range: [0, (250000 + totalLost) * 1.2], title: 'Ingreso Estimado ($)', tickfont: { family: 'Inter', color: '#64748b' } },
                xaxis: { tickfont: { family: 'Inter', color: '#475569', weight: 'bold' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                showlegend: false
              }}
              tableData={{ columns: [], rows: [] }}
              altText="Gráfica de cascada de ingreso, pérdidas por lista de espera y potencial por huecos"
              onExplain={() => {}}
            />
          </div>
        </Card>

        {/* AI INSIGHT CARD */}
        <Card className="h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-slate-800 shadow-xl rounded-3xl p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-6 relative z-10 shadow-inner">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          
          <div className="relative z-10 mb-8">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 mb-4">
              <Activity size={12} /> Alerta de Crecimiento
            </div>
            <h3 className="text-2xl font-display font-bold text-white leading-tight mb-4">
              Urgente: Mover demanda del sábado en la mañana
            </h3>
            <div className="space-y-4">
              <p className="text-base text-slate-300 leading-relaxed">
                <span className="text-rose-400 font-bold">Diagnóstico:</span> Sábado 10:00 am genera la mayor pérdida por saturación. Tienes 8 familias esperando y no pueden pagar.
              </p>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <ul className="space-y-2 text-sm text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    Pérdida estimada en lista de espera: <span className="text-white font-bold">{formatCurrency(totalLost)}/mes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    Potencial en horarios valle: <span className="text-white font-bold">{formatCurrency(totalPot)}/mes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-auto relative z-10 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 py-3.5 px-4 bg-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
              Ejecutar Optimizador <ArrowRight size={16} />
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
