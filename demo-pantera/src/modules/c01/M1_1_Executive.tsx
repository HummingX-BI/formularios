import { useMemo } from 'react';
import { useMetrics } from '@/metrics/hooks';
import { generateInsightsFor } from '@/insights/generators';
import { generateAlerts } from '@/insights/alerts';
import { generateRecommendations } from '@/insights/recommendations';
import { Button } from '@/ui/components/Buttons';
import { PlotChart } from '@/charts/PlotChart';
import { formatCurrency } from '@/insights/templates';
import { 
  AlertCircle, 
  Target, 
  TrendingUp, 
  Zap, 
  Users, 
  Activity,
  CheckCircle2,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export default function M1_1_Executive() {
  const metricsEngine = useMetrics();

  // Load basic metrics needed for M1.1
  const m = useMemo(() => {
    return {
      activos: metricsEngine.compute('alumnos_activos'),
      ingreso: metricsEngine.compute('ingresos_totales'),
      meta: metricsEngine.compute('meta_ingresos'),
      ocupacion: metricsEngine.compute('ocupacion_cupo'),
      prospectos: metricsEngine.compute('prospectos_nuevos'),
      retencion6m: metricsEngine.compute('retencion_6m'),
      riesgoAlto: metricsEngine.compute('riesgo_alto_baja'),
      leads: metricsEngine.compute('leads') || 120,
      contactados: metricsEngine.compute('contactados') || 85,
      citas: metricsEngine.compute('citas') || 40,
      inscritos: metricsEngine.compute('inscritos') || 15,
    };
  }, [metricsEngine]);

  const insights = useMemo(() => generateInsightsFor('m1-executive', m), [m]);
  const headline = insights.length > 0 ? insights[0]!.headline : 'Tu escuela está operando a un 85% de su capacidad financiera.';

  // Alertas de negocio mockeadas
  let alerts = useMemo(
    () =>
      generateAlerts(m, { occupancyThreshold: 95, arrearsThreshold: 30000 }, new Date()).slice(0, 3),
    [m],
  );

  if (alerts.length === 0) {
    alerts = [
      {
        id: 'mock-al-1',
        type: 'business',
        severity: 'alerta',
        title: 'Cartera Vencida Elevada',
        message: 'Tienes $45,000 MXN en colegiaturas atrasadas de este mes. Recomendamos enviar recordatorio automático hoy.',
        moduleId: 'm1-1',
        createdAt: new Date().toISOString(),
        evidence: {},
        dismissible: true
      },
      {
        id: 'mock-al-2',
        type: 'business',
        severity: 'critico',
        title: 'Fuga Crítica (Nivel Intermedio)',
        message: '15 alumnos acumulan 3 faltas consecutivas. Tienen 80% de probabilidad de no pagar el próximo mes.',
        moduleId: 'm1-1',
        createdAt: new Date().toISOString(),
        evidence: {},
        dismissible: true
      }
    ];
  }

  let recommendations = useMemo(() => generateRecommendations(m).slice(0, 3), [m]);
  if (recommendations.length === 0) {
    recommendations = [
      {
        id: 'mock-rec-1',
        title: 'Abrir grupo de Natación 4PM',
        rationale: 'Tienes 12 personas esperando este horario. Abrirlo generará $18,000 MXN mensuales casi de inmediato.',
        impact: { metric: 'ingresos', estimate: 18000, low: 15000, high: 20000, unit: 'MXN' },
        effort: 'bajo',
        category: 'revenue',
        evidence: [],
        sourceModule: 'm1-1',
        status: 'pending'
      },
      {
        id: 'mock-rec-2',
        title: 'Ofrecer Plan Superior/Extras a Familias Leales',
        rationale: 'Identificamos 40 familias que llevan >1 año sin adquirir servicios extra. Ofréceles un paquete de fin de semana.',
        impact: { metric: 'ingresos', estimate: 25000, low: 20000, high: 30000, unit: 'MXN' },
        effort: 'medio',
        category: 'retention',
        evidence: [],
        sourceModule: 'm1-1',
        status: 'pending'
      }
    ];
  }

  // Gráfica de Cascada (Brecha Financiera)
  const ingresoBase = m.ingreso > 0 ? m.ingreso : 450000;
  const waterfallData = [{
    type: "waterfall",
    orientation: "v",
    measure: ["absolute", "relative", "relative", "relative", "total"], // ABSOLUTE EL PRIMERO PARA QUE NO SE VAYA AL CIELO
    x: ["Dinero en Banco", "Morosos", "Lugares Vacíos", "Bajas Evitables", "Ingreso Potencial"],
    textposition: "outside",
    cliponaxis: false,
    text: [
      `$${(ingresoBase/1000).toFixed(0)}k`,
      `+$45k`,
      `+$120k`,
      `+$30k`,
      `$${((ingresoBase + 195000)/1000).toFixed(0)}k`
    ],
    y: [ingresoBase, 45000, 120000, 30000, 0],
    connector: { line: { color: "rgba(148, 163, 184, 0.5)", width: 1, dash: "dot" } },
    decreasing: { marker: { color: "#F43F5E" } }, 
    increasing: { marker: { color: "#10B981" } },
    totals: { marker: { color: "#2FB6D4" } }
  }];

  // CSS Custom Funnel
  const funnelSteps = [
    { label: 'Visitas y Prospectos', value: m.leads, color: 'bg-slate-800', text: 'text-white', width: '100%', drop: null },
    { label: 'Contactados / Atendidos', value: m.contactados, color: 'bg-slate-700', text: 'text-white', width: '85%', drop: '-15%' },
    { label: 'Asistieron a Clase Muestra', value: m.citas, color: 'bg-slate-500', text: 'text-white', width: '60%', drop: '-40%' },
    { label: 'Alumnos Inscritos', value: m.inscritos, color: 'bg-aqua-500', text: 'text-white', width: '35%', drop: '-60%' },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end border-b border-ice-200 pb-5 gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-jakarta font-extrabold text-navy-900 tracking-tight">
            Bienvenido, Pantera.
          </h1>
          <p className="text-xl text-secundario mt-2 font-medium">
            <span className="text-navy-700 font-bold">Tu ecosistema de inteligencia está listo para ejecutar.</span> {headline}
          </p>
        </div>
        
        <div className="flex flex-col xl:flex-row items-end xl:items-center gap-6 shrink-0">
          {/* Cita Inspiradora */}
          <div className="text-right xl:border-r border-ice-200 xl:pr-6">
            <p className="text-sm text-navy-800 font-serif italic max-w-[250px] leading-snug">
              "Si no puedes medirlo, no puedes gestionarlo."
            </p>
            <p className="text-[10px] text-secundario font-bold uppercase tracking-widest mt-1.5">
              — Peter Drucker
            </p>
          </div>
          
          {/* Estado Global */}
          <div className="text-right">
            <p className="text-xs text-tenue font-bold uppercase tracking-widest mb-1.5">Estado Global</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <span className="text-navy-900 font-bold text-sm tracking-wide">ÓPTIMO</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO METRICS SECTION (No más tarjetitas básicas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric 1: Revenue (Premium Card) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 opacity-10">
            <TrendingUp size={180} />
          </div>
          <div>
            <h3 className="text-ice-300 font-medium text-lg uppercase tracking-wider">Flujo de Efectivo</h3>
            <div className="text-5xl font-extrabold mt-3 font-jakarta drop-shadow-md">
              {formatCurrency(ingresoBase)}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
            <TrendingUp size={18} className="text-green-400" />
            <span className="text-sm font-medium text-green-300">+12.5% superando la meta mensual</span>
          </div>
        </div>

        {/* Metric 2: Active Students */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-ice-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 text-navy-900">
            <Users size={120} />
          </div>
          <div>
            <h3 className="text-secundario font-bold text-sm uppercase tracking-wider">Comunidad Activa</h3>
            <div className="text-5xl font-extrabold mt-3 text-navy-900 font-jakarta">{m.activos}</div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-green-600 font-medium">
            <TrendingUp size={18} />
            <span className="text-sm">+2.4% vs mes anterior</span>
          </div>
        </div>

        {/* Grouped Secondary Metrics */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-ice-100 flex flex-col justify-center">
            <div className="text-xs text-secundario font-bold uppercase mb-1">Ocupación</div>
            <div className="text-3xl font-extrabold text-navy-900">{m.ocupacion.toFixed(1)}%</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-ice-100 flex flex-col justify-center">
            <div className="text-xs text-secundario font-bold uppercase mb-1">Retención</div>
            <div className="text-3xl font-extrabold text-navy-900">{m.retencion6m.toFixed(1)}%</div>
          </div>
          <div className="bg-red-50 rounded-xl p-5 shadow-sm border border-red-200 col-span-2 flex justify-between items-center group cursor-pointer hover:bg-red-100 transition-colors">
            <div>
              <div className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">
                Alerta de Deserción
              </div>
              <div className="text-2xl font-extrabold text-red-700 flex items-center gap-2">
                {m.riesgoAlto} alumnos en riesgo
              </div>
            </div>
            <AlertCircle className="text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" size={40} />
          </div>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Waterfall Chart */}
        <section className="bg-white rounded-2xl shadow-sm border border-ice-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-ice-100">
            <h3 className="text-xl font-extrabold font-jakarta text-navy-900 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} fill="currentColor" />
              Dinero sobre la Mesa
            </h3>
            <p className="text-sm text-secundario mt-1">
              ¿Cuánto más podrías ganar este mes si resolvesmos estas áreas?
            </p>
          </div>
          <div className="p-4 flex-1 min-h-[300px]">
            <PlotChart
              id="waterfall-gap"
              data={waterfallData as any}
              layout={{
                margin: { t: 80, b: 40, l: 50, r: 20 },
                waterfallgap: 0.2,
                yaxis: { range: [0, (ingresoBase + 195000) * 1.2] },
                font: { family: 'Plus Jakarta Sans, sans-serif' }
              }}
              tableData={{columns: [], rows: []}}
              altText="Gráfica de cascada"
              onExplain={() => {}}
            />
          </div>
        </section>

        {/* Custom Funnel */}
        <section className="bg-white rounded-2xl shadow-sm border border-ice-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-ice-100">
            <h3 className="text-xl font-extrabold font-jakarta text-navy-900 flex items-center gap-2">
              <Target className="text-aqua-500" size={24} />
              Eficiencia de Ventas
            </h3>
            <p className="text-sm text-secundario mt-1">
              Descubre en qué momento de la venta los clientes deciden no comprar.
            </p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center gap-3 bg-white">
             {funnelSteps.map((step, idx) => (
               <div key={idx} className="relative w-full flex items-center group">
                 {/* Barra de progreso de fondo */}
                 <div 
                   className={`absolute left-0 top-0 h-full rounded-xl transition-all duration-1000 ease-out opacity-10 ${step.color}`}
                   style={{ width: step.width }}
                 ></div>
                 
                 {/* Contenido del paso */}
                 <div className="w-full flex justify-between items-center p-3 sm:p-4 z-10 border border-transparent group-hover:border-slate-100 rounded-xl transition-colors">
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${step.color}`}>
                       <span className="font-bold">{idx + 1}</span>
                     </div>
                     <span className="font-jakarta font-bold text-lg text-slate-800">{step.label}</span>
                   </div>
                   
                   <div className="flex items-center gap-6">
                     {step.drop && (
                       <div className="flex flex-col items-end opacity-80 group-hover:opacity-100 transition-opacity">
                         <div className="flex items-center gap-1 text-coral bg-red-50 px-2 py-1 rounded-md text-xs font-bold border border-red-100">
                           <TrendingDown size={14} /> {step.drop}
                         </div>
                       </div>
                     )}
                     <div className="text-right w-16">
                       <span className="text-3xl font-extrabold text-navy-900">{step.value}</span>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </section>
      </div>

      {/* ACTIONABLE CARDS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3 className="text-2xl font-extrabold font-jakarta text-navy-900 mb-6 flex items-center gap-2">
            <AlertCircle className="text-coral" size={24} />
            Focos Rojos a Atender
          </h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="group p-5 bg-white border-2 border-transparent hover:border-red-200 shadow-sm hover:shadow-md transition-all rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-coral"></div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-extrabold text-navy-900 text-lg mb-1">{alert.title}</h4>
                    <p className="text-secundario leading-relaxed">{alert.message}</p>
                  </div>
                  <Button variant="secondary" className="bg-red-50 text-red-700 hover:bg-coral hover:text-white border-0 font-bold shrink-0">
                    Resolver <ArrowRight size={16} className="ml-2 inline" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-extrabold font-jakarta text-navy-900 mb-6 flex items-center gap-2">
            <Activity className="text-green-500" size={24} />
            Oportunidades de Crecimiento
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="group p-5 bg-white border-2 border-transparent hover:border-green-200 shadow-sm hover:shadow-md transition-all rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-extrabold text-navy-900 text-lg">{rec.title}</h4>
                      <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                        +{rec.impact ? `$${(rec.impact.estimate/1000).toFixed(0)}k` : 'Alto'}
                      </span>
                    </div>
                    <p className="text-secundario leading-relaxed mb-4">{rec.rationale}</p>
                    <div className="flex gap-3">
                      <Button variant="primary" className="font-bold bg-green-600 hover:bg-green-700 border-0">
                        <CheckCircle2 size={16} className="mr-2 inline" /> Aplicar Estrategia
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
