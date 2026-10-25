import { useMemo } from 'react';
import { Card } from '@/ui/components/Cards';
import { useDataset } from '@/data/hooks';
import { kaplanMeier } from '@/ml/kaplanMeier';
import { formatCurrency } from '@/insights/templates';
import { PlotChart } from '@/charts/PlotChart';
import { Sparkles, BrainCircuit, Zap, TrendingUp, Wallet, Users, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';

export default function M4_5_LTV() {
  const dataset = useDataset();

  // Kaplan-Meier calculation
  const kmResult = useMemo(() => {
    const times: number[] = [];
    const events: boolean[] = [];

    const now = new Date(dataset.metadata.generatedAt).getTime();

    dataset.students.forEach((s) => {
      const start = new Date(s.enrollmentDate).getTime();
      if (s.status === 'churned' && s.churnDate) {
        const end = new Date(s.churnDate).getTime();
        times.push((end - start) / (1000 * 3600 * 24 * 30)); 
        events.push(true);
      } else if (s.status === 'active') {
        times.push((now - start) / (1000 * 3600 * 24 * 30)); 
        events.push(false);
      }
    });

    return kaplanMeier(times, events, 36);
  }, [dataset]);

  // Mock metrics
  const avgTicket = 1250;
  const expectedMonths = kmResult.rmst36;
  const avgLtv = avgTicket * expectedMonths;
  const activeStudents = dataset.students.filter((s) => s.status === 'active').length;
  const totalBaseValue = avgLtv * activeStudents;

  // Histogram mock data (Polished for dark/light themes)
  const histogramData = [
    {
      x: Array.from(
        { length: 500 },
        () => Math.max(0, (Math.random() + Math.random() + Math.random()) / 3) * 60000,
      ),
      type: 'histogram',
      histnorm: 'probability',
      marker: { 
        color: '#6366f1', // indigo-500
        line: { color: 'white', width: 1 } 
      },
      opacity: 0.8
    },
  ];

  // Breakdown mock data (Polished)
  const breakdownData = [
    {
      name: '1 Día/Sem',
      y: ['Frecuencia'],
      x: [12000],
      type: 'bar',
      orientation: 'h',
      marker: { color: '#94a3b8' }, // slate-400
    },
    {
      name: '2 Días/Sem',
      y: ['Frecuencia'],
      x: [18000],
      type: 'bar',
      orientation: 'h',
      marker: { color: '#6366f1' }, // indigo-500
    },
    {
      name: '3 Días/Sem',
      y: ['Frecuencia'],
      x: [22000],
      type: 'bar',
      orientation: 'h',
      marker: { color: '#10b981' }, // emerald-500
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end pb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 border border-indigo-100">
              <BrainCircuit className="w-3 h-3" /> Predictive Analytics
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Valor y Predicción (LTV)</h1>
          <p className="text-base text-slate-500 mt-1 font-medium">
            Proyección algorítmica del valor monetario futuro de tu matrícula actual.
          </p>
        </div>
      </div>

      {/* SUPER HERO SECTION */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 p-8 lg:p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Main Value Proposition */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center lg:justify-start gap-2">
              <Wallet className="w-4 h-4 text-blue-400" /> Valor Total Proyectado de la Cartera Activa
            </h2>
            <div className="text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
              {formatCurrency(totalBaseValue)}
            </div>
            <p className="text-lg text-slate-300 font-medium max-w-xl">
              Si mantienes tu nivel de retención actual, estos {activeStudents} alumnos inyectarán este capital a tu negocio durante su ciclo de vida.
            </p>
          </div>

          {/* Breakdown Cards */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center lg:text-left w-48">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Ciclo Promedio</div>
              <div className="text-2xl font-bold text-white">{expectedMonths.toFixed(1)} <span className="text-base text-slate-400 font-medium">meses</span></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center lg:text-left w-48">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 mx-auto lg:mx-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">LTV por Alumno</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(avgLtv)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" /> Distribución de Ingresos
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">La mayoría de tu cartera se acumula en la primera campana.</p>
          </div>
          <div className="min-h-[300px]">
            <PlotChart
              id="ltv_histogram"
              data={histogramData as any}
              layout={{ 
                bargap: 0.1,
                margin: { t: 20, b: 40, l: 40, r: 20 },
                xaxis: { fixedrange: true, tickfont: { family: 'Inter', color: '#64748b' } },
                yaxis: { fixedrange: true, tickfont: { family: 'Inter', color: '#64748b' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
              }}
              altText="Distribución de los ingresos"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => {}}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> LTV Promedio por Frecuencia
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Los planes de 3 días tienen el LTV más alto por menor deserción.</p>
          </div>
          <div className="min-h-[300px]">
            <PlotChart
              id="ltv_breakdown"
              data={breakdownData as any}
              layout={{ 
                barmode: 'group', 
                margin: { l: 80, t: 20, b: 40, r: 20 },
                xaxis: { fixedrange: true, tickfont: { family: 'Inter', color: '#64748b' } },
                yaxis: { fixedrange: true, tickfont: { family: 'Inter', color: '#64748b' } },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                showlegend: false
              }}
              altText="Gráfica de barras horizontales"
              tableData={{ columns: [], rows: [] }}
              onExplain={() => {}}
            />
          </div>
        </div>
      </div>

      {/* AI INSIGHTS & SIMULATIONS */}
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-xl tracking-tight">Escenarios Optimizados por IA</h3>
            <p className="text-sm text-slate-500 font-medium">Oportunidades predictivas detectadas en tu base de datos actual.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Oportunidad 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4" /> Alto Impacto
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">Upsell: 1 a 2 Sesiones</h4>
            <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
              Existen 45 alumnos estables en planes de 1 día que son propensos a aceptar una invitación a 2 días.
            </p>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-500">Crecimiento LTV</span>
                <span className="text-emerald-600">+{formatCurrency(120000)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
              Lanzar Campaña <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Oportunidad 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
              <TrendingUp className="w-4 h-4" /> Media Fidelidad
            </div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">Upsell: 2 a 3 Sesiones</h4>
            <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
              El algoritmo identifica familias de ingresos medios-altos donde el niño ya superó el nivel básico.
            </p>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-500">Crecimiento LTV</span>
                <span className="text-blue-600">+{formatCurrency(45000)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors text-sm shadow-sm">
              Ver Segmento <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Oportunidad 3 */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full -z-10 blur-xl group-hover:bg-indigo-500/30 transition-colors"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">
              <BrainCircuit className="w-4 h-4" /> Prevención de Fuga
            </div>
            <h4 className="font-bold text-white text-lg mb-2">Blindar Nivel Intermedio</h4>
            <p className="text-sm text-slate-300 font-medium mb-6 leading-relaxed">
              Prevenir la frustración en alumnos de Nivel 3 salva miles de pesos en LTV. Alerta temprana activada.
            </p>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-400">Pérdida Evitada</span>
                <span className="text-indigo-300">+{formatCurrency(200000)}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm shadow-sm">
              Configurar Alertas <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
