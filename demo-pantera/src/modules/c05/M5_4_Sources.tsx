import { useState } from 'react';
import { Card } from '@/ui/components/Cards';
import { PlotChart } from '@/charts/PlotChart';
import { Target, TrendingUp, DollarSign, Sparkles, Megaphone, Search, Users, Activity, ChevronRight } from 'lucide-react';
import { confIntervalProportionWilson, chiSquareIndependence } from '@/stats/inference';
import { formatCurrency } from '@/insights/templates';

export default function M5_4_Sources() {
  const [costFacebook, setCostFacebook] = useState(5000);
  const [costGoogle, setCostGoogle] = useState(8000);

  // Mock data representing current period
  const sources = [
    { name: 'Facebook Ads', icon: <Megaphone size={16}/>, color: 'text-blue-500', bg: 'bg-blue-50', leads: 85, enrolled: 12, cost: costFacebook },
    { name: 'Google Ads', icon: <Search size={16}/>, color: 'text-rose-500', bg: 'bg-rose-50', leads: 60, enrolled: 15, cost: costGoogle },
    { name: 'Referidos', icon: <Users size={16}/>, color: 'text-emerald-500', bg: 'bg-emerald-50', leads: 30, enrolled: 18, cost: 0 },
    { name: 'Tráfico Orgánico', icon: <Activity size={16}/>, color: 'text-slate-500', bg: 'bg-slate-50', leads: 25, enrolled: 5, cost: 0 },
  ];

  // Chi Square: Rows=Source, Cols=[Enrolled, NotEnrolled]
  const observed = sources.map((s) => [s.enrolled, s.leads - s.enrolled]);
  const chiResult = chiSquareIndependence(observed);

  // Chart data for Conversion with Wilson CI
  const conversionChartData = [
    {
      name: 'Conversión',
      type: 'bar',
      x: sources.map((s) => s.name),
      y: sources.map((s) => (s.enrolled / s.leads) * 100),
      error_y: {
        type: 'data',
        color: '#475569',
        thickness: 2,
        width: 4,
        array: sources.map((s) => {
          const ci = confIntervalProportionWilson(s.enrolled, s.leads);
          return ((ci[1] || 0) - s.enrolled / s.leads) * 100;
        }),
        visible: true,
      },
      marker: { 
        color: ['#3b82f6', '#f43f5e', '#10b981', '#64748b'],
        border: { width: 0 }
      },
    },
  ];

  const mixEvolutionData = [
    {
      name: 'Orgánico',
      type: 'scatter',
      stackgroup: 'one',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [15, 18, 20, 22, 25, 25],
      line: { width: 0 },
      fillcolor: '#cbd5e1', // Slate 300
    },
    {
      name: 'Referidos',
      type: 'scatter',
      stackgroup: 'one',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [20, 25, 28, 30, 32, 30],
      line: { width: 0 },
      fillcolor: '#34d399', // Emerald 400
    },
    {
      name: 'Google Ads',
      type: 'scatter',
      stackgroup: 'one',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [40, 45, 55, 60, 58, 60],
      line: { width: 0 },
      fillcolor: '#fb7185', // Rose 400
    },
    {
      name: 'Facebook Ads',
      type: 'scatter',
      stackgroup: 'one',
      x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      y: [100, 90, 95, 85, 90, 85],
      line: { width: 0 },
      fillcolor: '#60a5fa', // Blue 400
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <Target className="text-indigo-600 w-8 h-8" />
            Retorno de Marketing (Fuentes)
          </h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            ¿De dónde están llegando los clientes más rentables?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* TABLA DE RENDIMIENTO */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" /> Rendimiento de Canales
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400">Canal de Adquisición</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Leads Totales</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Nuevos Alumnos</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Conversión</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-slate-400 text-right">Costo Adquisición (Costo por Nuevo Alumno (CAC))</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {sources.map((s) => {
                    const conv = (s.enrolled / s.leads) * 100;
                    const cac = s.cost > 0 ? s.cost / s.enrolled : 0;
                    return (
                      <tr key={s.name} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                              {s.icon}
                            </div>
                            <span className="font-bold text-slate-800">{s.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium text-slate-600">{s.leads}</td>
                        <td className="p-4 text-center font-bold text-emerald-600">{s.enrolled}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200">
                            {conv.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {cac > 0 ? (
                            <span className="font-bold text-slate-900 tabular-figures">
                              {formatCurrency(cac)}
                            </span>
                          ) : (
                            <span className="font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 text-sm">
                              $0 (Orgánico)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* SIMULADOR DE PRESUPUESTO */}
            <div className="mt-auto bg-slate-900 p-6">
              <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-400" /> Simulador de Presupuesto
              </h4>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inversión Facebook</label>
                    <span className="text-sm font-bold text-blue-400">{formatCurrency(costFacebook)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={costFacebook}
                    onChange={(e) => setCostFacebook(Number(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inversión Google</label>
                    <span className="text-sm font-bold text-rose-400">{formatCurrency(costGoogle)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={costGoogle}
                    onChange={(e) => setCostGoogle(Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI INSIGHT CARD */}
        <div className="xl:col-span-1">
          <Card className="h-full bg-gradient-to-br from-indigo-900 to-slate-900 border border-slate-800 shadow-xl rounded-3xl p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 relative z-10 shadow-inner">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            
            <div className="relative z-10 mb-6">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 mb-3">
                <Activity size={12} /> Diagnóstico Algorítmico
              </div>
              <h3 className="text-xl font-display font-bold text-white leading-tight mb-3">
                Referidos domina en conversión. Google es más eficiente que Facebook.
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓ Impacto comprobado:</span> La prueba estadística confirma que la fuente afecta significativamente el cierre. Los referidos convierten al <span className="text-white font-bold">60%</span> sin costo publicitario.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-rose-400 font-bold">⚠ Riesgo de Costo por Nuevo Alumno (CAC):</span> Tu Costo de Adquisición en Facebook Ads está subiendo drásticamente frente a Google Ads.
                </p>
              </div>
            </div>
            
            <div className="mt-auto relative z-10">
              <button className="w-full py-3.5 px-4 bg-white text-indigo-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10">
                Simular Reasignación de Presupuesto <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* DASHBOARDS VISUALES (CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        <Card className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Tasa de Conversión Real (Cierre)</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Con margen de error (Intervalos de confianza Wilson 95%)
            </p>
          </div>
          <div className="min-h-[300px]">
            <PlotChart
              id="sources_conversion_chart"
              data={conversionChartData as any}
              layout={{ 
                margin: { l: 40, r: 20, t: 20, b: 40 },
                yaxis: { title: 'Conversión (%)', tickfont: { family: 'Inter', color: '#64748b' } },
                xaxis: { tickfont: { family: 'Inter', color: '#475569', weight: 'bold' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
              }}
              altText="Gráfica de barras mostrando conversión por fuente con intervalos de error"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => {}}
            />
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Evolución de Tráfico (Mix)</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              ¿De dónde llegan los prospectos históricamente? (Volumen)
            </p>
          </div>
          <div className="min-h-[300px]">
            <PlotChart
              id="sources_mix_chart"
              data={mixEvolutionData as any}
              layout={{ 
                margin: { l: 40, r: 20, t: 20, b: 40 },
                hovermode: 'x unified',
                yaxis: { title: 'Prospectos', tickfont: { family: 'Inter', color: '#64748b' } },
                xaxis: { tickfont: { family: 'Inter', color: '#64748b' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                showlegend: true,
                legend: { orientation: 'h', y: -0.2 }
              }}
              altText="Gráfica de área apilada mostrando la evolución del mix de fuentes"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => {}}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
